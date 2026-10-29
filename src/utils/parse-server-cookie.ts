import {ACCESS_TOKEN_KEY} from './auth'
import serverCookie from 'cookie'
import {CIO_IDENTIFIER_KEY} from '@/config'

// Customer.io ids seen in practice: alphanumerics plus `-`, `_`, `@`, `.`.
// Require at least one alphanumeric so `.`/`..` can never act as a path segment.
const CIO_ID_PATTERN = /^[A-Za-z0-9_\-@.]{1,100}$/

export function isValidCioId(id: unknown): id is string {
  return (
    typeof id === 'string' && CIO_ID_PATTERN.test(id) && /[A-Za-z0-9]/.test(id)
  )
}

export function getTokenFromCookieHeaders(serverCookies: string) {
  const parsedCookie = serverCookie.parse(serverCookies)
  const eggheadToken = parsedCookie[ACCESS_TOKEN_KEY] || ''
  const rawCioId =
    parsedCookie['_cioid'] || parsedCookie[CIO_IDENTIFIER_KEY] || ''
  // The cio cookie is unsigned client input; anything malformed is anonymous.
  const cioId = isValidCioId(rawCioId) ? rawCioId : ''
  return {cioId, eggheadToken, loginRequired: eggheadToken.length <= 0}
}
