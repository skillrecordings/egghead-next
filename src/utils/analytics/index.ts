import {track} from './track'
import {identify} from './identify'
import {trackInternalLinkClick} from './events'

const events = {
  trackInternalLinkClick,
}

const analytics = {
  track,
  identify,
  events,
}

export default analytics
