import {NextRequest, NextResponse} from 'next/server'
import {CIO_IDENTIFIER_KEY} from '@/config'

const LONG_LIVED_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365 * 20
const YEAR_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365

const SHARED_STRIP_KEYS = new Set([
  'af',
  'rc',
  'ref',
  '_cio_id',
  CIO_IDENTIFIER_KEY,
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
])

const LESSON_CONTEXT_STRIP_KEYS = new Set(['course', 'pl'])

const buildCookieOptions = (maxAge: number) => {
  const domain = process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN

  return {
    maxAge,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    ...(domain ? {domain} : {}),
  }
}

const shouldStripKey = (pathname: string, key: string) => {
  if (key.startsWith('nxtP')) return true
  if (SHARED_STRIP_KEYS.has(key)) return true
  if (pathname.startsWith('/lessons/') && LESSON_CONTEXT_STRIP_KEYS.has(key)) {
    return true
  }
  return false
}

const isCanonicalizedContentPath = (pathname: string) => {
  return (
    pathname.startsWith('/courses/') ||
    pathname.startsWith('/lessons/') ||
    pathname === '/q' ||
    pathname.startsWith('/q/')
  )
}

export function getCanonicalContentQueryRedirect(
  req: NextRequest,
): NextResponse | null {
  const {pathname, searchParams} = req.nextUrl

  if (!isCanonicalizedContentPath(pathname)) return null

  const strippedKeys = Array.from(new Set(Array.from(searchParams.keys()))).filter(
    (key) => shouldStripKey(pathname, key),
  )

  if (strippedKeys.length === 0) return null

  const destination = req.nextUrl.clone()
  strippedKeys.forEach((key) => {
    destination.searchParams.delete(key)
  })

  const response = NextResponse.redirect(destination)

  const affiliateToken = searchParams.get('af')
  if (affiliateToken) {
    response.cookies.set(
      'af',
      affiliateToken,
      buildCookieOptions(LONG_LIVED_COOKIE_MAX_AGE_SECONDS),
    )
  }

  const referralToken = searchParams.get('rc')
  if (referralToken) {
    response.cookies.set(
      'rc',
      referralToken,
      buildCookieOptions(LONG_LIVED_COOKIE_MAX_AGE_SECONDS),
    )
  }

  const cioId = searchParams.get('_cio_id') ?? searchParams.get(CIO_IDENTIFIER_KEY)
  if (cioId) {
    response.cookies.set(
      CIO_IDENTIFIER_KEY,
      cioId,
      buildCookieOptions(YEAR_COOKIE_MAX_AGE_SECONDS),
    )
  }

  console.log(
    JSON.stringify({
      event: 'page.query_canonicalize',
      route_path: pathname,
      original_path: req.nextUrl.pathname + req.nextUrl.search,
      destination: destination.pathname + destination.search,
      stripped_keys: strippedKeys,
      captured_af: Boolean(affiliateToken),
      captured_rc: Boolean(referralToken),
      captured_cio_id: Boolean(cioId),
    }),
  )

  return response
}
