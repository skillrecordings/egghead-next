/* eslint-disable import/first */

const authMocks = {
  http: {
    get: jest.fn(),
    post: jest.fn(),
  },
  cookie: {
    set: jest.fn(),
    get: jest.fn(),
    remove: jest.fn(),
  },
  identify: jest.fn(),
  getAccessTokenFromCookie: jest.fn(),
}

;(global as any).__authTestMocks = authMocks

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => ({
      get: (...args: any[]) =>
        (global as any).__authTestMocks.http.get(...args),
      post: (...args: any[]) =>
        (global as any).__authTestMocks.http.post(...args),
    })),
  },
}))

jest.mock('client-oauth2', () => {
  return jest.fn().mockImplementation(() => ({
    token: {
      getUri: jest.fn(),
      getToken: jest.fn(),
    },
  }))
})

jest.mock('../cookies', () => ({
  __esModule: true,
  default: {
    set: (...args: any[]) =>
      (global as any).__authTestMocks.cookie.set(...args),
    get: (...args: any[]) =>
      (global as any).__authTestMocks.cookie.get(...args),
    remove: (...args: any[]) =>
      (global as any).__authTestMocks.cookie.remove(...args),
  },
}))

jest.mock('../get-access-token-from-cookie', () => ({
  __esModule: true,
  default: (...args: any[]) =>
    (global as any).__authTestMocks.getAccessTokenFromCookie(...args),
}))

jest.mock('@/utils/analytics', () => ({
  __esModule: true,
  default: {
    identify: (...args: any[]) =>
      (global as any).__authTestMocks.identify(...args),
  },
}))

import Auth, {
  ACCESS_TOKEN_KEY,
  EXPIRES_AT_KEY,
  USER_KEY,
  VIEWING_AS_USER_KEY,
} from '../auth'

describe('Auth.refreshUser', () => {
  beforeAll(() => {
    let storage: Record<string, string> = {}

    Object.defineProperty(global, 'window', {
      configurable: true,
      value: {},
    })

    Object.defineProperty(global, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => storage[key] ?? null,
        setItem: (key: string, value: string) => {
          storage[key] = value
        },
        removeItem: (key: string) => {
          delete storage[key]
        },
        clear: () => {
          storage = {}
        },
      },
    })
  })

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN = '.egghead.io'
    authMocks.getAccessTokenFromCookie.mockReturnValue('stale-token')
    localStorage.setItem(ACCESS_TOKEN_KEY, 'stale-token')
    localStorage.setItem(
      EXPIRES_AT_KEY,
      JSON.stringify(Date.now() + 60 * 60 * 1000),
    )
    localStorage.setItem(USER_KEY, JSON.stringify({id: 42, email: 'old@e.io'}))
    localStorage.setItem(VIEWING_AS_USER_KEY, 'old@e.io')
  })

  it('clears stale auth when /api/users/current resolves with null', async () => {
    authMocks.http.get.mockResolvedValue({data: null})

    const auth = new Auth()
    const result = await auth.refreshUser()

    expect(result).toBeNull()
    expect(authMocks.cookie.remove).toHaveBeenCalledWith(
      ACCESS_TOKEN_KEY,
      expect.objectContaining({
        domain: '.egghead.io',
        path: '/',
      }),
    )
    expect(authMocks.cookie.remove).toHaveBeenCalledWith(
      'eh_user',
      expect.objectContaining({
        domain: '.egghead.io',
        path: '/',
      }),
    )
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBeNull()
    expect(localStorage.getItem(USER_KEY)).toBeNull()
    expect(localStorage.getItem(VIEWING_AS_USER_KEY)).toBeNull()
    expect(authMocks.identify).not.toHaveBeenCalled()
  })

  it('clears stale auth when /api/users/current rejects with 403', async () => {
    authMocks.http.get.mockRejectedValue({
      response: {
        status: 403,
      },
    })

    const auth = new Auth()
    const result = await auth.refreshUser()

    expect(result).toBeNull()
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBeNull()
    expect(localStorage.getItem(USER_KEY)).toBeNull()
  })
})
