import React, {FunctionComponent} from 'react'
import {SearchHitResourceCard} from 'components/card/search-hit-resource-card'

type HitComponentProps = {
  hit: any
}

const HitComponent: FunctionComponent<HitComponentProps> = ({hit}) => {
  const {image, type, instructor_url, instructor_name, instructor} = hit

  const hasImage = image !== 'https://d2eip9sf3oo6c2.cloudfront.net/logo.svg'

  const getInstructorImageUrl = (id: string) => {
    switch (id.length) {
      case 1:
        return `https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/00${id}/square_128/${instructor.avatar_file_name}`
      case 2:
        return `https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/0${id}/square_128/${instructor.avatar_file_name}`
      default:
        return `https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/${id}/square_128/${instructor.avatar_file_name}`
    }
  }

  return (
    <SearchHitResourceCard
      describe={false}
      location="search"
      resource={{
        ...hit,
        name: type === 'playlist' ? 'course' : type,
        instructor: {
          name: instructor_name,
          url: instructor_url,
          image: instructor
            ? getInstructorImageUrl(instructor.id.toString())
            : null,
        },
      }}
    />
  )
}

export default HitComponent
