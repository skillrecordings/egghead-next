/**
 * Real chain, Rails mocked at the HTTP client: loadLessonViewUrl ->
 * getGraphQLClient -> GraphQLClient#setHeader. Rails' ApiController reads
 * this bearer token (authenticate_user_from_bearer_token!) into current_user,
 * which gates Types::LessonType#lesson_view_url.
 */
const mockSetHeader = jest.fn()
const mockRequest = jest.fn(async () => ({
  lesson: {lesson_view_url: 'https://rails.example/api/v1/lessons/x/views'},
}))

jest.mock('graphql-request', () => ({
  GraphQLClient: jest.fn().mockImplementation(() => ({
    setHeader: mockSetHeader,
    request: mockRequest,
  })),
}))

// eslint-disable-next-line import/first
import {loadLessonViewUrl} from '../lessons'

const TEST_TOKEN = 'test-token-not-real'

beforeEach(() => {
  mockSetHeader.mockClear()
  mockRequest.mockClear()
})

test('sends the viewer token as a Bearer Authorization header', async () => {
  await loadLessonViewUrl('x', TEST_TOKEN)
  expect(mockSetHeader).toHaveBeenCalledWith(
    'Authorization',
    `Bearer ${TEST_TOKEN}`,
  )
  expect(mockRequest).toHaveBeenCalledTimes(1)
})

test('no token: no client, no header, no Rails call', async () => {
  await loadLessonViewUrl('x')
  expect(mockSetHeader).not.toHaveBeenCalled()
  expect(mockRequest).not.toHaveBeenCalled()
})
