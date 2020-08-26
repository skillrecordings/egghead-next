import cookies from 'browser-cookies'
import {isString} from 'lodash'

const cookieUtil = {
  set(name: string, value: any) {
    const use_secure_cookie = location.protocol === 'https:'
    cookies.set(name, isString(value) ? value : JSON.stringify(value), {
      secure: use_secure_cookie,
      path: '/',
      expires: 365,
    })
    return cookies.get(name)
  },
  get(name: string) {
    const value = cookies.get(name) as string
    try {
      return JSON.parse(value)
    } catch (e) {
      return value
    }
  },
}

export default cookieUtil
