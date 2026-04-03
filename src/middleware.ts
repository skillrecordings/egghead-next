import {NextRequest, NextResponse} from 'next/server'
import {getMiddlewareResponse} from './server/get-middleware-response'
import {getCanonicalContentQueryRedirect} from './server/content-query-canonicalization'

const PUBLIC_FILE = /\.(.*)$/

// The allow-list of paths where this middleware executes (perf)
export const config = {
  matcher: ['/pricing', '/q', '/q/:path*', '/courses/:path*', '/lessons/:path*'],
}

export async function middleware(req: NextRequest) {
  // think favicon etc as PUBLIC_FILE
  if (PUBLIC_FILE.test(req.nextUrl.pathname)) return NextResponse.next()

  const canonicalRedirect = getCanonicalContentQueryRedirect(req)
  if (canonicalRedirect) return canonicalRedirect

  if (
    req.nextUrl.pathname.startsWith('/pricing') ||
    req.nextUrl.pathname === '/q' ||
    req.nextUrl.pathname.startsWith('/q/')
  ) {
    return getMiddlewareResponse(req)
  }

  return NextResponse.next()
}
