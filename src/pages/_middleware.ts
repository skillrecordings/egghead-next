import {NextRequest, NextResponse} from 'next/server'
import {ACCESS_TOKEN_KEY} from '../config'
import {loadCio} from '../lib/customer'

const PUBLIC_FILE = /\.(.*)$/

const CIO_COOKIE_KEY = 'cio_id'

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

  // Only rewrite if we are at the root
  if (req.nextUrl.pathname === '/') {
    const cioId =
      req.cookies[CIO_COOKIE_KEY] ||
      req.nextUrl.searchParams.get(CIO_COOKIE_KEY)

    // if there's a cookie or a token they are logged in
    let status = cioId || req.cookies[ACCESS_TOKEN_KEY] ? 'identified' : 'anon'

    switch (status) {
      case 'anon':
        response = NextResponse.rewrite('/signup')
        break
      case 'identified':
        if (cioId) {
          try {
            const customer = await loadCio(cioId, req.cookies['customer'])

            const isMember = [
              customer?.attributes?.pro,
              customer?.attributes?.instructor,
            ].includes('true')

            switch (true) {
              case !customer:
                response = NextResponse.rewrite('/signup')
                break
              case isMember:
                response = NextResponse.next()
                break
              case customer.attributes?.react_score > 1:
                response = NextResponse.rewrite('/signup/react')
                break
              default:
                response = NextResponse.rewrite('/signup/full_stack')
            }

            if (customer) {
              response.cookie('customer', JSON.stringify(customer))
            }

            response.cookie(CIO_COOKIE_KEY, cioId)
          } catch (_e) {
            response = NextResponse.next()
          }
        }
        break
      default:
        response = NextResponse.next()
    }
  }

  return response
}
