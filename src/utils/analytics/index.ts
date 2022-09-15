import {track} from './track'
import {identify} from './identify'
import {
  activityInternalLinkClick,
  activityExternalLinkClick,
  activityCtaClick,
  engagementSearchedWithQuery,
  engagementWatchedTalk,
} from './events'
import {
  purchaseSubscriptionUpgraded,
  purchaseSubscriptionDowngraded,
  purchaseSetSubscriptionStatus,
  purchaseSubscriptionCanceled,
  purchaseSubscriptionCreated,
} from './server-side-events'

const serverSideEvents = {
  purchaseSubscriptionUpgraded,
  purchaseSubscriptionDowngraded,
  purchaseSetSubscriptionStatus,
  purchaseSubscriptionCanceled,
  purchaseSubscriptionCreated,
}

const events = {
  activityInternalLinkClick,
  activityExternalLinkClick,
  activityCtaClick,
  engagementSearchedWithQuery,
  engagementWatchedTalk,
}

const analytics = {
  track,
  identify,
  events,
  serverSideEvents,
}

export default analytics
