import cookies from './cookies'
import {CIO_KEY} from '../hooks/use-cio'

const getCioIdFromCookie = () => {
  if (!CIO_KEY) return false
  let token = cookies.get(CIO_KEY) || cookies.get('_cioid')
  if (token && token !== 'undefined') {
    return token
  } else if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(CIO_KEY) ?? false
  }

  return false
}

export default getCioIdFromCookie
