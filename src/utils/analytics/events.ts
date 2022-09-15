import {track} from './track'

//! ENGAGEMENT EVENT GROUP

export const engagementWatchedTalk = (slug: string, percentComplete: string) =>
  track('read article', {
    eventGroup: 'engagement',
    slug,
    percentComplete,
  })

// When a user is visiting an article page
/*
Represents the percentage of the article page a visitor has seen. It'll give us an indicator that the articles are being read. 
*/
export const engagementReadArticle = (slug: string, percentComplete: string) =>
  track('read article', {
    eventGroup: 'engagement',
    slug,
    percentComplete,
  })

// User searched for a topic in egghead
/* 
We want to track the different queries that are being sent and what learners are searching for. This will feed into the learners engagnement metric but we will also be able to parse what queries are sent for content pitches
*/
export const engagementSearchedWithQuery = (
  currentLocation: string,
  queryString: string,
) =>
  track('searched with query', {
    eventGroup: 'engagement',
    currentLocation: currentLocation,
    queryString: queryString,
  })

//! ACTIVITY EVENT GROUP
type Activity = {
  instructor?: string
  currentLocation: string
  topic: string
  redirectTo: string
}

type InternalActivity = Activity & {
  resourceType?: string
}

// User clicks a link that redirects to an internal page
/* 
Throughout our content we include links to complement the user's learning. 
This event refers to those CTAs that redirect the learner to an internal page in egghead 
*/
export const activityInternalLinkClick = (
  resourceType: string,
  instructor: string,
  currentLocation: string,
  topic: string,
  redirectTo: string,
) =>
  track('clicked internal link', {
    eventGroup: 'activity',
    resourceType,
    instructor,
    currentLocation,
    topic,
    redirectTo,
  })

// User clicks a link that redirects to an external page
/* 
Throughout our content we include links to complement the user's learning. This event refers to those CTAs that redirect the learner to an external page.
*/
export const activityExternalLinkClick = (
  instructor: string,
  currentLocation: string,
  topic: string,
  redirectTo: string,
) =>
  track('clicked external link', {
    eventGroup: 'activity',
    instructor,
    currentLocation,
    topic,
    redirectTo,
  })

// User clicked a CTA
/* We implement different CTAs to invite the user to intentinally go to a course or any type of content. This event will help us understand  how CTA's do on different pages */
export const activityCtaClick = (
  resourceType: string,
  instructor: string,
  currentLocation: string,
  topic: string,
  redirectTo: string,
) =>
  track('clicked CTA', {
    eventGroup: 'activity',
    resourceType,
    instructor,
    currentLocation,
    topic,
    redirectTo,
  })
