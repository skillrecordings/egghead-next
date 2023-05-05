import {track} from './track'

//! ENGAGEMENT EVENT GROUP
// start course
/* When a course get started by a user  */
/* This will show courses that get started but the don't get finished  */

export const engagementStartCourse = (slug: string) =>
  track('started a course', {
    eventGroup: 'engagement',
    slug,
  })

// course progress
/* Keep track of the progress in the course  */
/* This will show how engaged our learners are with material. This event could get triggered by 10%, 25%, 50%, and 75% */

export const engagementCourseProgress = (
  slug: string,
  percent_complete: number,
) =>
  track('course progress', {
    eventGroup: 'engagement',
    slug,
    percent_complete,
  })

// completed course
/* A user watches the absolute 100% of the course material  */
/* This will show how engaged our learners are with material. For individual journey's this can give us insight into when to pitch learners on subscriptions or upgrades. This event represents the absolute 100% of the material in a course */

export const engagementCompletedCourse = (slug: string) =>
  track('completed a course', {
    eventGroup: 'engagement',
    slug,
  })

// completed lesson
/* A user watches the absolute 100% of a lesson */
/* Individual user finishes a lesson */

export const engagementCompletedLesson = (slug: string) =>
  track('completed a lesson', {
    eventGroup: 'engagement',
    slug,
  })

// clicked watch lesson again
/* user click the CTA watch lesson again */
/* At the end of a lesson, a user could decide to rewatch the lesson. This will give us an insight or what topics are harder or need to be watched more than once to fully understand  */

export const engagementClickedWatchedLessonAgain = (slug: string) =>
  track('clicked watched lesson again', {
    eventGroup: 'engagement',
    slug,
  })

// clicked listen podcast
/* A user is listening to a podcast */
/* This will show how engaged our learners are with material. This event could get triggered by 10%, 25%, 50%, 75%, 100%  */

export const engagementListenPodcast = (
  slug: string,
  percent_complete: number,
) =>
  track('listen podcast', {
    eventGroup: 'engagement',
    slug,
    percent_complete,
  })

// User is listening to a talk
/*
This will show how engaged our learners are with material. This event could get trigered by 10%, 25%, 50%, and 75%, 100%
*/

export const engagementStartedTalk = (slug: string) =>
  track('started talk', {
    eventGroup: 'engagement',
    slug,
  })

export const engagementWatchedTalk = (slug: string, percent_complete: number) =>
  track('watched a talk', {
    eventGroup: 'engagement',
    slug,
    percent_complete,
  })

// When a user is visiting an article page
/*
Represents the percentage of the article page a visitor has seen. It'll give us an indicator that the articles are being read. 
*/
export const engagementReadArticle = (slug: string, percentComplete: number) =>
  track('read an article', {
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
    currentLocation,
    queryString,
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

export const activityLogIn = (type: string = 'email') =>
  track('clicked login button', {
    eventGroup: 'activity',
    type,
  })

// User clicks a link that redirects to an internal page
/* 
Throughout our content we include links to complement the user's learning. 
This event refers to those CTAs that redirect the learner to an internal page in egghead 
*/
export const activityInternalLinkClick = (
  resourceType: string,
  currentLocation: string,
  topic: string,
  redirectTo?: string,
  instructor?: string,
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
  currentLocation: string,
  instructor?: string,
  topic?: string,
  redirectTo?: string,
) =>
  track('clicked CTA', {
    eventGroup: 'activity',
    resourceType,
    instructor,
    currentLocation,
    topic,
    redirectTo,
  })
