import {NextRequest, NextResponse} from 'next/server'
import {getMiddlewareResponse} from '@/server/get-middleware-response'
import {getCanonicalContentQueryRedirect} from '@/server/content-query-canonicalization'
import {getCanonicalSearchQueryRedirect} from '@/server/search-query-canonicalization'

const PUBLIC_FILE = /\.(.*)$/

// The allow-list of paths where this middleware executes (perf).
// `has` clauses on /courses/* and /lessons/* mean middleware only fires when
// a strip-worthy query key is present, letting clean URLs serve directly
// from the static ISR cache. Keys must stay in sync with SHARED_STRIP_KEYS /
// LESSON_CONTEXT_STRIP_KEYS in content-query-canonicalization.ts. Listed
// inline because Next.js statically analyzes this export — helpers/spreads
// would fail the build with "Invalid segment configuration export".
export const config = {
  matcher: [
    '/pricing',
    '/pricing/:path*',
    '/q',
    '/q/:path*',
    {
      source: '/courses/:path*',
      has: [
        {type: 'query', key: 'utm_source'},
        {type: 'query', key: 'utm_medium'},
        {type: 'query', key: 'utm_campaign'},
        {type: 'query', key: 'utm_content'},
        {type: 'query', key: 'utm_term'},
        {type: 'query', key: 'af'},
        {type: 'query', key: 'rc'},
        {type: 'query', key: 'ref'},
        {type: 'query', key: '_cio_id'},
        {type: 'query', key: 'cio_id'},
      ],
    },
    {
      source: '/lessons/:path*',
      has: [
        {type: 'query', key: 'utm_source'},
        {type: 'query', key: 'utm_medium'},
        {type: 'query', key: 'utm_campaign'},
        {type: 'query', key: 'utm_content'},
        {type: 'query', key: 'utm_term'},
        {type: 'query', key: 'af'},
        {type: 'query', key: 'rc'},
        {type: 'query', key: 'ref'},
        {type: 'query', key: '_cio_id'},
        {type: 'query', key: 'cio_id'},
        {type: 'query', key: 'course'},
        {type: 'query', key: 'pl'},
      ],
    },
  ],
}

export async function middleware(req: NextRequest) {
  // think favicon etc as PUBLIC_FILE
  if (PUBLIC_FILE.test(req.nextUrl.pathname)) return NextResponse.next()

  const canonicalRedirect = getCanonicalContentQueryRedirect(req)
  if (canonicalRedirect) return canonicalRedirect

  const canonicalSearchRedirect = getCanonicalSearchQueryRedirect(req)
  if (canonicalSearchRedirect) return canonicalSearchRedirect

  if (
    req.nextUrl.pathname.startsWith('/pricing') ||
    req.nextUrl.pathname === '/q' ||
    req.nextUrl.pathname.startsWith('/q/')
  ) {
    return getMiddlewareResponse(req)
  }

  return NextResponse.next()
}
