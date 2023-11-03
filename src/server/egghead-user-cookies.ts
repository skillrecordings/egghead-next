import {NextResponse} from 'next/server'
import {EGGHEAD_USER_COOKIE_KEY} from '../config'

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
  res.cookies.delete(EGGHEAD_USER_COOKIE_KEY)
}
