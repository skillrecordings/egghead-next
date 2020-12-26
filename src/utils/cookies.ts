import cookies from 'js-cookie'
import {isString} from 'lodash'

const cookieUtil = {
  set(name: string, value: any, options: any = {}) {
    const use_secure_cookie = window.location.protocol === 'https:'
    cookies.set(name, isString(value) ? value : JSON.stringify(value), {
      secure: use_secure_cookie,
      path: '/',
      expires: 365,
      ...options,
    })
    return this.get(name)
  },
  get(name: string) {
    const value = cookies.get(name) as string
    try {
      return JSON.parse(value)
    } catch (e) {
      return value
    }
  },
  remove(name: string, options: any = {}) {
    cookies.remove(name, options)
  },
}

export default cookieUtil
