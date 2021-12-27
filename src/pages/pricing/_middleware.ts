import {NextRequest, NextResponse} from 'next/server'
import {ACCESS_TOKEN_KEY} from '../../config'
import {loadCio} from '../../lib/customer'

const CIO_COOKIE_KEY = 'cio_id'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next()

  const cioId =
    req.cookies[CIO_COOKIE_KEY] || req.nextUrl.searchParams.get(CIO_COOKIE_KEY)

  const eggheadAccessToken = req.cookies[ACCESS_TOKEN_KEY]

  // if there's a cookie or a token they are logged in
  let status = cioId || eggheadAccessToken ? 'identified' : 'anon'

  switch (status) {
    case 'anon':
      response = NextResponse.next()
      break
    case 'identified':
      if (cioId) {
        try {
          const customer = await loadCio(cioId, req.cookies['customer'])

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

  return response
}
