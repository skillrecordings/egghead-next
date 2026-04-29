import {NextRequest, NextResponse} from 'next/server'
import {getMiddlewareResponse} from '@/server/get-middleware-response'
import {getCanonicalContentQueryRedirect} from '@/server/content-query-canonicalization'
import {getCanonicalSearchQueryRedirect} from '@/server/search-query-canonicalization'

const PUBLIC_FILE = /\.(.*)$/

// Keys whose presence on /courses/* or /lessons/* should trigger canonicalization.
// Must stay in sync with SHARED_STRIP_KEYS / LESSON_CONTEXT_STRIP_KEYS in
// content-query-canonicalization.ts. Without one of these, the request can
// be served straight from the static ISR cache without invoking the edge.
const CONTENT_STRIP_QUERY_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'af',
  'rc',
  'ref',
  '_cio_id',
  'cio_id',
] as const

const LESSON_ONLY_STRIP_QUERY_KEYS = ['course', 'pl'] as const

const queryHas = (keys: readonly string[]) =>
  keys.map((key) => ({type: 'query' as const, key}))

// The allow-list of paths where this middleware executes (perf)
export const config = {
  matcher: [
    '/pricing',
    '/pricing/:path*',
    '/q',
    '/q/:path*',
    {
      source: '/courses/:path*',
      has: queryHas(CONTENT_STRIP_QUERY_KEYS),
    },
    {
      source: '/lessons/:path*',
      has: queryHas([
        ...CONTENT_STRIP_QUERY_KEYS,
        ...LESSON_ONLY_STRIP_QUERY_KEYS,
      ]),
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
