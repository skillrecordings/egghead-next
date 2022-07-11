import {NextResponse} from 'next/server'
import {EGGHEAD_USER_COOKIE_KEY} from '../config'

export function setUserCookie(res: NextResponse, user: any) {
  if (user) {
    const {contact_id, email, first_name, last_name, is_pro, is_instructor} =
      user
    res.cookies.set(
      EGGHEAD_USER_COOKIE_KEY,
      JSON.stringify({
        contact_id,
        email,
        first_name,
        last_name,
        is_pro,
        is_instructor,
      }),
      {
        maxAge: 1000 * 60 * 60 * 24 * 2,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        domain: process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN,
      },
    )
  } else {
    clearUserCookie(res)
  }
}

export function clearUserCookie(res: NextResponse) {
  res.cookies.delete(EGGHEAD_USER_COOKIE_KEY, {
    domain: process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN,
  })
}
