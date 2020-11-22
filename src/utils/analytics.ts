import {isFunction, isUndefined} from 'lodash'
import configuredAhoy from './ahoy'

export const track = (
  event: string,
  paramsOrCallback?: any,
  callback?: any,
) => {
  return new Promise(async (resolve) => {
    const ahoy = await configuredAhoy()
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
    resolve(true)
  })
}

export const identify = (data: unknown) => {
  return Promise.resolve(data)
}

const analytics = {
  track,
  identify,
}

export default analytics
