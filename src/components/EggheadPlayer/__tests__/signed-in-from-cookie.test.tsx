/**
 * @jest-environment jsdom
 *
 * Regression for production (dpl_EMDcyb): signed-in players never requested
 * a lesson view URL because the gate read `useViewer().viewer`, which was
 * empty for them. The gate now reads the access-token cookie, the same
 * credential the tRPC server and Rails use. Uses the real cookie reader.
 */
import {act, renderHook} from '@testing-library/react'
import {useLessonViewTracking, tokenOwnerKey} from '../use-lesson-view-url'
import {beginLessonViewSession} from '../use-egghead-player'
import {ACCESS_TOKEN_KEY} from '@/config'

const mockMutateAsync = jest.fn(async ({slug}: {slug: string}) => ({
  slug,
  lesson_view_url: `https://rails.example/api/v1/lessons/${slug}/views`,
}))

jest.mock('@/app/_trpc/client', () => ({
  trpc: {
    lesson: {
      getLessonViewUrl: {
        useMutation: () => ({mutateAsync: mockMutateAsync}),
      },
    },
  },
}))
jest.mock('../use-egghead-player', () => ({
  beginLessonViewSession: jest.fn(),
  flushPendingLessonView: jest.fn(async () => undefined),
}))
// what production had: no viewer object for a signed-in player
jest.mock('@/context/viewer-context', () => ({
  useViewer: () => ({viewer: null, loading: false}),
}))
jest.mock('@/utils/analytics', () => ({
  __esModule: true,
  default: {events: {}, identify: jest.fn()},
  track: jest.fn(),
}))

const TEST_TOKEN = 'test-token-not-real'
const lesson = {id: 1, slug: 'some-lesson', lesson_view_url: null}

const clearCookie = () => {
  document.cookie = `${ACCESS_TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}

beforeEach(() => {
  mockMutateAsync.mockClear()
  ;(beginLessonViewSession as jest.Mock).mockClear()
  clearCookie()
  localStorage.clear() // no eh_token_expiration, no local user
})

afterAll(clearCookie)

test('token cookie present, useViewer empty, no localStorage expiry: playback requests the URL', () => {
  document.cookie = `${ACCESS_TOKEN_KEY}=${TEST_TOKEN}; path=/`

  const {result} = renderHook(() => useLessonViewTracking(lesson))
  act(() => {
    result.current.lessonForPlayback({paused: false})
  })

  expect(mockMutateAsync).toHaveBeenCalledTimes(1)
  expect(mockMutateAsync).toHaveBeenCalledWith({slug: 'some-lesson'})
  expect(beginLessonViewSession).toHaveBeenCalledWith(
    'some-lesson',
    tokenOwnerKey(TEST_TOKEN),
  )
})

test('no token cookie: playback never asks Rails', () => {
  const {result} = renderHook(() => useLessonViewTracking(lesson))
  act(() => {
    result.current.lessonForPlayback({paused: false})
  })
  expect(mockMutateAsync).not.toHaveBeenCalled()
})
