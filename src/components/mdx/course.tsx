import * as React from 'react'
import useSWR from 'swr'
import {loadCourse} from 'lib/courses'
import Link from 'next/link'
import {FunctionComponent} from 'react'
import {track} from '../../utils/analytics'

type CourseWidgetProps = {
  id: string
}

const CourseWidget: FunctionComponent<CourseWidgetProps> = ({id}) => {
  const {data} = useSWR(id, loadCourse)

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
          <img alt="illustration" className="w-32" src={data.image} />
          <div>
            <p className="text-lg">{data.title}</p>
          </div>
        </a>
      </Link>
    </section>
  ) : null
}

export default CourseWidget
