/**
 * @jest-environment jsdom
 */
import axios from 'axios'

import {
  trackLessonProgress as onProgress,
  trackLessonEnded as onEnded,
  flushPendingLessonView,
} from '../use-egghead-player'

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

const baseLesson = {
  id: 42,
  slug: 'some-lesson',
  lesson_view_url: null as string | null,
  tags: [] as any[],
}

// onProgress keeps per-slug progress at module scope, so each test uses its
// own slug.
let slugCounter = 0
const freshLesson = (lesson_view_url: string | null) => ({
  ...baseLesson,
  slug: `some-lesson-${++slugCounter}`,
  lesson_view_url,
})

describe('lessonViewUrlFor', () => {
  const {lessonViewUrlFor} = require('../use-lesson-view-url')

  test('returns the URL issued for this lesson', () => {
    expect(
      lessonViewUrlFor('some-lesson', {
        slug: 'some-lesson',
        lesson_view_url: VIEW_URL,
      }),
    ).toBe(VIEW_URL)
  })

  test('never returns the previous lesson URL for a new lesson', () => {
    expect(
      lessonViewUrlFor('next-lesson', {
        slug: 'some-lesson',
        lesson_view_url: VIEW_URL,
      }),
    ).toBeNull()
  })

  test('returns null when nothing was issued', () => {
    expect(lessonViewUrlFor('some-lesson', null)).toBeNull()
    expect(lessonViewUrlFor(undefined, null)).toBeNull()
  })
})

describe('withLessonViewUrl', () => {
  const {withLessonViewUrl} = require('../use-lesson-view-url')

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

  test('posts a view when the lesson carries lesson_view_url', async () => {
    const lesson = freshLesson(VIEW_URL)

    await onProgress({playedSeconds: 30}, lesson)

    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
    expect(mockedAxios.post.mock.calls[0][0]).toBe(VIEW_URL)
    expect(mockedAxios.post.mock.calls[0][1]).toEqual({
      lesson_view: {lesson_id: 42},
    })
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

    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
  })

  test('completion posts the view then PUTs complete_url', async () => {
    const lesson = freshLesson(VIEW_URL)

    await onEnded(lesson)

    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
    expect(mockedAxios.put).toHaveBeenCalledWith(
      `${VIEW_URL}/1/complete`,
      {},
      expect.anything(),
    )
  })

  test('a segment watched before the URL arrives is posted once the URL lands', async () => {
    const lesson = freshLesson(null)

    // URL not here yet: the 30s segment is recorded but cannot post
    await onProgress({playedSeconds: 30}, lesson)
    expect(mockedAxios.post).not.toHaveBeenCalled()

    const tracked = {...lesson, lesson_view_url: VIEW_URL}
    await flushPendingLessonView(tracked as any)
    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
    expect(mockedAxios.post.mock.calls[0][0]).toBe(VIEW_URL)
    expect(mockedAxios.put).toHaveBeenCalledWith(
      `${VIEW_URL}/1/increment`,
      {},
      expect.anything(),
    )

    // flushing again does not post a second time
    await flushPendingLessonView(tracked as any)
    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
  })

  test('flush posts nothing when no segment was watched yet', async () => {
    const lesson = freshLesson(VIEW_URL)
    await flushPendingLessonView(lesson as any)
    expect(mockedAxios.post).not.toHaveBeenCalled()
  })

  test('flush posts nothing once the player already posted with the URL', async () => {
    const lesson = freshLesson(VIEW_URL)
    await onProgress({playedSeconds: 30}, lesson)
    await flushPendingLessonView(lesson as any)
    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
  })

  test('flush posts nothing without a URL (anonymous)', async () => {
    const lesson = freshLesson(null)
    await onProgress({playedSeconds: 30}, lesson)
    await flushPendingLessonView(lesson as any)
    expect(mockedAxios.post).not.toHaveBeenCalled()
  })

  test('a lesson that ended before the URL arrived is completed once it lands', async () => {
    const lesson = freshLesson(null)
    await onEnded(lesson)
    expect(mockedAxios.post).not.toHaveBeenCalled()

    const tracked = {...lesson, lesson_view_url: VIEW_URL}
    await flushPendingLessonView(tracked as any)
    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
    expect(mockedAxios.put).toHaveBeenCalledWith(
      `${VIEW_URL}/1/complete`,
      {},
      expect.anything(),
    )

    await flushPendingLessonView(tracked as any)
    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
  })
})
