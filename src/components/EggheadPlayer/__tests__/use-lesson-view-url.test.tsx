/**
 * @jest-environment jsdom
 */
import {act, renderHook, waitFor} from '@testing-library/react'
import {
  tokenOwnerKey,
  useLessonViewTracking,
  useLessonViewUrl,
} from '../use-lesson-view-url'
import {
  beginLessonViewSession,
  flushPendingLessonView,
} from '../use-egghead-player'

const mockMutateAsync = jest.fn()
const mockUseMutation = jest.fn(() => ({mutateAsync: mockMutateAsync}))

jest.mock('@/app/_trpc/client', () => ({
  trpc: {
    lesson: {
      getLessonViewUrl: {
        useMutation: (...args: any[]) => (mockUseMutation as any)(...args),
      },
    },
  },
}))
// useLessonViewTracking decides "signed in" from the access-token cookie
let mockToken: string | false = false
jest.mock('@/utils/get-access-token-from-cookie', () => ({
  __esModule: true,
  default: () => mockToken,
}))
jest.mock('../use-egghead-player', () => ({
  beginLessonViewSession: jest.fn(),
  flushPendingLessonView: jest.fn(async () => undefined),
}))

const mockedFlush = flushPendingLessonView as jest.Mock
const mockedBegin = beginLessonViewSession as jest.Mock

const urlFor = (slug: string) =>
  `https://rails.example/api/v1/lessons/${slug}/views`
const lessonA = {id: 1, slug: 'lesson-a', lesson_view_url: null}
const lessonB = {id: 2, slug: 'lesson-b', lesson_view_url: null}
const viewer = {id: 99}
const ownerOf = (v: any) => () => v ? `viewer:${v.id}` : 'anonymous'
const otherViewer = {id: 100}

let pending: Record<string, ((v: any) => void)[]> = {}

beforeEach(() => {
  pending = {}
  mockToken = false
  mockMutateAsync.mockReset()
  mockUseMutation.mockClear()
  mockedFlush.mockClear()
  mockedBegin.mockClear()
  mockMutateAsync.mockImplementation(
    ({slug}: {slug: string}) =>
      new Promise((resolve) => {
        ;(pending[slug] ||= []).push(resolve)
      }),
  )
})

const issue = async (slug: string, index = 0) => {
  await act(async () => {
    pending[slug][index]({slug, lesson_view_url: urlFor(slug)})
  })
}

const play = (result: {current: {requestViewUrl: () => void}}) =>
  act(() => {
    result.current.requestViewUrl()
  })

test('mount alone makes no Rails call; the first playback event does', async () => {
  const {result} = renderHook(() => useLessonViewUrl(lessonA, ownerOf(viewer)))
  expect(mockMutateAsync).not.toHaveBeenCalled()
  expect(mockedBegin).toHaveBeenCalledWith('lesson-a', 'viewer:99')

  play(result)
  play(result) // timeupdate fires many times a second
  expect(mockMutateAsync).toHaveBeenCalledTimes(1)
  expect(mockMutateAsync).toHaveBeenCalledWith({slug: 'lesson-a'})

  await issue('lesson-a')
  await waitFor(() =>
    expect(result.current.lesson.lesson_view_url).toBe(urlFor('lesson-a')),
  )
  expect(mockedFlush).toHaveBeenCalledTimes(1)
  expect(mockedFlush.mock.calls[0][0].lesson_view_url).toBe(urlFor('lesson-a'))
  expect(mockedFlush.mock.calls[0][1]).toBe('viewer:99')
})

test('anonymous viewer: playback never calls Rails', () => {
  const {result} = renderHook(() => useLessonViewUrl(lessonA, ownerOf(null)))
  play(result)
  expect(mockMutateAsync).not.toHaveBeenCalled()
  expect(result.current.lesson.lesson_view_url).toBeNull()
  expect(mockedBegin).toHaveBeenCalledWith('lesson-a', 'anonymous')
})

