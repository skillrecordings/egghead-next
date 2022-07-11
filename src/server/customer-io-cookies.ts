import {NextResponse} from 'next/server'

export const CIO_COOKIE_KEY = 'cio_id'
export const CIO_CUSTOMER_OBJECT_KEY = 'cio_customer'

export function clearCustomerCookie(res: NextResponse) {
  res.cookies.delete(CIO_COOKIE_KEY)
  res.cookies.delete(CIO_CUSTOMER_OBJECT_KEY)
}

export function setCustomerCookie(res: NextResponse, customer: any) {
  res.cookies.set(CIO_COOKIE_KEY, customer.id, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })

  res.cookies.set(CIO_CUSTOMER_OBJECT_KEY, JSON.stringify(customer), {
    maxAge: 1000 * 60 * 60 * 24 * 2,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })
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
