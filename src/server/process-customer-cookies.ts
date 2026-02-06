import {NextRequest, NextResponse} from 'next/server'
import {
  ACCESS_TOKEN_KEY,
  CIO_CUSTOMER_OBJECT_KEY,
  CIO_IDENTIFIER_KEY,
  EGGHEAD_USER_COOKIE_KEY,
} from '../config'
import {loadUser} from '../lib/current-user'
import {
  cioCustomerIsMember,
  clearCustomerCookie,
  setCustomerCookie,
} from './customer-io-cookies'
import {loadCio} from '../lib/customer'
import {clearUserCookie, setUserCookie} from './egghead-user-cookies'

export async function getCookiesForRequest(req: NextRequest) {
  const eggheadAccessToken = req.cookies.get(ACCESS_TOKEN_KEY)
    ?.value as unknown as string

  const user =
    eggheadAccessToken &&
    (await loadUser(
      eggheadAccessToken,
      req.cookies.get(EGGHEAD_USER_COOKIE_KEY)?.value,
    ))

  const customerId = user?.contact_id
    ? user.contact_id
    : req.cookies.get(CIO_IDENTIFIER_KEY)?.value ||
      req.nextUrl.searchParams.get(CIO_IDENTIFIER_KEY)

  let customer = customerId
    ? await loadCio(customerId, req.cookies.get(CIO_CUSTOMER_OBJECT_KEY)?.value)
    : null

  const isMember = cioCustomerIsMember(customer, user)
  const isLoggedInMember = Boolean(isMember && user)

  return {user, customer, isMember, isLoggedInMember}
}

export function setCookiesForResponse(
  res: NextResponse,
  req: NextRequest,
  user: any,
  customer: any,
) {
  const hasCioIdCookie = req.cookies.has(CIO_IDENTIFIER_KEY)
  const hasCioObjectCookie = req.cookies.has(CIO_CUSTOMER_OBJECT_KEY)
  const hasUserCookie = req.cookies.has(EGGHEAD_USER_COOKIE_KEY)

  if (customer) {
    try {
      setCustomerCookie(res, customer)
    } catch (e) {
      clearCustomerCookie(res)
      console.error('error setting user cookie', e)
    }
  } else if (hasCioIdCookie || hasCioObjectCookie) {
    clearCustomerCookie(res)
  }

  if (user) {
    try {
      setUserCookie(res, user)
    } catch (e) {
      clearUserCookie(res)
      console.error('error setting user cookie', e)
    }
  } else if (hasUserCookie) {
    clearUserCookie(res)
  }

  return res
}
