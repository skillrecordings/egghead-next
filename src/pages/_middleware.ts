import {NextRequest, NextResponse} from 'next/server'
import {ACCESS_TOKEN_KEY} from '../config'

const PUBLIC_FILE = /\.(.*)$/

const CIO_COOKIE_KEY = 'cio_id'
const CIO_BASE_URL = `https://beta-api.customer.io/v1/api/`

const loadCio = async (cioId: string, customer?: any) => {
  try {
    if (customer) {
      return JSON.parse(customer)
    }
  } catch (error) {
    console.log(error)
  }

  try {
    const cioApiPath = `/customers/${cioId}/attributes`
    const headers = new Headers({
      Authorization: `Bearer ${process.env.CUSTOMER_IO_APPLICATION_API_KEY}`,
    })

    const {customer} = await fetch(`${CIO_BASE_URL}${cioApiPath}`, {
      headers,
    }).then((response) => {
      return response.json()
    })

    return customer
  } catch (error) {
    console.log(error)
  }
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
          const customer = await loadCio(cioId, req.cookies['customer'])

          if (customer?.attributes?.pro === 'true') {
            response = NextResponse.next()
          } else if (customer?.attributes?.react_score > 1) {
            response = NextResponse.rewrite('/signup/react')
          } else {
            response = NextResponse.rewrite('/signup')
          }

          if (customer) {
            response.cookie('customer', JSON.stringify(customer))
            response.cookie(CIO_COOKIE_KEY, cioId)
          }
        }
        break
      default:
        response = NextResponse.next()
    }
  }

  return response
}
