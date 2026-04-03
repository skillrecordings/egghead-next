import {ACCESS_TOKEN_KEY, EGGHEAD_USER_COOKIE_KEY} from '@/config'

describe('setCookiesForResponse', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN = '.egghead.io'
  })

  it('expires both the user cookie and access token when auth lookup failed', async () => {
    const {setCookiesForResponse} = await import('../process-customer-cookies')

    const res: any = {
      cookies: {
        set: jest.fn(),
      },
    }

    const req: any = {
      cookies: {
        has: (name: string) =>
          name === ACCESS_TOKEN_KEY || name === EGGHEAD_USER_COOKIE_KEY,
      },
    }

    setCookiesForResponse(res, req, null, null, true)

    expect(res.cookies.set).toHaveBeenCalledWith(
      EGGHEAD_USER_COOKIE_KEY,
      '',
      expect.objectContaining({
        domain: '.egghead.io',
        path: '/',
        sameSite: 'strict',
        maxAge: 0,
      }),
    )
    expect(res.cookies.set).toHaveBeenCalledWith(
      ACCESS_TOKEN_KEY,
      '',
      expect.objectContaining({
        domain: '.egghead.io',
        path: '/',
        sameSite: 'lax',
        maxAge: 0,
      }),
    )
  })
})
