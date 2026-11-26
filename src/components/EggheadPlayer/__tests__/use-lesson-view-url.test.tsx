/**
 * @jest-environment jsdom
 */
import {act, renderHook, waitFor} from '@testing-library/react'
import {useLessonViewUrl} from '../use-lesson-view-url'
import {flushPendingLessonView} from '../use-egghead-player'

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
jest.mock('../use-egghead-player', () => ({
  flushPendingLessonView: jest.fn(async () => undefined),
}))

const mockedFlush = flushPendingLessonView as jest.Mock

const urlFor = (slug: string) =>
  `https://rails.example/api/v1/lessons/${slug}/views`
const lessonA = {id: 1, slug: 'lesson-a', lesson_view_url: null}
const lessonB = {id: 2, slug: 'lesson-b', lesson_view_url: null}
const viewer = {id: 99}

type Deferred = {resolve: (v: any) => void}
let pending: Record<string, Deferred> = {}

beforeEach(() => {
  pending = {}
  mockMutateAsync.mockReset()
  mockUseMutation.mockClear()
  mockedFlush.mockClear()
  mockMutateAsync.mockImplementation(
    ({slug}: {slug: string}) =>
      new Promise((resolve) => {
        pending[slug] = {resolve}
      }),
  )
})

const issue = async (slug: string) => {
  await act(async () => {
    pending[slug].resolve({slug, lesson_view_url: urlFor(slug)})
  })
}

test('anonymous viewer: no fetch, no URL', () => {
  const {result} = renderHook(() => useLessonViewUrl(lessonA, null))
  expect(mockMutateAsync).not.toHaveBeenCalled()
  expect(result.current.lesson_view_url).toBeNull()
})

test('signed-in viewer: fetches once and merges the URL', async () => {
  const {result} = renderHook(() => useLessonViewUrl(lessonA, viewer))
  expect(mockMutateAsync).toHaveBeenCalledTimes(1)
  expect(mockMutateAsync).toHaveBeenCalledWith({slug: 'lesson-a'})

  await issue('lesson-a')
  await waitFor(() =>
    expect(result.current.lesson_view_url).toBe(urlFor('lesson-a')),
  )
  expect(mockedFlush).toHaveBeenCalledTimes(1)
  expect(mockedFlush.mock.calls[0][0].lesson_view_url).toBe(urlFor('lesson-a'))
})

test('a refetched lesson object for the same slug does not fetch again', async () => {
  const {result, rerender} = renderHook(
    ({lesson}) => useLessonViewUrl(lesson, viewer),
    {initialProps: {lesson: lessonA}},
  )
  await issue('lesson-a')
  rerender({lesson: {...lessonA}})
  rerender({lesson: {...lessonA, title: 'refetched'} as any})
  expect(mockMutateAsync).toHaveBeenCalledTimes(1)
  expect(result.current.lesson_view_url).toBe(urlFor('lesson-a'))
  expect(mockedFlush).toHaveBeenCalledTimes(1)
})

test('client navigation never attaches the previous lesson URL to the next lesson', async () => {
  const {result, rerender} = renderHook(
    ({lesson}) => useLessonViewUrl(lesson, viewer),
    {initialProps: {lesson: lessonA}},
  )
  await issue('lesson-a')
  expect(result.current.lesson_view_url).toBe(urlFor('lesson-a'))

  rerender({lesson: lessonB})
  // lesson-b's URL has not arrived yet: no URL, and certainly not lesson-a's
  expect(result.current.slug).toBe('lesson-b')
  expect(result.current.lesson_view_url).toBeNull()

  await issue('lesson-b')
  await waitFor(() =>
    expect(result.current.lesson_view_url).toBe(urlFor('lesson-b')),
  )
})

test('a late answer for the previous lesson is ignored', async () => {
  const {result, rerender} = renderHook(
    ({lesson}) => useLessonViewUrl(lesson, viewer),
    {initialProps: {lesson: lessonA}},
  )
  rerender({lesson: lessonB})
  await issue('lesson-a') // arrives after navigating away
  expect(result.current.lesson_view_url).toBeNull()
  expect(mockedFlush).not.toHaveBeenCalled()
})

test('signing out drops the URL', async () => {
  const {result, rerender} = renderHook(({v}) => useLessonViewUrl(lessonA, v), {
    initialProps: {v: viewer as any},
  })
  await issue('lesson-a')
  expect(result.current.lesson_view_url).toBe(urlFor('lesson-a'))
  rerender({v: null})
  expect(result.current.lesson_view_url).toBeNull()
})
