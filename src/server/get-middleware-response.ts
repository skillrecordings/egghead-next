import {rewriteToPath} from './rewrite-next-response-to-path'
import {NextRequest, NextResponse} from 'next/server'
import {
  getCookiesForRequest,
  setCookiesForResponse,
} from './process-customer-cookies'
import {Ratelimit} from '@upstash/ratelimit'
import {kv} from '@vercel/kv'

export const SITE_ROOT_PATH = '/'
export const PRICING_PAGE_PATH = '/pricing'
export const SEARCH_PAGE_PATH = '/q'

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(100, '5s'),
  analytics: false,
  prefix: 'egh-next-ratelimit',
})

const checkRateLimit = async (ip: string) => {
  if (process.env.NODE_ENV === 'development') {
    return {blocked: false}
  }

  const {success} = await ratelimit.limit(ip)

  return {blocked: !success}
}

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

  if (req.nextUrl.pathname === SITE_ROOT_PATH) {
    response = rewriteToPath('learn', req)
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

  if (req.nextUrl.pathname.startsWith(SEARCH_PAGE_PATH)) {
    switch (true) {
      case isLoggedInMember:
      case user?.email:
      case isMember:
        response = NextResponse.next()
        break
      default:
        const ip = req.ip ?? '127.0.0.1'
        const {blocked} = await checkRateLimit(ip)
        response = blocked
          ? NextResponse.redirect(
              new URL(
                `/blocked?prevPath=${encodeURIComponent(req.nextUrl.pathname)}`,
                req.url,
              ),
            )
          : NextResponse.next()
    }
  }

  response = setCookiesForResponse(response, user, customer)

  return response
}
