import {getGraphQLClient} from '../configured-graphql-client'

jest.mock('graphql-request', () => {
  const mockSetHeader = jest.fn()
  const mockGraphQLClient = jest.fn().mockImplementation(() => ({
    setHeader: mockSetHeader,
  }))

  return {
    GraphQLClient: mockGraphQLClient,
    __mockGraphQLClient: mockGraphQLClient,
    __mockSetHeader: mockSetHeader,
  }
})

jest.mock('../get-access-token-from-cookie', () => {
  const mockGetAccessTokenFromCookie = jest.fn()

  return {
    __esModule: true,
    default: mockGetAccessTokenFromCookie,
    __mockGetAccessTokenFromCookie: mockGetAccessTokenFromCookie,
  }
})

const {__mockSetHeader: mockSetHeader} = jest.requireMock(
  'graphql-request',
) as {
  __mockSetHeader: jest.Mock
}

const {__mockGetAccessTokenFromCookie: mockGetAccessTokenFromCookie} =
  jest.requireMock('../get-access-token-from-cookie') as {
    __mockGetAccessTokenFromCookie: jest.Mock
  }

describe('getGraphQLClient', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('attaches an explicit bearer token', () => {
    getGraphQLClient('fresh-token')

    expect(mockSetHeader).toHaveBeenCalledWith(
      'Authorization',
      'Bearer fresh-token',
    )
    expect(mockGetAccessTokenFromCookie).not.toHaveBeenCalled()
  })

  test('does not attach stored-token auth when fallback is disabled', () => {
    mockGetAccessTokenFromCookie.mockImplementation(
      (options?: {allowLocalStorageFallback?: boolean}) =>
        options?.allowLocalStorageFallback === false ? false : 'stale-token',
    )

    getGraphQLClient(undefined, {allowStoredTokenFallback: false})

    expect(mockGetAccessTokenFromCookie).toHaveBeenCalledWith({
      allowLocalStorageFallback: false,
    })
    expect(mockSetHeader).not.toHaveBeenCalled()
  })
})