test('a refetched lesson object for the same slug does not fetch again', async () => {
  const {result, rerender} = renderHook(
    ({lesson}) => useLessonViewUrl(lesson, ownerOf(viewer)),
    {initialProps: {lesson: lessonA as any}},
  )
  play(result)
  await issue('lesson-a')
  rerender({lesson: {...lessonA, title: 'refetched'}})
  play(result)
  expect(mockMutateAsync).toHaveBeenCalledTimes(1)
  expect(result.current.lesson.lesson_view_url).toBe(urlFor('lesson-a'))
  expect(mockedFlush).toHaveBeenCalledTimes(1)
})

test('client navigation never attaches the previous lesson URL to the next lesson', async () => {
  const {result, rerender} = renderHook(
    ({lesson}) => useLessonViewUrl(lesson, ownerOf(viewer)),
    {initialProps: {lesson: lessonA}},
  )
  play(result)
  await issue('lesson-a')

  rerender({lesson: lessonB})
  expect(result.current.lesson.slug).toBe('lesson-b')
  expect(result.current.lesson.lesson_view_url).toBeNull()
  expect(mockedBegin).toHaveBeenLastCalledWith('lesson-b', 'viewer:99')

  play(result)
  expect(mockMutateAsync).toHaveBeenLastCalledWith({slug: 'lesson-b'})
  await issue('lesson-b')
  await waitFor(() =>
    expect(result.current.lesson.lesson_view_url).toBe(urlFor('lesson-b')),
  )
})

test('a late answer for the previous lesson is ignored', async () => {
  const {result, rerender} = renderHook(
    ({lesson}) => useLessonViewUrl(lesson, ownerOf(viewer)),
    {initialProps: {lesson: lessonA}},
  )
  play(result)
  rerender({lesson: lessonB})
  await issue('lesson-a')
  expect(result.current.lesson.lesson_view_url).toBeNull()
  expect(mockedFlush).not.toHaveBeenCalled()
})

test('signing out drops the URL and opens an anonymous session', async () => {
  const {result, rerender} = renderHook(
    ({v}) => useLessonViewUrl(lessonA, ownerOf(v)),
    {
      initialProps: {v: viewer as any},
    },
  )
  play(result)
  await issue('lesson-a')
  rerender({v: null})
  expect(result.current.lesson.lesson_view_url).toBeNull()
  expect(mockedBegin).toHaveBeenLastCalledWith('lesson-a', 'anonymous')
})

test('switching viewers never reuses the first viewer URL', async () => {
  const {result, rerender} = renderHook(
    ({v}) => useLessonViewUrl(lessonA, ownerOf(v)),
    {
      initialProps: {v: viewer as any},
    },
  )
  play(result)
  await issue('lesson-a')
  rerender({v: otherViewer})
  expect(result.current.lesson.lesson_view_url).toBeNull()
  expect(mockedBegin).toHaveBeenLastCalledWith('lesson-a', 'viewer:100')

  play(result)
  expect(mockMutateAsync).toHaveBeenCalledTimes(2)
})

test('a failed fetch is not retried on every playback event', async () => {
  mockMutateAsync.mockRejectedValueOnce(new Error('network'))
  const {result} = renderHook(() => useLessonViewUrl(lessonA, ownerOf(viewer)))
  play(result)
  await act(async () => undefined)
  play(result)
  play(result)
  expect(mockMutateAsync).toHaveBeenCalledTimes(1)
})

