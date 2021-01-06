import {ACCESS_TOKEN_KEY} from './auth'
import cookies from './cookies'

const getAccessTokenFromCookie = () => {
  if (!ACCESS_TOKEN_KEY) return false
  const token = cookies.get(ACCESS_TOKEN_KEY)
  if (token) {
    return token
  }

  return false
}

export default getAccessTokenFromCookie
