import React, {FunctionComponent} from 'react'
import {SearchHitResourceCard} from '@/components/card/search-hit-resource-card'

type HitComponentProps = {
  hit: any
  completedCoursesIds: string[]
}

export const getInstructorImageUrl = (instructor: {
  id: number
  avatar_file_name: string
}) => {
  if (!instructor) return 'https://d2eip9sf3oo6c2.cloudfront.net/logo.svg'
  const id = instructor?.id?.toString() || ''
  switch (id.length) {
    case 1:
      return `https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/00${id}/square_128/${instructor.avatar_file_name}`
    case 2:
      return `https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/0${id}/square_128/${instructor.avatar_file_name}`
    default:
      return `https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/${id}/square_128/${instructor.avatar_file_name}`
  }
}
const HitComponent: FunctionComponent<
  React.PropsWithChildren<HitComponentProps>
> = ({hit, completedCoursesIds}) => {
  const {
    image,
    type,
    instructor_url,
    instructor_name,
    instructor,
    instructor_avatar_url,
    primary_tag_image_url,
  } = hit

  const hasImage = image !== 'https://d2eip9sf3oo6c2.cloudfront.net/logo.svg'

  return (
    <SearchHitResourceCard
      describe={false}
      location="search"
      resource={{
        ...hit,
        name: type === 'playlist' ? 'course' : type,
        image: primary_tag_image_url ?? image,
        instructor: {
          name: instructor_name,
          url: instructor_url,
          image:
            instructor?.avatar_url ?? instructor?.instructor_avatar_url ?? null,
        },
      }}
      completedCoursesIds={completedCoursesIds}
    />
  )
}

export default HitComponent
