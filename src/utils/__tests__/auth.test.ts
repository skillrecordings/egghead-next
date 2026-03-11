import Auth, {ACCESS_TOKEN_KEY, EXPIRES_AT_KEY, USER_KEY} from '../auth'
import analytics from '@/utils/analytics'
import {CIO_IDENTIFIER_KEY, EGGHEAD_USER_COOKIE_KEY} from '@/config'

jest.mock('axios', () => {
  const mockHttp = {
    get: jest.fn(),
    post: jest.fn(),
  }
  const create = jest.fn(() => mockHttp)

  return {
    __esModule: true,
    default: {create},
    create,
    __mockHttp: mockHttp,
  }
})

jest.mock('client-oauth2', () =>
  jest.fn().mockImplementation(() => ({
    token: {
      getUri: jest.fn(),
      getToken: jest.fn(),
    },
  })),
)

jest.mock('@/utils/analytics', () => ({
  __esModule: true,
  default: {identify: jest.fn()},
  __mockAnalytics: {identify: jest.fn()},
}))

jest.mock('../cookies', () => {
  const mockCookieStore = new Map<string, string>()
  const mockCookieUtil = {
    set: jest.fn((name: string, value: unknown) => {
      const storedValue =
        typeof value === 'string' ? value : JSON.stringify(value)
      mockCookieStore.set(name, storedValue)
      return storedValue
    }),
    get: jest.fn((name: string) => mockCookieStore.get(name)),
    remove: jest.fn((name: string) => {
      mockCookieStore.delete(name)
    }),
  }

  return {
    __esModule: true,
    default: mockCookieUtil,
    __mockCookieStore: mockCookieStore,
    __mockCookieUtil: mockCookieUtil,
  }
})

const mockLocalStorage = (() => {
  let store: Record<string, string> = {}

  return {
    clear: () => {
      store = {}
    },
    getItem: (key: string) => store[key] ?? null,
    key: (index: number) => Object.keys(store)[index] ?? null,
    removeItem: (key: string) => {
      delete store[key]
    },
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    get length() {
      return Object.keys(store).length
    },
  }
})()

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
})

Object.defineProperty(global, 'window', {
  value: {
    localStorage: mockLocalStorage,
  },
  writable: true,
})

const {__mockHttp: mockHttp} = jest.requireMock('axios') as {
  __mockHttp: {
    get: jest.Mock
    post: jest.Mock
  }
}

const {__mockCookieStore: mockCookieStore} = jest.requireMock('../cookies') as {
  __mockCookieStore: Map<string, string>
}

const mockAnalytics = analytics as {
  identify: jest.Mock
}

const seedSession = (token = 'valid-token') => {
  mockCookieStore.set(ACCESS_TOKEN_KEY, token)
  mockCookieStore.set(EGGHEAD_USER_COOKIE_KEY, JSON.stringify({id: 999}))
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify({id: 999}))
  localStorage.setItem(EXPIRES_AT_KEY, JSON.stringify(Date.now() + 60_000))
}

describe('Auth.refreshUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCookieStore.clear()
    localStorage.clear()
    process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN = 'egghead.io'
  })

  test('clears the local session on a 200 null current-user response', async () => {
    seedSession()
    mockHttp.get.mockResolvedValue({data: null})

    const auth = new Auth()

    await expect(auth.refreshUser()).resolves.toBeNull()

    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBeNull()
    expect(localStorage.getItem(USER_KEY)).toBeNull()
    expect(mockCookieStore.has(ACCESS_TOKEN_KEY)).toBe(false)
    expect(mockCookieStore.has(EGGHEAD_USER_COOKIE_KEY)).toBe(false)
    expect(mockAnalytics.identify).not.toHaveBeenCalled()
  })

  test('clears the local session when Rails rejects the token with 401', async () => {
    seedSession()
    mockHttp.get.mockRejectedValue({response: {status: 401}})

    const auth = new Auth()

    await expect(auth.refreshUser()).resolves.toBeNull()

    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBeNull()
    expect(mockCookieStore.has(ACCESS_TOKEN_KEY)).toBe(false)
    expect(mockCookieStore.has(EGGHEAD_USER_COOKIE_KEY)).toBe(false)
  })

  test('persists a validated user payload', async () => {
    seedSession()
    const user = {
      id: 42,
      email: 'learner@example.com',
      contact_id: 'cio_123',
      name: 'Learner',
    }
    mockHttp.get.mockResolvedValue({data: user})

    const auth = new Auth()
    const result = await auth.refreshUser()

    expect(result).toEqual(user)
    expect(localStorage.getItem(USER_KEY)).toBe(JSON.stringify(user))
    expect(mockCookieStore.get(EGGHEAD_USER_COOKIE_KEY)).toBe(
      JSON.stringify(user),
    )
    expect(mockCookieStore.get(CIO_IDENTIFIER_KEY)).toBe('cio_123')
    expect(mockAnalytics.identify).toHaveBeenCalledWith(user)
  })

  test('does not throw on an empty current-user payload', async () => {
    seedSession()
    mockHttp.get.mockResolvedValue({data: {}})

    const auth = new Auth()

    await expect(auth.refreshUser()).resolves.toBeNull()
    expect(localStorage.getItem(USER_KEY)).toBeNull()
  })

  test('uses the cookie as the auth source of truth when expiration metadata is missing', () => {
    mockCookieStore.set(ACCESS_TOKEN_KEY, 'cookie-token')

    const auth = new Auth()

    expect(auth.getAuthToken()).toBe('cookie-token')
  })
})