describe('useLessonViewTracking (shared by the lesson and talks players)', () => {
  test('paused timeupdate events are not playback: no lesson, no Rails call', () => {
    mockToken = 'tok-99'
    const {result} = renderHook(() => useLessonViewTracking(lessonA))
    expect(result.current.lessonForPlayback({paused: true})).toBeNull()
    expect(mockMutateAsync).not.toHaveBeenCalled()
  })

  test('real playback requests the URL once and reports against the tracked lesson', async () => {
    mockToken = 'tok-99'
    const {result} = renderHook(() => useLessonViewTracking(lessonA))

    let reported: any
    act(() => {
      reported = result.current.lessonForPlayback({paused: false})
      result.current.lessonForPlayback({paused: false})
    })
    expect(reported.slug).toBe('lesson-a')
    expect(mockMutateAsync).toHaveBeenCalledTimes(1)

    await issue('lesson-a')
    await waitFor(() =>
      expect(
        result.current.lessonForPlayback({paused: false})?.lesson_view_url,
      ).toBe(urlFor('lesson-a')),
    )
    expect(result.current.lessonForCompletion().lesson_view_url).toBe(
      urlFor('lesson-a'),
    )
  })

  test('callbacks are stable for once-bound listeners and still read the latest lesson', async () => {
    mockToken = 'tok-99'
    const {result, rerender} = renderHook(
      ({lesson}) => useLessonViewTracking(lesson),
      {initialProps: {lesson: lessonA as any}},
    )
    const first = result.current
    act(() => {
      first.lessonForPlayback({paused: false})
    })
    await issue('lesson-a')
    rerender({lesson: {...lessonA, title: 'refetched'}})

    expect(result.current.lessonForPlayback).toBe(first.lessonForPlayback)
    expect(result.current.lessonForCompletion).toBe(first.lessonForCompletion)
    // the callback captured at bind time sees the URL that arrived later
    expect(first.lessonForCompletion().lesson_view_url).toBe(urlFor('lesson-a'))
  })

  test('anonymous viewer: playback reports the bare lesson and never calls Rails', () => {
    const {result} = renderHook(() => useLessonViewTracking(lessonA))
    expect(
      result.current.lessonForPlayback({paused: false})?.lesson_view_url,
    ).toBeNull()
    expect(mockMutateAsync).not.toHaveBeenCalled()
  })
})

describe('lesson not loaded yet', () => {
  test('undefined lesson: no fetch, no throw, and tracking starts once it arrives', async () => {
    mockToken = 'tok-99'
    const {result, rerender} = renderHook(
      ({lesson}) => useLessonViewTracking(lesson as any),
      {initialProps: {lesson: undefined as any}},
    )
    let reported: any = 'unset'
    act(() => {
      reported = result.current.lessonForPlayback({paused: false})
    })
    expect(reported).toBeUndefined()
    expect(result.current.lessonForCompletion()).toBeUndefined()
    expect(mockMutateAsync).not.toHaveBeenCalled()
    expect(mockedBegin).not.toHaveBeenCalled()

    rerender({lesson: lessonA})
    expect(mockedBegin).toHaveBeenCalledWith(
      'lesson-a',
      tokenOwnerKey('tok-99'),
    )
    act(() => {
      result.current.lessonForPlayback({paused: false})
    })
    expect(mockMutateAsync).toHaveBeenCalledWith({slug: 'lesson-a'})
    await issue('lesson-a')
    await waitFor(() =>
      expect(result.current.lessonForCompletion().lesson_view_url).toBe(
        urlFor('lesson-a'),
      ),
    )
  })
})

describe('signed-in check follows the token cookie', () => {
  test('signing in mid-page: the next playback opens a fresh session, then requests', async () => {
    mockToken = false
    const {result} = renderHook(() => useLessonViewTracking(lessonA))
    act(() => {
      result.current.lessonForPlayback({paused: false})
    })
    expect(mockMutateAsync).not.toHaveBeenCalled()

    mockToken = 'tok-99' // cookie set by a sign-in in this tab, no re-render
    act(() => {
      result.current.lessonForPlayback({paused: false}) // triggers re-render
    })
    expect(mockedBegin).toHaveBeenLastCalledWith(
      'lesson-a',
      tokenOwnerKey('tok-99'),
    )
    act(() => {
      result.current.lessonForPlayback({paused: false})
    })
    expect(mockMutateAsync).toHaveBeenCalledTimes(1)
  })

  test('a different account gets a different owner', () => {
    expect(tokenOwnerKey('tok-a')).not.toBe(tokenOwnerKey('tok-b'))
    expect(tokenOwnerKey('tok-a')).toBe(tokenOwnerKey('tok-a'))
    expect(tokenOwnerKey(false)).toBe('anonymous')
    expect(tokenOwnerKey('tok-a')).not.toContain('tok-a')
  })
})
