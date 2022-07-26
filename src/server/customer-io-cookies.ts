import {NextResponse} from 'next/server'
import {
  CIO_IDENTIFIER_KEY as CIO_COOKIE_KEY,
  CIO_CUSTOMER_OBJECT_KEY,
} from '../config'

export function clearCustomerCookie(res: NextResponse) {
  res.cookies.delete(CIO_COOKIE_KEY, {
    domain: process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN,
  })
  res.cookies.delete(CIO_CUSTOMER_OBJECT_KEY, {
    domain: process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN,
  })
}

export function setCustomerCookie(res: NextResponse, customer: any) {
  if (customer?.id) {
    res.cookies.set(CIO_COOKIE_KEY, customer.id, {
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year in milliseconds
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      domain: process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN,
    })
  }

  if (customer) {
    const {id, attributes} = customer
    res.cookies.set(CIO_CUSTOMER_OBJECT_KEY, JSON.stringify({id, attributes}), {
      maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days in milliseconds
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      domain: process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN,
    })
  }
}

export function cioCustomerIsMember(customer: any, user: any) {
  return (
    [customer?.attributes?.pro, customer?.attributes?.instructor].includes(
      'true',
    ) ||
    user?.is_pro ||
    user?.is_instructor
  )
}
