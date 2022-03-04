import {isFunction, isUndefined} from 'lodash'
import {Viewer} from 'types'
import Auth from './auth'
import mixpanel from 'mixpanel-browser'
const DEBUG_ANALYTICS = false

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || '')

export const track = (
  event: string,
  paramsOrCallback?: any,
  callback?: any,
) => {
  const auth = new Auth()

  return new Promise(async (resolve) => {
    let wasCalled = false

    const viewer: Viewer = auth.getLocalUser()

    function politelyExit() {
      DEBUG_ANALYTICS && console.debug(`TRACKED: ${event}`)
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

    if (
      viewer &&
      !viewer.opted_out &&
      viewer.contact_id &&
      viewer.email &&
      window._cio &&
      isFunction(window._cio.track)
    ) {
      identify(viewer)
      window._cio.track(event, params)
    }

    politelyExit()
  })
}

export const identify = (data: Viewer, properties?: any) => {
  if (data && !data.opted_out && data.contact_id) {
    if (data.email && window._cio && isFunction(window._cio.identify)) {
      window._cio.identify({
        id: data.contact_id,
        email: data.email,
        first_name: data.name,
        pro: data.is_pro,
        instructor: data.is_instructor,
        created_at: data.created_at,
        discord_id: data.discord_id,
        timezone: data.timezone,
        ...properties,
      })
    }

    if (isFunction(mixpanel.identify)) {
      mixpanel.people.set({
        $email: data.email,
        $first_name: data.name,
        pro: data.is_pro,
        instructor: data.is_instructor,
        $created: data.created_at,
        discord_id: data.discord_id,
        $timezone: data.timezone,
        ...properties,
      })
      mixpanel.identify(data.contact_id)
    }
  } else if (data && data.opted_out) {
    mixpanel.opt_out_tracking()
  }

  return Promise.resolve(data)
}

const analytics = {
  track,
  identify,
}

export default analytics
