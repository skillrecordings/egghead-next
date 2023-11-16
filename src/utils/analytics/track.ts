import {isFunction, isUndefined} from 'lodash'
import {Viewer} from '@/types'
import Auth from '../auth'
import mixpanel from 'mixpanel-browser'
import posthog from 'posthog-js'
import {identify} from './identify'
import PosthogClient from '@/lib/posthog-client'
const DEBUG_ANALYTICS = true

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || '')

export const track = (
  event: string,
  paramsOrCallback?: any,
  callback?: any,
) => {
  const auth = new Auth()

  return new Promise(async (resolve) => {
    try {
      DEBUG_ANALYTICS && console.debug(`TRACKING: ${event}`)

      let wasCalled = false

      const viewer: Viewer = auth.getLocalUser()

      function politelyExit() {
        if (isFunction(callback) && !wasCalled) {
          wasCalled = true
          callback.apply(null, [event, wasCalled])
        }
        resolve(true)
      }

      const params = isFunction(paramsOrCallback) ? {} : paramsOrCallback
      const timeout = 1250

      if (isUndefined(callback) && isFunction(paramsOrCallback)) {
        callback = paramsOrCallback
      }

      const store = console.error

      console.error = () => {}

      setTimeout(politelyExit, timeout)

      console.error = store

      if (window.fbq) {
        window.fbq('trackCustom', event, params)
      }

      if (window.ga) {
        window.ga('send', {
          hitType: 'event',
          eventAction: event,
        })
      }

      if (window.gtag) {
        window.gtag('event', event, params)
      }

      mixpanel.track(event, params)
      PosthogClient.capture(event, params)

      if (
        viewer &&
        !viewer.opted_out &&
        viewer.contact_id &&
        viewer.email &&
        window._cio &&
        isFunction(window._cio.track)
      ) {
        identify(viewer)
        try {
          window._cio.track(event, params)
        } catch (e) {
          console.error('caught error', e)
        }
      }

      politelyExit()
    } catch (e) {
      console.error('caught error', e)
      resolve(false)
    }
  })
}
