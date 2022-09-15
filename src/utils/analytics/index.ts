import {track} from './track'
import {identify} from './identify'
import {
  activityInternalLinkClick,
  activityExternalLinkClick,
  activityCtaClick,
  engagementSearchedWithQuery,
} from './events'

const events = {
  activityInternalLinkClick,
  activityExternalLinkClick,
  activityCtaClick,
  engagementSearchedWithQuery,
}

const analytics = {
  track,
  identify,
  events,
}

export default analytics
