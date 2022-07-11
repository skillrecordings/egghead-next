import {NextResponse} from 'next/server'
import {EGGHEAD_USER_COOKIE_KEY} from '../config'

export function setUserCookie(res: NextResponse, user: any) {
  res.cookies.set(EGGHEAD_USER_COOKIE_KEY, JSON.stringify(user), {
    maxAge: 1000 * 60 * 60 * 24 * 2,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })
}

export function clearUserCookie(res: NextResponse) {
  res.cookies.delete(EGGHEAD_USER_COOKIE_KEY)
}
