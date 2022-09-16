import noop from 'utils/noop'
import {identify} from './identify'
import {
  activityInternalLinkClick,
  activityExternalLinkClick,
  activityCtaClick,
  engagementSearchedWithQuery,
  engagementWatchedTalk,
  engagementStartCourse,
  engagementCourseProgress,
  engagementCompletedCourse,
  engagementCompletedLesson,
  engagementClickedWatchedLessonAgain,
  engagementListenPodcast,
  engagementReadArticle,
} from './events'
import {
  purchaseSubscriptionUpgraded,
  purchaseSubscriptionDowngraded,
  purchaseSetSubscriptionStatus,
  purchaseSubscriptionCanceled,
  purchaseSubscriptionCreated,
} from './events.server'

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
  engagementStartCourse,
  engagementCourseProgress,
  engagementCompletedCourse,
  engagementCompletedLesson,
  engagementClickedWatchedLessonAgain,
  engagementListenPodcast,
  engagementReadArticle,
}

export const track = (event: string, paramsOrCallback?: any, callback?: any) =>
  noop

const analytics = {
  track,
  identify,
  events,
  serverSideEvents,
}

export default analytics
