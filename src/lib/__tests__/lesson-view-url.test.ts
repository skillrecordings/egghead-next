import {loadLesson, loadLessonViewUrl, toSharedLessonPayload} from '../lessons'
import * as structuredLog from '@/utils/structured-log'

const mockRequest = jest.fn()
const mockGetGraphQLClient = jest.fn((..._args: any[]) => ({
  request: mockRequest,
}))

jest.mock('@/utils/configured-graphql-client', () => ({
  getGraphQLClient: (...args: any[]) => mockGetGraphQLClient(...args),
}))
jest.mock('@/lib/get-course-builder-metadata', () => ({
  getCourseBuilderLesson: jest.fn(async () => null),
  getCourseBuilderLessonCourse: jest.fn(async () => null),
}))
jest.mock('@/lib/lesson-comments', () => ({
  loadLessonComments: jest.fn(async () => []),
}))
jest.mock('@/lib/upstash-redis', () => ({getRedis: () => null}))

const VIEW_URL = 'https://rails.example/api/v1/lessons/some-lesson/views'
const TEST_TOKEN = 'test-token-not-real'

let logSpy: jest.SpyInstance

beforeEach(() => {
  mockRequest.mockReset()
  mockGetGraphQLClient.mockClear()
  logSpy = jest.spyOn(structuredLog, 'logEvent')
})

afterEach(() => {
  logSpy.mockRestore()
})

const viewUrlLogs = () =>
  logSpy.mock.calls.filter(
    ([, event]) => event === 'lesson.loadLessonViewUrl.result',
  )

describe('loadLessonViewUrl outcomes', () => {
  test.each([
    [
      'granted',
      'info',
      () =>
        mockRequest.mockResolvedValue({lesson: {lesson_view_url: VIEW_URL}}),
    ],
    [
      'withheld',
      'info',
      () => mockRequest.mockResolvedValue({lesson: {lesson_view_url: null}}),
    ],
    [
      'forbidden',
      'info',
      () => mockRequest.mockRejectedValue(new Error('Forbidden. Code: 403')),
    ],
    [
      'error',
      'warn',
      () => mockRequest.mockRejectedValue(new Error('socket hang up')),
    ],
  ])(
    '%s is logged at %s level with an outcome field',
    async (outcome, level, arrange) => {
      arrange()
      await loadLessonViewUrl('some-lesson', TEST_TOKEN)
      const logs = viewUrlLogs()
      expect(logs).toHaveLength(1)
      expect(logs[0][0]).toBe(level)
      expect(logs[0][2]).toMatchObject({slug: 'some-lesson', outcome})
    },
  )

  test('anonymous is logged as an expected outcome', async () => {
    await loadLessonViewUrl('some-lesson')
    expect(viewUrlLogs()[0][0]).toBe('info')
    expect(viewUrlLogs()[0][2]).toMatchObject({outcome: 'anonymous'})
  })

  test('only real failures are warn-level', async () => {
    mockRequest.mockRejectedValue(new Error('Forbidden. Code: 403'))
    await loadLessonViewUrl('some-lesson', TEST_TOKEN)
    expect(logSpy.mock.calls.some(([level]) => level === 'warn')).toBe(false)
  })
})

describe('loadLessonViewUrl', () => {
  test('anonymous: returns null without calling Rails', async () => {
    await expect(loadLessonViewUrl('some-lesson')).resolves.toBeNull()
    expect(mockGetGraphQLClient).not.toHaveBeenCalled()
    expect(mockRequest).not.toHaveBeenCalled()
  })

  test('signed in: asks Rails as the viewer and returns the URL', async () => {
    mockRequest.mockResolvedValue({lesson: {lesson_view_url: VIEW_URL}})

    await expect(loadLessonViewUrl('some-lesson', TEST_TOKEN)).resolves.toBe(
      VIEW_URL,
    )
    expect(mockGetGraphQLClient).toHaveBeenCalledWith(TEST_TOKEN, {
      allowStoredTokenFallback: false,
    })
    expect(mockRequest.mock.calls[0][0]).toContain('lesson_view_url')
    expect(mockRequest.mock.calls[0][1]).toEqual({slug: 'some-lesson'})
  })

  test('Rails withholds the URL (ability check): returns null', async () => {
    mockRequest.mockResolvedValue({lesson: {lesson_view_url: null}})
    await expect(
      loadLessonViewUrl('some-lesson', TEST_TOKEN),
    ).resolves.toBeNull()
  })

  test('Rails error: returns null instead of throwing', async () => {
    mockRequest.mockRejectedValue(new Error('Code: 500'))
    await expect(
      loadLessonViewUrl('some-lesson', TEST_TOKEN),
    ).resolves.toBeNull()
  })
})

describe('shared lesson payload', () => {
  test('toSharedLessonPayload strips lesson_view_url', () => {
    const shared = toSharedLessonPayload({
      slug: 'some-lesson',
      title: 'Some Lesson',
      lesson_view_url: VIEW_URL,
    })
    expect(shared.lesson_view_url).toBeNull()
    expect(shared.title).toBe('Some Lesson')
  })

  test('the static/shared loadLesson path never sends a viewer token', async () => {
    mockRequest.mockResolvedValue({
      lesson: {
        slug: 'some-lesson',
        title: 'Some Lesson',
        path: '/lessons/some-lesson',
        lesson_view_url: null,
      },
    })

    // getStaticProps and getLessonbySlug both call loadLesson with
    // useAuth = false; the token must be dropped.
    await loadLesson(
      'some-lesson',
      TEST_TOKEN,
      false,
      {},
      {
        includeComments: false,
        allowRuntimeCaches: false,
      },
    )

    expect(mockGetGraphQLClient).toHaveBeenCalled()
    for (const call of mockGetGraphQLClient.mock.calls) {
      expect(call[0]).toBeUndefined()
    }
  })
})
