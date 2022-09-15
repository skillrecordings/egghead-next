import {track} from './track'

//! ENGAGEMENT EVENT GROUP

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
