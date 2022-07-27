import {ACCESS_TOKEN_KEY} from './auth'
import serverCookie from 'cookie'
import {CIO_IDENTIFIER_KEY} from 'config'

export function getTokenFromCookieHeaders(serverCookies: string) {
  const parsedCookie = serverCookie.parse(serverCookies)
  const eggheadToken = parsedCookie[ACCESS_TOKEN_KEY] || ''
  const cioId = parsedCookie['_cioid'] || parsedCookie[CIO_IDENTIFIER_KEY] || ''
  return {cioId, eggheadToken, loginRequired: eggheadToken.length <= 0}
}
