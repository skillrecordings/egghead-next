/**
 * The download route logs one `lesson.download.result` line naming the
 * resolved viewer, with Rails (fetchEggheadUser) and Course Builder mocked.
 */
import {NextRequest} from 'next/server'
import fetchEggheadUser from '@/api/egghead/users/from-token'
import {getCourseBuilderLesson} from '@/lib/get-course-builder-metadata'
import {logEvent} from '@/utils/structured-log'

jest.mock('@/api/egghead/users/from-token', () => ({
  __esModule: true,
  default: jest.fn(),
}))
jest.mock('@/lib/get-course-builder-metadata', () => ({
  getCourseBuilderLesson: jest.fn(),
}))
jest.mock('@/lib/mux', () => ({getMuxAsset: jest.fn()}))
jest.mock('@/utils/structured-log', () => ({logEvent: jest.fn()}))

// eslint-disable-next-line import/first
import {GET} from '@/app/api/lessons/[slug]/download/route'

const mockedFetchUser = fetchEggheadUser as jest.Mock
const mockedLesson = getCourseBuilderLesson as jest.Mock
const mockedLogEvent = logEvent as jest.Mock
const TEST_TOKEN = 'test-token-not-real'
const SLUG = 'some-lesson'

const request = (headers: Record<string, string> = {}) =>
  GET(
    new NextRequest(`http://localhost/api/lessons/${SLUG}/download`, {
      headers,
    }),
    {params: Promise.resolve({slug: SLUG})},
  )

const downloadResults = () =>
  mockedLogEvent.mock.calls.filter(
    ([, event]) => event === 'lesson.download.result',
  )

let consoleLog: jest.SpyInstance
let consoleError: jest.SpyInstance

beforeEach(() => {
  jest.clearAllMocks()
  consoleLog = jest.spyOn(console, 'log').mockImplementation(() => {})
  consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
  mockedLesson.mockResolvedValue({muxPlaybackId: 'playback-not-real'})
})

afterEach(() => {
  consoleLog.mockRestore()
  consoleError.mockRestore()
})

test('member via Bearer header: logs user_id and outcome granted', async () => {
  mockedFetchUser.mockResolvedValue({id: 1234, is_pro: true})

  const res = await request({
    cookie: 'theme=dark',
    authorization: `Bearer ${TEST_TOKEN}`,
  })

  expect(res.status).toBe(200)
  expect(mockedFetchUser).toHaveBeenCalledWith(TEST_TOKEN)
  expect(downloadResults()).toEqual([
    [
      'info',
      'lesson.download.result',
      {user_id: 1234, outcome: 'granted', slug: SLUG, auth: 'bearer'},
    ],
  ])

  // the wrapper's api.call line now sees the Bearer token too
  const apiCall = consoleLog.mock.calls
    .map(([line]) => {
      try {
        return JSON.parse(line)
      } catch {
        return null
      }
    })
    .find((log) => log?.event === 'api.call')
  expect(apiCall).toMatchObject({has_token: true, status: 200})
})

test('non-member via egghead_token cookie: logs user_id and not_member', async () => {
  mockedFetchUser.mockResolvedValue({id: 5678, is_pro: false})

  const res = await request({cookie: `egghead_token=${TEST_TOKEN}`})

  expect(res.status).toBe(403)
  expect(downloadResults()).toEqual([
    [
      'info',
      'lesson.download.result',
      {user_id: 5678, outcome: 'not_member', slug: SLUG, auth: 'cookie'},
    ],
  ])
  expect(mockedLesson).not.toHaveBeenCalled()
})

test('anonymous: logs null user_id and auth none', async () => {
  const res = await request()

  expect(res.status).toBe(403)
  expect(mockedFetchUser).not.toHaveBeenCalled()
  expect(downloadResults()).toEqual([
    [
      'info',
      'lesson.download.result',
      {user_id: null, outcome: 'not_member', slug: SLUG, auth: 'none'},
    ],
  ])
})

test('member, lesson missing: outcome not_found', async () => {
  mockedFetchUser.mockResolvedValue({id: 1234, is_pro: true})
  mockedLesson.mockResolvedValue(null)

  const res = await request({authorization: `Bearer ${TEST_TOKEN}`})

  expect(res.status).toBe(404)
  expect(downloadResults()[0][2]).toMatchObject({
    user_id: 1234,
    outcome: 'not_found',
  })
})

test('no download log line carries the token, email or name', async () => {
  mockedFetchUser.mockResolvedValue({
    id: 1234,
    is_pro: true,
    email: 'member@example.com',
    full_name: 'Member Person',
  })

  await request({authorization: `Bearer ${TEST_TOKEN}`})

  const logged = JSON.stringify(mockedLogEvent.mock.calls)
  expect(logged).not.toContain(TEST_TOKEN)
  expect(logged).not.toContain('member@example.com')
  expect(logged).not.toContain('Member Person')
})
