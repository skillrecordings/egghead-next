import {rewriteToPath} from './rewrite-next-response-to-path'
import {NextRequest, NextResponse} from 'next/server'
import {
  getCookiesForRequest,
  setCookiesForResponse,
} from './process-customer-cookies'

export const SITE_ROOT_PATH = '/'
export const PRICING_PAGE_PATH = '/pricing'

/**
 * with this approach, logged in users can be shown
 * '/' and anon users '/signup' IN PLACE
 *
 * This looks a lot like the i18n example:
 * https://github.com/vercel/examples/tree/main/edge-functions/i18n
 *
 * an the split testing example that puts them in a bucket:
 * https://github.com/vercel/examples/edge-functions/ab-testing-simple
 *
 */
export async function getMiddlewareResponse(req: NextRequest) {
  let response = NextResponse.next()
  const {user, customer, isMember, isLoggedInMember} =
    await getCookiesForRequest(req)

  const reactFan = customer && customer.attributes?.react_score > 1

  if (req.nextUrl.pathname === SITE_ROOT_PATH) {
    switch (true) {
      case isMember:
        response = rewriteToPath('learn', req)
        break
      case reactFan:
        response = rewriteToPath('/signup/react', req)
        break
      default:
        response = rewriteToPath('/signup', req)
    }
  }

  if (req.nextUrl.pathname.startsWith(PRICING_PAGE_PATH)) {
    switch (true) {
      case isLoggedInMember:
        response = rewriteToPath('/user/membership', req)
        break
      case isMember:
        response = rewriteToPath('/login', req)
        break
      default:
        response = NextResponse.next()
    }
  }

  response = setCookiesForResponse(response, user, customer)

  return response
}
