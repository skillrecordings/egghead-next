import {NextResponse} from 'next/server'
import {
  CIO_IDENTIFIER_KEY as CIO_COOKIE_KEY,
  CIO_CUSTOMER_OBJECT_KEY,
} from '@/config'

const YEAR_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365
const TWO_DAY_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 2

const buildCookieOptions = (
  maxAge: number,
  sameSite: 'lax' | 'strict' = 'strict',
) => {
  const domain = process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN

  return {
    maxAge,
    secure: process.env.NODE_ENV === 'production',
    sameSite,
    path: '/',
    ...(domain ? {domain} : {}),
  }
}

export const getCioIdentifierCookieOptions = () => {
  return buildCookieOptions(YEAR_COOKIE_MAX_AGE_SECONDS, 'lax')
}

export function clearCustomerCookie(res: NextResponse) {
  res.cookies.delete(CIO_COOKIE_KEY)
  res.cookies.delete(CIO_CUSTOMER_OBJECT_KEY)
}

export function setCustomerCookie(res: NextResponse, customer: any) {
  if (customer?.id) {
    res.cookies.set(CIO_COOKIE_KEY, customer.id, getCioIdentifierCookieOptions())
  }

  if (customer) {
    const {id, attributes} = customer
    res.cookies.set(
      CIO_CUSTOMER_OBJECT_KEY,
      JSON.stringify({id, attributes}),
      buildCookieOptions(TWO_DAY_COOKIE_MAX_AGE_SECONDS),
    )
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
