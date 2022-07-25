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
    <section className="bg-gray-100 dark:bg-gray-800 bg-opacity-60 rounded p-8 mt-4">
      <Link href={data.path}>
        <a
          className="flex sm:flex-row flex-col items-center justify-center sm:space-x-3"
          onClick={() => {
            track(`clicked course widget`, {
              slug: data.slug,
            })
          }}
        >
          <img
            alt="illustration"
            className="w-40 sm:mr-4"
            src={data.square_cover_480_url}
          />
          <div className="flex flex-col mt-4 items-center text-center sm:items-start sm:justify-start sm:text-left">
            <span className="uppercase font-medium sm:text-[0.65rem] text-[0.55rem] pb-1 text-gray-700 dark:text-indigo-100 opacity-60">
              Course
            </span>
            <p className="text-lg font-bold">{data.title}</p>
            <p className="mt-4">{data.summary}</p>
            <div className="flex flex-row gap-2 my-4">
              <img
                className="w-7 h-7 overflow-hidden flex-shrink-0 rounded-full lg:w-7 lg:h-7"
                alt={`${data.instructor.full_name}  profile picture`}
                src={data.instructor.avatar_url}
              />
              <p>{data.instructor.full_name}</p>
            </div>
          </div>
        </a>
      </Link>{' '}
    </section>
  ) : null
}

export default CourseWidget
