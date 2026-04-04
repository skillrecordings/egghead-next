import {NextResponse} from 'next/server'
import {ACCESS_TOKEN_KEY, EGGHEAD_USER_COOKIE_KEY} from '../config'

const authCookieOptions = {
  domain: process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN,
  path: '/',
  secure: process.env.NODE_ENV === 'production',
}

function expireCookie(
  res: NextResponse,
  name: string,
  sameSite: 'lax' | 'strict',
) {
  res.cookies.set(name, '', {
    ...authCookieOptions,
    sameSite,
    expires: new Date(0),
    maxAge: 0,
  })
}

export function setUserCookie(res: NextResponse, user: any) {
  if (user) {
    res.cookies.set(EGGHEAD_USER_COOKIE_KEY, JSON.stringify(user), {
      maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days in milliseconds
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      domain: process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN,
    })
  } else {
    clearUserCookie(res)
  }
}

export function clearUserCookie(res: NextResponse) {
  expireCookie(res, EGGHEAD_USER_COOKIE_KEY, 'strict')
}

export function clearAccessTokenCookie(res: NextResponse) {
  expireCookie(res, ACCESS_TOKEN_KEY, 'lax')
}
