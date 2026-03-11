import * as React from 'react'
import useSwr from 'swr'
import {loadCourseCardBySlug} from '@/lib/course-card'
import {HorizontalResourceCard} from '../card/horizontal-resource-card'

const ArticleCourseCard: React.FC<
  React.PropsWithChildren<{course: string}>
> = ({course}) => {
  const {data} = useSwr(course, loadCourseCardBySlug)

  return data ? (
    <div className="my-32">
      <HorizontalResourceCard
        resource={{
          name: 'check out this course',
          byline: `${data.instructor.full_name}`,
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
