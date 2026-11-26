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
