import {isFunction, isUndefined} from 'lodash'
import getAccessTokenFromCookie from './getAccessTokenFromCookie'

export const track = (event: string, paramsOrCallback?, callback?) => {
  const isServer = typeof window === 'undefined'
  let ahoy

  if (!isServer) {
    const token = getAccessTokenFromCookie()
    ahoy = window.ahoy = window.ahoy || {}
    ahoy.configure({
      urlPrefix: '',
      visitsUrl: `/api/visits`,
      eventsUrl: `/api/events`,
      page: null,
      platform: 'Web',
      useBeacon: true,
      startOnReady: true,
      trackVisits: true,
      cookies: true,
      cookieDomain: process.env.NEXT_PUBLIC_DEPLOYMENT_URL,
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
            'Ahoy-Visit': ahoy.getVisitId(),
            'Ahoy-Visitor': ahoy.getVisitorId(),
          }
        : {
            'Ahoy-Visit': ahoy.getVisitId(),
            'Ahoy-Visitor': ahoy.getVisitorId(),
          },
      withCredentials: false,
    })
  }

  return new Promise((resolve, reject) => {
    if (isServer) reject()
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
