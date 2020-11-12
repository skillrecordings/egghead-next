import {isFunction, isUndefined} from 'lodash'
import configuredAhoy from './ahoy'

export const track = (
  event: string,
  paramsOrCallback?:
    | {
        lesson?: any
        tags?: any
        course?: any
        percent_completed?: number
        first_lesson?: any
        lesson_count?: any
        final_lesson?: any
        enhanced_transcripts_complete?: boolean
      }
    | undefined,
  callback?: {(...args: any[]): any; apply?: any} | undefined,
) => {
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

export const identify = (data: unknown) => {
  return new Promise((resolve) => resolve(data))
}

const analytics = {
  track,
  identify,
}

export default analytics
