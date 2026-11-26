/**
 * End-to-end through the real /api/trpc route handler (route.ts createContext
 * + fetch adapter + lesson router), with Rails mocked at loadLessonViewUrl.
 */
import {NextRequest} from 'next/server'
import superjson from 'superjson'
import {loadLessonViewUrl} from '@/lib/lessons'
import {ACCESS_TOKEN_KEY} from '@/utils/auth'

jest.mock('@/server/prisma', () => ({prisma: {}}))
jest.mock('@/lib/lessons', () => ({
  loadLessonViewUrl: jest.fn(),
  loadLesson: jest.fn(async (slug: string) => ({slug, title: 'Shared'})),
  loadAssociatedLessonsByTag: jest.fn(async () => []),
  isGraphQL403: jest.fn(() => false),
}))
jest.mock('@/server/routers/_app', () => {
  const {router} = jest.requireActual('@/server/trpc')
  const {lessonRouter} = jest.requireActual('@/server/routers/lesson')
  return {appRouter: router({lesson: lessonRouter})}
})

// eslint-disable-next-line import/first
import {GET, POST} from '@/app/api/trpc/[trpc]/route'

const mockedLoad = loadLessonViewUrl as jest.Mock
const VIEW_URL = 'https://rails.example/api/v1/lessons/some-lesson/views'
const TEST_TOKEN = 'test-token-not-real'

const batchBody = (input: unknown) =>
  JSON.stringify({0: superjson.serialize(input)})

const postViewUrl = (cookie?: string) =>
  POST(
    new NextRequest(
      'http://localhost/api/trpc/lesson.getLessonViewUrl?batch=1',
      {
        method: 'POST',
        body: batchBody({slug: 'some-lesson'}),
        headers: {
          'content-type': 'application/json',
          ...(cookie ? {cookie} : {}),
        },
      },
    ),
  )

const readBatch = async (res: Response) => {
  const [first] = await res.json()
  return first
}

beforeEach(() => {
  mockedLoad.mockReset()
  mockedLoad.mockImplementation(async (_slug: string, token?: string) =>
    token ? VIEW_URL : null,
  )
  jest.spyOn(console, 'log').mockImplementation(() => undefined)
})

afterEach(() => {
  jest.restoreAllMocks()
})

test('reads the viewer token from the access-token cookie', async () => {
  expect(ACCESS_TOKEN_KEY).toBeTruthy()
  const res = await postViewUrl(`${ACCESS_TOKEN_KEY}=${TEST_TOKEN}`)

  expect(res.status).toBe(200)
  expect(mockedLoad).toHaveBeenCalledTimes(1)
  expect(mockedLoad.mock.calls[0][0]).toBe('some-lesson')
  expect(mockedLoad.mock.calls[0][1]).toBe(TEST_TOKEN)
  const body = await readBatch(res)
  expect(superjson.deserialize(body.result.data)).toEqual({
    slug: 'some-lesson',
    lesson_view_url: VIEW_URL,
  })
})

test('without the cookie it passes no token and returns no URL', async () => {
  const res = await postViewUrl()

  expect(res.status).toBe(200)
  expect(mockedLoad.mock.calls[0][1]).toBeUndefined()
  const body = await readBatch(res)
  expect(superjson.deserialize(body.result.data)).toEqual({
    slug: 'some-lesson',
    lesson_view_url: null,
  })
})

test('the per-user response carries no cacheable Cache-Control header', async () => {
  const res = await postViewUrl(`${ACCESS_TOKEN_KEY}=${TEST_TOKEN}`)
  const cacheControl = res.headers.get('cache-control') ?? ''
  expect(cacheControl).not.toMatch(/public|s-maxage|max-age=[1-9]/i)
})

test('it cannot be fetched with GET, alone or batched with the shared lesson query', async () => {
  const input = encodeURIComponent(
    JSON.stringify({
      0: superjson.serialize({slug: 'some-lesson'}),
      1: superjson.serialize({slug: 'some-lesson'}),
    }),
  )
  const res = await GET(
    new NextRequest(
      `http://localhost/api/trpc/lesson.getLessonbySlug,lesson.getLessonViewUrl?batch=1&input=${input}`,
      {
        method: 'GET',
        headers: {cookie: `${ACCESS_TOKEN_KEY}=${TEST_TOKEN}`},
      },
    ),
  )

  const results = await res.json()
  // the shared query answers; the per-user procedure refuses a GET
  expect(results[0].result).toBeDefined()
  expect(results[1].error).toBeDefined()
  // GET only resolves query procedures; the mutation is unreachable by GET
  expect(results[1].error.json.message).toBe(
    'No "query"-procedure on path "lesson.getLessonViewUrl"',
  )
  expect(mockedLoad).not.toHaveBeenCalled()
})
