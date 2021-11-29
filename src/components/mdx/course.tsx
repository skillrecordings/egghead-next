import * as React from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import {FunctionComponent} from 'react'
import {track} from 'utils/analytics'
import {loadCourse} from 'lib/courses'

type CourseWidgetProps = {
  slug: string
}

const CourseWidget: FunctionComponent<CourseWidgetProps> = ({slug}) => {
  const {data} = useSWR(slug, loadCourse)

  return data?.path ? (
    <section>
      <Link href={data.path}>
        <a
          className="flex items-center space-x-3"
          onClick={() => {
            track(`clicked course widget`, {
              slug: data.slug,
            })
          }}
        >
          <img
            alt="illustration"
            className="w-32"
            src={data.square_cover_480_url}
          />
          <div>
            <p className="text-lg">{data.title}</p>
          </div>
        </a>
      </Link>{' '}
      by {data.instructor.full_name}
    </section>
  ) : null
}

export default CourseWidget
