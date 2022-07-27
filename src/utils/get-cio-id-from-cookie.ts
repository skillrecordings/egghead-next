import cookies from './cookies'
import {CIO_IDENTIFIER_KEY} from 'config'

const getCioIdFromCookie = () => {
  if (!CIO_IDENTIFIER_KEY) return false
  let token = cookies.get(CIO_IDENTIFIER_KEY) || cookies.get('_cioid')
  if (token && token !== 'undefined') {
    return token
  } else if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(CIO_IDENTIFIER_KEY) ?? false
  }

  return false
}

export default getCioIdFromCookie
