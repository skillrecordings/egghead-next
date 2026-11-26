/**
 * The talks page is server-rendered and CDN-cached (s-maxage), so its props
 * are shared by every visitor. The viewer-gated lesson_view_url must never be
 * in them: it only ever comes from the per-viewer POST mutation.
 */
import {getServerSideProps} from '@/pages/talks/[slug]'
import {loadLesson} from '@/lib/lessons'

jest.mock('@/lib/lessons', () => ({
  ...jest.requireActual('@/lib/lessons'),
  loadLesson: jest.fn(),
}))
jest.mock('@/components/talks/talk-player', () => () => null)
jest.mock('@/components/talks/page-seo', () => () => null)
jest.mock('@/components/pages/lessons/transcript', () => () => null)
jest.mock('@/hooks/use-enhanced-transcript', () => ({
  useEnhancedTranscript: () => null,
}))
jest.mock('@skillrecordings/player', () => ({VideoProvider: () => null}))
jest.mock('@/app/_trpc/client', () => ({trpc: {}}))
jest.mock('react-markdown', () => () => null)

const mockedLoadLesson = loadLesson as jest.Mock
const VIEW_URL = 'https://rails.example/api/v1/lessons/some-talk/views'

const run = async () => {
  const headers: Record<string, string> = {}
  const res = {
    setHeader: (name: string, value: string) => {
      headers[name.toLowerCase()] = value
    },
    getHeader: (name: string) => headers[name.toLowerCase()],
    statusCode: 200,
  }
  const result: any = await getServerSideProps({
    params: {slug: 'some-talk'},
    query: {slug: 'some-talk'},
    req: {headers: {}, url: '/talks/some-talk'},
    res,
    resolvedUrl: '/talks/some-talk',
  } as any)
  return {result, headers}
}

beforeEach(() => {
  mockedLoadLesson.mockReset()
  jest.spyOn(console, 'log').mockImplementation(() => undefined)
})

afterEach(() => jest.restoreAllMocks())

test('a lesson_view_url never reaches the shared, CDN-cached props', async () => {
  // even if a loader ever returned one, the page must strip it
  mockedLoadLesson.mockResolvedValue({
    slug: 'some-talk',
    title: 'Some Talk',
    path: '/talks/some-talk',
    lesson_view_url: VIEW_URL,
  })

  const {result, headers} = await run()

  expect(headers['cache-control']).toMatch(/s-maxage/)
  expect(result.props.initialLesson.slug).toBe('some-talk')
  expect(result.props.initialLesson.title).toBe('Some Talk')
  expect(result.props.initialLesson.lesson_view_url).toBeNull()
  expect(JSON.stringify(result.props)).not.toContain(VIEW_URL)
})

test('the SSR load is not authenticated', async () => {
  mockedLoadLesson.mockResolvedValue({slug: 'some-talk', path: '/talks/x'})
  await run()
  // loadLesson(slug) with no token and no useAuth: the viewer's token is
  // never used to build the shared payload
  expect(mockedLoadLesson).toHaveBeenCalledWith('some-talk')
})

const runWith = async (query: Record<string, string>) => {
  const res = {
    setHeader: jest.fn(),
    getHeader: jest.fn(),
    statusCode: 200,
  }
  return (await getServerSideProps({
    params: {slug: 'some-talk'},
    query,
    req: {headers: {}, url: '/talks/some-talk'},
    res,
    resolvedUrl: '/talks/some-talk',
  } as any)) as any
}

describe('every getServerSideProps branch is free of viewer-gated URLs', () => {
  const gated = {
    slug: 'some-talk',
    title: 'Some Talk',
    path: '/talks/some-talk',
    lesson_view_url: VIEW_URL,
    complete_url: `${VIEW_URL}/1/complete`,
  }

  test('props branch', async () => {
    mockedLoadLesson.mockResolvedValue(gated)
    const result = await runWith({slug: 'some-talk'})
    expect(result.props.initialLesson.lesson_view_url).toBeNull()
    expect('complete_url' in result.props.initialLesson).toBe(false)
    expect(JSON.stringify(result)).not.toContain(VIEW_URL)
  })

  test('canonical-query redirect branch carries no lesson', async () => {
    mockedLoadLesson.mockResolvedValue(gated)
    const result = await runWith({slug: 'some-talk', nxtPslug: 'some-talk'})
    expect(result.redirect).toBeDefined()
    expect(result.props).toBeUndefined()
    expect(JSON.stringify(result)).not.toContain(VIEW_URL)
  })

  test('alias-slug redirect branch carries only the path', async () => {
    mockedLoadLesson.mockResolvedValue({...gated, slug: 'canonical-talk'})
    const result = await runWith({slug: 'some-talk'})
    expect(result.redirect.destination).toBe('/talks/some-talk')
    expect(result.props).toBeUndefined()
    expect(JSON.stringify(result)).not.toContain(VIEW_URL)
  })

  test('error branch carries no lesson', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
    mockedLoadLesson.mockRejectedValue(new Error('boom'))
    const result = await runWith({slug: 'some-talk'})
    expect(result.redirect.destination).toBe('/')
    expect(JSON.stringify(result)).not.toContain(VIEW_URL)
  })

  test('missing lesson: props carry nothing gated', async () => {
    mockedLoadLesson.mockResolvedValue(undefined)
    const result = await runWith({slug: 'some-talk'})
    expect(JSON.stringify(result ?? {})).not.toContain(VIEW_URL)
  })
})
