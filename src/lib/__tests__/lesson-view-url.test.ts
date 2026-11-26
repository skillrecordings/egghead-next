import {
  isGraphQL403,
  loadLesson,
  loadLessonViewUrl,
  toSharedLessonPayload,
} from '../lessons'
import * as structuredLog from '@/utils/structured-log'
import {ClientError} from 'graphql-request'

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

// graphql-request's real error type, shaped as it is thrown for a non-2xx
// Rails response (status on `response.status`).
const railsError = (status: number, message?: string) =>
  new ClientError(
    {
      status,
      ...(message ? {errors: [{message}]} : {}),
    } as any,
    {query: 'query getLessonViewUrl', variables: {slug: 'some-lesson'}},
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
      () => mockRequest.mockRejectedValue(railsError(403, 'Not authorized')),
    ],
    [
      'forbidden',
      'info',
      // no GraphQL errors body: graphql-request falls back to "Code: 403"
      () => mockRequest.mockRejectedValue(railsError(403)),
    ],
    [
      'unauthenticated',
      'info',
      () => mockRequest.mockRejectedValue(railsError(401, 'Token expired')),
    ],
    [
      'error',
      'warn',
      () => mockRequest.mockRejectedValue(railsError(500, 'boom')),
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

  test('error logs carry the status, never the raw request', async () => {
    mockRequest.mockRejectedValue(railsError(500, 'boom'))
    await loadLessonViewUrl('some-lesson', TEST_TOKEN)
    const data = viewUrlLogs()[0][2]
    expect(data).toMatchObject({status: 500})
    expect(JSON.stringify(data)).not.toContain('getLessonViewUrl')
  })

  test('only real failures are warn-level', async () => {
    mockRequest.mockRejectedValue(railsError(403, 'Not authorized'))
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

describe('isGraphQL403 (shared with the lesson router)', () => {
  test('reads the status from a real ClientError', () => {
    expect(isGraphQL403(railsError(403, 'Not authorized'))).toBe(true)
    expect(isGraphQL403(railsError(401, 'Token expired'))).toBe(false)
    expect(isGraphQL403(railsError(404, 'Not found'))).toBe(false)
  })

  test('falls back to the "Code: 403" message form', () => {
    expect(isGraphQL403(new Error('GraphQL Error (Code: 403)'))).toBe(true)
    expect(isGraphQL403(new Error('socket hang up'))).toBe(false)
    expect(isGraphQL403(undefined)).toBe(false)
  })
})
