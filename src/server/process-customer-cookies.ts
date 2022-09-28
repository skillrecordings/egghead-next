import {NextRequest, NextResponse} from 'next/server'
import {ACCESS_TOKEN_KEY, EGGHEAD_USER_COOKIE_KEY} from '../config'
import {loadUser} from '../lib/current-user'
import {
  cioCustomerIsMember,
  clearCustomerCookie,
  setCustomerCookie,
} from './customer-io-cookies'
import {
  CIO_IDENTIFIER_KEY as CIO_COOKIE_KEY,
  CIO_CUSTOMER_OBJECT_KEY,
} from '../config'
import {loadCio} from '../lib/customer'
import {clearUserCookie, setUserCookie} from './egghead-user-cookies'

export async function getCookiesForRequest(req: NextRequest) {
  const eggheadAccessToken = req.cookies.get(ACCESS_TOKEN_KEY)

  const user =
    eggheadAccessToken &&
    (await loadUser(
      eggheadAccessToken,
      req.cookies.get(EGGHEAD_USER_COOKIE_KEY),
    ))

  const customerId = user?.contact_id
    ? user.contact_id
    : req.cookies.get(CIO_COOKIE_KEY) ||
      req.nextUrl.searchParams.get(CIO_COOKIE_KEY)

  let customer = customerId
    ? await loadCio(customerId, req.cookies.get(CIO_CUSTOMER_OBJECT_KEY))
    : null

  const isMember = cioCustomerIsMember(customer, user)
  const isLoggedInMember = Boolean(isMember && user)

  return {user, customer, isMember, isLoggedInMember}
}

export function setCookiesForResponse(
  res: NextResponse,
  user: any,
  customer: any,
) {
  if (customer) {
    try {
      setCustomerCookie(res, customer)
    } catch (e) {
      clearCustomerCookie(res)
      console.error('error setting user cookie', e)
    }
  } else {
    clearCustomerCookie(res)
  }

  if (user) {
    try {
      setUserCookie(res, user)
    } catch (e) {
      clearUserCookie(res)
      console.error('error setting user cookie', e)
    }
  } else {
    clearUserCookie(res)
  }

  return res
}
