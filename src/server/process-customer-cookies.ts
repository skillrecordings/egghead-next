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
import {
  clearAccessTokenCookie,
  clearUserCookie,
  setUserCookie,
} from './egghead-user-cookies'

const sameCookieValue = (
  currentValue: string | undefined,
  nextValue: string | null,
) => {
  if (typeof currentValue !== 'string') return false
  if (currentValue === nextValue) return true

  try {
    return decodeURIComponent(currentValue) === nextValue
  } catch {
    return false
  }
}

const serializeCustomerCookie = (customer: any) => {
  if (!customer) return null
  const {id, attributes} = customer
  return JSON.stringify({id, attributes})
}

const serializeUserCookie = (user: any) => {
  if (!user) return null
  return JSON.stringify(user)
}

export async function getCookiesForRequest(req: NextRequest) {
  const eggheadAccessToken = req.cookies.get(ACCESS_TOKEN_KEY)
    ?.value as unknown as string
  const hadAccessToken = Boolean(eggheadAccessToken)

  const user =
    eggheadAccessToken &&
    (await loadUser(
      eggheadAccessToken,
      req.cookies.get(EGGHEAD_USER_COOKIE_KEY)?.value,
    ))
  const shouldClearAccessToken = hadAccessToken && !user

  const customerId = user?.contact_id
    ? user.contact_id
    : req.cookies.get(CIO_IDENTIFIER_KEY)?.value ||
      req.nextUrl.searchParams.get(CIO_IDENTIFIER_KEY)

  const customer = customerId
    ? await loadCio(customerId, req.cookies.get(CIO_CUSTOMER_OBJECT_KEY)?.value)
    : null

  const isMember = cioCustomerIsMember(customer, user)
  const isLoggedInMember = Boolean(isMember && user)

  return {user, customer, isMember, isLoggedInMember, shouldClearAccessToken}
}

export function setCookiesForResponse(
  res: NextResponse,
  req: NextRequest,
  user: any,
  customer: any,
  shouldClearAccessToken = false,
) {
  const hasCioIdCookie = req.cookies.has(CIO_IDENTIFIER_KEY)
  const hasCioObjectCookie = req.cookies.has(CIO_CUSTOMER_OBJECT_KEY)
  const hasUserCookie = req.cookies.has(EGGHEAD_USER_COOKIE_KEY)

  const currentCioIdCookie = req.cookies.get(CIO_IDENTIFIER_KEY)?.value
  const currentCioObjectCookie = req.cookies.get(CIO_CUSTOMER_OBJECT_KEY)?.value
  const currentUserCookie = req.cookies.get(EGGHEAD_USER_COOKIE_KEY)?.value

  if (customer) {
    try {
      const nextCustomerId = customer?.id ? String(customer.id) : null
      const nextCustomerObject = serializeCustomerCookie(customer)
      const customerCookiesChanged =
        !sameCookieValue(currentCioIdCookie, nextCustomerId) ||
        !sameCookieValue(currentCioObjectCookie, nextCustomerObject)

      if (customerCookiesChanged) {
        setCustomerCookie(res, customer)
      }
    } catch (e) {
      clearCustomerCookie(res)
      console.error('error setting user cookie', e)
    }
  } else if (hasCioIdCookie || hasCioObjectCookie) {
    clearCustomerCookie(res)
  }

  if (user) {
    try {
      const nextUserCookie = serializeUserCookie(user)
      if (!sameCookieValue(currentUserCookie, nextUserCookie)) {
        setUserCookie(res, user)
      }
    } catch (e) {
      clearUserCookie(res)
      console.error('error setting user cookie', e)
    }
  } else if (hasUserCookie) {
    clearUserCookie(res)
  }

  if (shouldClearAccessToken) {
    clearAccessTokenCookie(res)
  }

  return res
}
