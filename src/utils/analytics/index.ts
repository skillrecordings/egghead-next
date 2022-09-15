import {track} from './track'
import {identify} from './identify'
import {
  activityInternalLinkClick,
  activityExternalLinkClick,
  activityCtaClick,
} from './events'

const events = {
  activityInternalLinkClick,
  activityExternalLinkClick,
  activityCtaClick,
}

const analytics = {
  track,
  identify,
  events,
}

export default analytics
