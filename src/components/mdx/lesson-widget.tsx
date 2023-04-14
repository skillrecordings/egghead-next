import * as React from 'react'
import Link from 'next/link'
import {convertTimeToMins} from 'utils/time-utils'
import {find} from 'lodash'

const PlayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 20 20"
    className="p-1.5 dark:group-hover:text-orange-300 group-hover:text-orange-500 text-gray-500 transition flex-shrink-0"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M4 3.323A1.25 1.25 0 015.939 2.28l10.32 6.813a1.25 1.25 0 010 2.086L5.94 17.992A1.25 1.25 0 014 16.949V3.323z"
    />
  </svg>
)

const LessonWidget: React.FC<{
  lesson: {title: string; description: string; path: string}
  course: any
  cta?: string
}> = ({lesson, course, cta}) => {
  const {instructor, image_thumb_url} = course
  const {title, description, path} = lesson

  return (
    <div className="sm:grid grid-cols-2 dark:bg-gray-1000 bg-gray-100 bg-opacity-80 dark:bg-opacity-100 rounded-lg overflow-hidden">
      <div className="sm:p-6 p-5 flex flex-col justify-between">
        <img
          src={image_thumb_url}
          alt={title}
          width={160}
          height={160}
          className="-m-3"
        />
        <div className="sm:pt-8 pt-5">
          <p className="uppercase text-xs font-semibold pb-2 dark:text-orange-300 text-orange-500">
            lesson
          </p>
          <h2 className="text-xl font-medium leading-tight dark:text-white text-black">
            <Link href={path}>
              <a className="group">
                <span className="group-hover:underline">{title}</span>{' '}
                {instructor?.full_name && (
                  <span className="text-lg dark:text-gray-400 text-gray-500 font-normal">
                    – by {instructor.full_name}
                  </span>
                )}
              </a>
            </Link>
          </h2>
          <p className="text-sm dark:text-gray-300 text-gray-700">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default LessonWidget
