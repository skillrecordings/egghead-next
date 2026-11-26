/**
 * @jest-environment jsdom
 */
import axios from 'axios'
import {
  trackLessonProgress as onProgress,
  trackLessonEnded as onEnded,
  beginLessonViewSession,
  flushPendingLessonView,
} from '../use-egghead-player'
import {
  lessonViewUrlFor,
  tokenOwnerKey,
  withLessonViewUrl,
  ANONYMOUS_OWNER,
} from '../use-lesson-view-url'

jest.mock('axios', () => ({
  __esModule: true,
  default: {post: jest.fn(), put: jest.fn(), create: jest.fn(() => ({}))},
}))
jest.mock('@/app/_trpc/client', () => ({trpc: {}}))
jest.mock('@/utils/analytics', () => ({
  __esModule: true,
  default: {events: {}},
}))

const mockedAxios = axios as unknown as {post: jest.Mock; put: jest.Mock}

const VIEW_URL = 'https://rails.example/api/v1/lessons/some-lesson/views'
const OWNER = 'viewer:1'

const baseLesson = {
  id: 42,
  slug: 'some-lesson',
  lesson_view_url: null as string | null,
  tags: [] as any[],
}

// Player progress state is module-level, so each test uses its own slug.
let slugCounter = 0
const freshLesson = (lesson_view_url: string | null) => ({
  ...baseLesson,
  slug: `some-lesson-${++slugCounter}`,
  lesson_view_url,
})
const withUrl = <T extends object>(lesson: T) => ({
  ...lesson,
  lesson_view_url: VIEW_URL,
})

const createCalls = () =>
  mockedAxios.post.mock.calls.filter(([url]) => url === VIEW_URL)
const incrementCalls = () =>
  mockedAxios.put.mock.calls.filter(([url]) => url.endsWith('/increment'))

beforeEach(() => {
  mockedAxios.post.mockReset()
  mockedAxios.put.mockReset()
  mockedAxios.post.mockResolvedValue({
    data: {
      increment_url: `${VIEW_URL}/1/increment`,
      complete_url: `${VIEW_URL}/1/complete`,
      series: null,
    },
  })
  mockedAxios.put.mockResolvedValue({data: {series: null}})
})

describe('lessonViewUrlFor', () => {
  const issued = {slug: 'some-lesson', owner: OWNER, lesson_view_url: VIEW_URL}

  test('returns the URL issued for this lesson and viewer', () => {
    expect(lessonViewUrlFor('some-lesson', OWNER, issued)).toBe(VIEW_URL)
  })

  test('never returns the previous lesson URL for a new lesson', () => {
    expect(lessonViewUrlFor('next-lesson', OWNER, issued)).toBeNull()
  })

  test('never returns another viewer URL', () => {
    expect(lessonViewUrlFor('some-lesson', 'viewer:2', issued)).toBeNull()
    expect(lessonViewUrlFor('some-lesson', ANONYMOUS_OWNER, issued)).toBeNull()
  })

  test('returns null when nothing was issued', () => {
    expect(lessonViewUrlFor('some-lesson', OWNER, null)).toBeNull()
  })

  test('owner keys', () => {
    expect(tokenOwnerKey(undefined)).toBe(ANONYMOUS_OWNER)
    expect(tokenOwnerKey('tok-7')).toMatch(/^token:/)
  })
})

describe('withLessonViewUrl', () => {
  test('merges the per-viewer URL when present', () => {
    expect(withLessonViewUrl(baseLesson, VIEW_URL).lesson_view_url).toBe(
      VIEW_URL,
    )
  })

  test('leaves the lesson untouched for anonymous viewers', () => {
    expect(withLessonViewUrl(baseLesson, null)).toBe(baseLesson)
    expect(withLessonViewUrl(baseLesson, undefined)).toBe(baseLesson)
  })

  test('keeps identity when the URL is already merged', () => {
    const tracked = withLessonViewUrl(baseLesson, VIEW_URL)
    expect(withLessonViewUrl(tracked, VIEW_URL)).toBe(tracked)
  })
})

describe('player view posts', () => {
  test('posts a view when the lesson carries lesson_view_url', async () => {
    const lesson = freshLesson(VIEW_URL)
    await onProgress({playedSeconds: 30}, lesson)

    expect(createCalls()).toHaveLength(1)
    expect(createCalls()[0][1]).toEqual({lesson_view: {lesson_id: 42}})
  })

  test('posts nothing when lesson_view_url is absent (anonymous)', async () => {
    const lesson = freshLesson(null)
    await onProgress({playedSeconds: 30}, lesson)
    await onEnded(lesson)

    expect(mockedAxios.post).not.toHaveBeenCalled()
    expect(mockedAxios.put).not.toHaveBeenCalled()
  })

  test('repeated events for the same segment post once, even with a refetched lesson object', async () => {
    const lesson = freshLesson(VIEW_URL)
    await onProgress({playedSeconds: 30}, lesson)
    await onProgress({playedSeconds: 29.9}, {...lesson})
    await onProgress({playedSeconds: 30}, {...lesson})

    expect(createCalls()).toHaveLength(1)
  })

  test('completion posts the view then PUTs complete_url', async () => {
    const lesson = freshLesson(VIEW_URL)
    await onEnded(lesson)

    expect(createCalls()).toHaveLength(1)
    expect(mockedAxios.put).toHaveBeenCalledWith(
      `${VIEW_URL}/1/complete`,
      {},
      expect.anything(),
    )
  })
})

