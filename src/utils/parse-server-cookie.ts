import {ACCESS_TOKEN_KEY} from './auth'
import serverCookie from 'cookie'

export function getTokenFromCookieHeaders(serverCookies: string) {
  const parsedCookie = serverCookie.parse(serverCookies)
  const eggheadToken = parsedCookie[ACCESS_TOKEN_KEY] || ''
  const cioId = parsedCookie['_cioid'] || parsedCookie['cio_id'] || ''
  return {cioId, eggheadToken, loginRequired: eggheadToken.length <= 0}
}
