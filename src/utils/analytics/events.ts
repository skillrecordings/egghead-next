import {track} from './track'

//! ENGAGEMENT EVENT GROUP

//! ACTIVITY EVENT GROUP
type Activity = {
  resourceType?: string
  instructor?: string
  currentLocation: string
  topic: string
  redirectTo: string
}

export const trackInternalLinkClick = ({
  resourceType,
  instructor,
  currentLocation,
  topic,
  redirectTo,
}: Activity) =>
  track('clicked internal link', {
    resourceType,
    instructor,
    currentLocation,
    topic,
    redirectTo,
  })
