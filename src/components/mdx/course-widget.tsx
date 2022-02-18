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

const CourseWidget: React.FC<{course: any; cta?: string}> = ({course, cta}) => {
  const {title, path, lessons, instructor, duration, image_thumb_url} = course
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
            course
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
        </div>
      </div>
      <div className="sm:border-l dark:border-gray-800 border-gray-200 border-t sm:border-t-0 flex flex-col h-full">
        <div className="px-3.5 pt-5 pb-2 flex items-center text-xs justify-between">
          <span className="font-medium uppercase dark:text-gray-400 text-gray-500">
            {lessons.length} lessons
          </span>
          {duration && (
            <span className="font-medium text-gray-400">
              {convertTimeToMins(Number(duration))}
            </span>
          )}
        </div>
        <ul className="h-[320px] overflow-y-auto">
          {lessons.map((lesson: any) => {
            return (
              <li key={lesson.path}>
                <a
                  href={`https://egghead.io${lesson.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between space-x-1 px-2 py-2 dark:hover:bg-gray-900 hover:bg-gray-200 group transition"
                >
                  <div className="flex items-center">
                    <PlayIcon />
                    <span className="leading-tighter text-sm dark:text-gray-300 text-gray-700 dark:group-hover:text-white group-hover:text-gray-900 transition">
                      {lesson.title}
                    </span>
                  </div>
                  {duration && (
                    <div className="text-xs pr-2 pl-1 text-gray-500">
                      {convertTimeToMins(Number(lesson.duration))}
                    </div>
                  )}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default CourseWidget
