import {isFunction, isUndefined} from 'lodash'
import configuredAhoy from './ahoy'

export const track = (event: string, paramsOrCallback?, callback?) => {
  return new Promise((resolve) => {
    const ahoy = configuredAhoy()
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
    resolve()
  })
}

export const identify = (data) => {
  return new Promise((resolve) => resolve(data))
}

export default {
  track,
  identify,
}
