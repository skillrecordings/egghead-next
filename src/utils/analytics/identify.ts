import {isFunction, isUndefined} from 'lodash'
import {Viewer} from 'types'
import Auth from '../auth'
import mixpanel from 'mixpanel-browser'
const DEBUG_ANALYTICS = false

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || '')

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
