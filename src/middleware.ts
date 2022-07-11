import {NextRequest, NextResponse} from 'next/server'
import {ACCESS_TOKEN_KEY, EGGHEAD_USER_COOKIE_KEY} from './config'
import {loadCio} from './lib/customer'
import {loadUser} from './lib/current-user'

const PUBLIC_FILE = /\.(.*)$/

const CIO_COOKIE_KEY = 'cio_id'

// Supports both a single string value or an array of matchers
export const config = {
  matcher: ['/', '/pricing'],
}

/**
 * with this approach, logged in users can be shown
 * '/' and anon users '/signup' IN PLACE
 *
 * we don't have a server cookie to get member status, but that
 * should be on the short list. That would make this even better
 * because we could send them into a more specific /learn route
 * and we could start personalizing that a bit more using various
 * cookies and such.
 *
 * This looks a lot like the i18n example:
 * https://github.com/vercel/examples/tree/main/edge-functions/i18n
 *
 * an the split testing example that puts them in a bucket:
 * https://github.com/vercel/examples/edge-functions/ab-testing-simple
 *
 */
export async function middleware(req: NextRequest) {
  let response = NextResponse.next()
  // think favicon etc
  if (PUBLIC_FILE.test(req.nextUrl.pathname)) return response

  const url = req.nextUrl.clone()

  const cioId =
    req.cookies.get(CIO_COOKIE_KEY) ||
    req.nextUrl.searchParams.get(CIO_COOKIE_KEY)

  const eggheadAccessToken = req.cookies.get(ACCESS_TOKEN_KEY)

  // if there's a cookie or a token they are logged in
  let status = cioId || eggheadAccessToken ? 'identified' : 'anon'

  // if there's a token, load the user (use cookie cached user if available)
  const user =
    eggheadAccessToken &&
    (await loadUser(
      eggheadAccessToken,
      req.cookies.get(EGGHEAD_USER_COOKIE_KEY),
    ))

  // Only rewrite if we are at the root
  if (req.nextUrl.pathname === '/') {
    switch (status) {
      case 'anon':
        url.pathname = '/signup'
        response = NextResponse.rewrite(url)
        break
      case 'identified':
        if (cioId) {
          try {
            const customer = await loadCio(cioId, req.cookies.get('customer'))

            const isMember =
              [
                customer?.attributes?.pro,
                customer?.attributes?.instructor,
              ].includes('true') ||
              user?.is_pro ||
              user?.is_instructor

            switch (true) {
              case !customer:
                url.pathname = '/signup'
                response = NextResponse.rewrite(url)
                break
              case isMember:
                url.pathname = '/learn'
                response = NextResponse.next()
                break
              case customer.attributes?.react_score > 1:
                url.pathname = '/signup/react'
                response = NextResponse.rewrite(url)
                break
              default:
                url.pathname = '/signup/full_stack'
                response = NextResponse.rewrite(url)
            }

            if (customer) {
              response.cookies.set('customer', JSON.stringify(customer))
            }

            response.cookies.set(CIO_COOKIE_KEY, cioId)
          } catch (_e) {
            response = NextResponse.next()
          }
        }
        break
      default:
        response = NextResponse.next()
    }
  }

  if (req.nextUrl.pathname.startsWith('/pricing')) {
    switch (status) {
      case 'anon':
        response = NextResponse.next()
        break
      case 'identified':
        if (cioId) {
          try {
            const customer = await loadCio(cioId, req.cookies.get('customer'))

            const isMember = [
              customer?.attributes?.pro,
              customer?.attributes?.instructor,
            ].includes('true')

            const loggedInMember = Boolean(isMember && eggheadAccessToken)

            switch (true) {
              case loggedInMember:
                response = NextResponse.rewrite('/user')
                break
              case isMember:
                response = NextResponse.rewrite('/login')
                break
              default:
                response = NextResponse.next()
            }

            if (customer) {
              response.cookies.set('customer', JSON.stringify(customer))
            }

            response.cookies.set(CIO_COOKIE_KEY, cioId)
          } catch (_e) {
            response = NextResponse.next()
          }
        }
        break
      default:
        response = NextResponse.next()
    }
  }

  if (user) {
    try {
      const cookieOptions = {domain: process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN}
      response.cookies.set(
        EGGHEAD_USER_COOKIE_KEY,
        JSON.stringify(user),
        cookieOptions,
      )
    } catch (e) {
      console.error('error setting user cookie', e)
    }
  }

  return response
}
