import * as React from 'react'
import useSWR from 'swr'
import {loadCourse} from 'lib/courses'
import Link from 'next/link'
import {FunctionComponent} from 'react'

type CourseWidgetProps = {
  slug: string
}

const CourseWidget: FunctionComponent<CourseWidgetProps> = ({slug}) => {
  const {data} = useSWR(slug, loadCourse)
  return (
    <div>
      {data && (
        <>
          <Link href={data.path}>
            <a>
              <img
                alt="illustration"
                className="w-64"
                src={data.square_cover_480_url}
              />
              {data.title}
            </a>
          </Link>{' '}
          by {data.instructor.full_name}
        </>
      )}
    </div>
  )
}

export default CourseWidget