describe('late URL flush', () => {
  test('segments played before the URL arrives are posted once, with the real segment count', async () => {
    const lesson = freshLesson(null)
    beginLessonViewSession(lesson.slug, OWNER)

    await onProgress({playedSeconds: 30}, lesson)
    await onProgress({playedSeconds: 60}, lesson)
    expect(mockedAxios.post).not.toHaveBeenCalled()

    await flushPendingLessonView(withUrl(lesson) as any, OWNER)
    expect(createCalls()).toHaveLength(1)
    // RevenueShareQuery sums segments: two watched segments, two increments
    expect(incrementCalls()).toHaveLength(2)

    await flushPendingLessonView(withUrl(lesson) as any, OWNER)
    expect(createCalls()).toHaveLength(1)
  })

  test('flush and later segments share one (lesson, collection) key', async () => {
    const lesson = freshLesson(null)
    beginLessonViewSession(lesson.slug, OWNER)
    await onProgress({playedSeconds: 30}, lesson)

    await flushPendingLessonView(withUrl(lesson) as any, OWNER)
    await onProgress({playedSeconds: 60}, withUrl(lesson))

    const bodies = createCalls().map(([, body]) => body)
    expect(bodies).toHaveLength(2)
    // same lesson, same (absent) collection: Rails find_or_create_by hits
    // the same row both times
    expect(new Set(bodies.map((b) => JSON.stringify(b))).size).toBe(1)
  })

  test('flush and a segment at the same boundary never create concurrently', async () => {
    const lesson = freshLesson(null)
    beginLessonViewSession(lesson.slug, OWNER)
    await onProgress({playedSeconds: 30}, lesson)

    let inFlight = 0
    let maxInFlight = 0
    mockedAxios.post.mockImplementation(async () => {
      inFlight += 1
      maxInFlight = Math.max(maxInFlight, inFlight)
      await new Promise((r) => setTimeout(r, 5))
      inFlight -= 1
      return {data: {increment_url: `${VIEW_URL}/1/increment`}}
    })

    await Promise.all([
      flushPendingLessonView(withUrl(lesson) as any, OWNER),
      onProgress({playedSeconds: 60}, withUrl(lesson)),
    ])

    expect(createCalls()).toHaveLength(2)
    expect(maxInFlight).toBe(1)
  })

  test('a reopened lesson with no play posts nothing', async () => {
    const lesson = freshLesson(null)
    // earlier visit in this tab, anonymous, played a segment
    beginLessonViewSession(lesson.slug, ANONYMOUS_OWNER)
    await onProgress({playedSeconds: 30}, lesson)

    // the lesson is opened again by a signed-in viewer, no playback yet
    beginLessonViewSession(lesson.slug, OWNER)
    await flushPendingLessonView(withUrl(lesson) as any, OWNER)

    expect(mockedAxios.post).not.toHaveBeenCalled()
  })

  test('anonymous segments are not credited after signing in', async () => {
    const lesson = freshLesson(null)
    beginLessonViewSession(lesson.slug, ANONYMOUS_OWNER)
    await onProgress({playedSeconds: 30}, lesson)
    await onProgress({playedSeconds: 60}, lesson)

    // sign in mid-lesson: the hook opens a fresh session for the new viewer
    beginLessonViewSession(lesson.slug, OWNER)
    await flushPendingLessonView(withUrl(lesson) as any, OWNER)
    expect(mockedAxios.post).not.toHaveBeenCalled()

    // watching on after sign-in still posts normally
    await onProgress({playedSeconds: 90}, withUrl(lesson))
    expect(createCalls()).toHaveLength(1)
    expect(incrementCalls()).toHaveLength(1)
  })

  test('a URL granted to a different viewer cannot flush this session', async () => {
    const lesson = freshLesson(null)
    beginLessonViewSession(lesson.slug, OWNER)
    await onProgress({playedSeconds: 30}, lesson)

    await flushPendingLessonView(withUrl(lesson) as any, 'viewer:2')
    expect(mockedAxios.post).not.toHaveBeenCalled()
  })

  test('without a session (no hook), nothing is queued', async () => {
    const lesson = freshLesson(null)
    await onProgress({playedSeconds: 30}, lesson)
    await flushPendingLessonView(withUrl(lesson) as any, OWNER)
    expect(mockedAxios.post).not.toHaveBeenCalled()
  })

  test('flush posts nothing when no segment was played', async () => {
    const lesson = freshLesson(null)
    beginLessonViewSession(lesson.slug, OWNER)
    await flushPendingLessonView(withUrl(lesson) as any, OWNER)
    expect(mockedAxios.post).not.toHaveBeenCalled()
  })

  test('flush posts nothing without a URL', async () => {
    const lesson = freshLesson(null)
    beginLessonViewSession(lesson.slug, OWNER)
    await onProgress({playedSeconds: 30}, lesson)
    await flushPendingLessonView(lesson as any, OWNER)
    expect(mockedAxios.post).not.toHaveBeenCalled()
  })

  test('a lesson that ended before the URL arrived is completed once it lands', async () => {
    const lesson = freshLesson(null)
    beginLessonViewSession(lesson.slug, OWNER)
    await onEnded(lesson)
    expect(mockedAxios.post).not.toHaveBeenCalled()

    await flushPendingLessonView(withUrl(lesson) as any, OWNER)
    expect(createCalls()).toHaveLength(1)
    expect(mockedAxios.put).toHaveBeenCalledWith(
      `${VIEW_URL}/1/complete`,
      {},
      expect.anything(),
    )

    await flushPendingLessonView(withUrl(lesson) as any, OWNER)
    expect(createCalls()).toHaveLength(1)
  })
})
