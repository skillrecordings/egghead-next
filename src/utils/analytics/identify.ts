import {isFunction} from 'lodash'
import {Viewer} from 'types'
import mixpanel from 'mixpanel-browser'

export const identify = async (data: Viewer, properties?: any) => {
  try {
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
  } catch (e) {
    console.error('caught error in identify', e)
    return Promise.resolve(false)
  }

  return data
}
