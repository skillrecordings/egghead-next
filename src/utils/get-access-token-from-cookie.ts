import {ACCESS_TOKEN_KEY} from './auth'
import cookies from './cookies'

type GetAccessTokenOptions = {
  allowLocalStorageFallback?: boolean
}

const getAccessTokenFromCookie = (options: GetAccessTokenOptions = {}) => {
  const {allowLocalStorageFallback = true} = options

  if (!ACCESS_TOKEN_KEY) return false
  let token = cookies.get(ACCESS_TOKEN_KEY)
  if (token) {
    return token
  } else if (allowLocalStorageFallback && typeof localStorage !== 'undefined') {
    return localStorage.getItem(ACCESS_TOKEN_KEY) ?? false
  }

  return false
}

export default getAccessTokenFromCookie
