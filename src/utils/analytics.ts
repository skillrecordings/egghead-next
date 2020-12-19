import {isFunction, isUndefined} from 'lodash'
import Auth from './auth'

export const track = (
  event: string,
  paramsOrCallback?: any,
  callback?: any,
) => {
  const auth = new Auth()

  return new Promise(async (resolve) => {
    const ahoy = window.ahoy
    let wasCalled = false

    const viewer = auth.getLocalUser()

    function politelyExit() {
      if (isFunction(callback) && !wasCalled) {
        wasCalled = true
        callback.apply(null, [event, wasCalled])
      }
    }

    if (viewer && viewer.opted_out) {
      resolve(false)
    } else {
      const params = isFunction(paramsOrCallback) ? {} : paramsOrCallback
      const timeout = 1250

      if (isUndefined(callback) && isFunction(paramsOrCallback)) {
        callback = paramsOrCallback
      }

      const store = console.error

      console.error = () => {}

      setTimeout(politelyExit, timeout)

      console.error = store

      if (ahoy && isFunction(ahoy.track)) {
        ahoy.track(event, params)
      }

      if (window.fbq) {
        window.fbq('trackCustom', event, params)
      }

      if (
        viewer &&
        viewer.contact_id &&
        window._cio &&
        isFunction(window._cio.track)
      ) {
        identify(viewer)
        window._cio.track(event, params)
      }

      resolve(true)
    }
  })
}

export const identify = (data: any) => {
  if (
    !data.opted_out &&
    data.contact_id &&
    window._cio &&
    isFunction(window._cio.identify)
  ) {
    window._cio.identify({
      id: data.contact_id,
      email: data.email,
      first_name: data.name,
      pro: data.is_pro,
      instructor: data.is_instructor,
      created_at: data.created_at,
      discord_id: data.discord_id,
    })
  }
  return Promise.resolve(data)
}

const analytics = {
  track,
  identify,
}

export default analytics
