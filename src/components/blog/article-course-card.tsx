import * as React from 'react'
import useSwr from 'swr'
import {loadPlaylist} from '../../lib/playlists'
import {HorizontalResourceCard} from '../card/horizontal-resource-card'

const ArticleCourseCard: React.FC<{course: any}> = ({course}) => {
  const {data} = useSwr(course, loadPlaylist)

  return data ? (
    <div className="my-32">
      <HorizontalResourceCard
        resource={{
          name: 'check out this course',
          byline: `${data.instructor.name}`,
          slug: data.slug,
          title: data.title,
          path: data.path,
          image: data.square_cover_480_url,
        }}
      />
    </div>
  ) : null
}

export default ArticleCourseCard
