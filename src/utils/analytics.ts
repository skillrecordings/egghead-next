import {isFunction, isUndefined} from 'lodash'
import getAccessTokenFromCookie from './getAccessTokenFromCookie'

export const track = (
  event: string,
  paramsOrCallback?: any,
  callback?: any,
) => {
  return new Promise(async (resolve) => {
    const ahoy = window.ahoy
    let wasCalled = false

    const params = isFunction(paramsOrCallback) ? {} : paramsOrCallback
    const timeout = 1250

    if (isUndefined(callback) && isFunction(paramsOrCallback)) {
      callback = paramsOrCallback
    }

    function politelyExit() {
      if (isFunction(callback) && !wasCalled) {
        wasCalled = true
        callback.apply(null, [event, wasCalled])
      }
    }

    const store = console.error

    console.error = () => {}

    setTimeout(politelyExit, timeout)

    console.error = store

    if (ahoy && isFunction(ahoy.track)) {
      ahoy.track(event, params)
    }
    const token = getAccessTokenFromCookie()
    if (token && window._cio && isFunction(window._cio.track)) {
      window._cio.track(event, params)
    }

    resolve(true)
  })
}

export const identify = (data: any) => {
  if (window._cio && isFunction(window._cio.identify)) {
    window._cio.identify({
      id: data.id,
      email: data.email,
      first_name: data.name,
      pro: data.is_pro,
      instructor: data.is_instructor,
    })
  }
  return Promise.resolve(data)
}

const analytics = {
  track,
  identify,
}

export default analytics
