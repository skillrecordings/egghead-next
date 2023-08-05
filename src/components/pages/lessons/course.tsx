import * as React from 'react'
import Link from 'next/link'
import {track} from 'utils/analytics'
import Image from 'next/image'

const Course: React.FC<
  React.PropsWithChildren<{
    course: {
      title: string
      square_cover_480_url: string
      slug: string
      path: string
    }
    currentLessonSlug: string
  }>
> = ({course, currentLessonSlug}) => {
  return course ? (
    <div>
      <div className="flex items-center">
        <Link href={course.path}>
          <a className="relative flex-shrink-0 block w-12 h-12 lg:w-20 lg:h-20">
            <Image
              src={course.square_cover_480_url}
              alt={`illustration for ${course.title}`}
              layout="fill"
            />
          </a>
        </Link>
        <div className="ml-2 lg:ml-4">
          <h4 className="mb-px text-xs font-semibold text-gray-700 uppercase dark:text-gray-100">
            Course
          </h4>
          <Link href={course.path}>
            <a
              onClick={() => {
                track(`clicked open course`, {
                  lesson: currentLessonSlug,
                })
              }}
              className="hover:underline"
            >
              <h3 className="font-bold leading-tighter 2xl:text-lg">
                {course.title}
              </h3>
            </a>
          </Link>
        </div>
      </div>
    </div>
  ) : null
}

export default Course
