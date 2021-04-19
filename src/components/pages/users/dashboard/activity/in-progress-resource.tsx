import * as React from 'react'
import {FunctionComponent} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {convertTimeWithTitles} from 'utils/time-utils'
import {track} from 'utils/analytics'
import {first, get, isEmpty, find} from 'lodash'
import {LessonResource} from 'types'
import Card from 'components/pages/home/card'

type InProgressResourceProps = {
  resource: any
  small?: boolean
  className?: string
}

const InProgressResource: FunctionComponent<InProgressResourceProps> = ({
  resource,
  small = false,
  className = '',
}) => {
  if (isEmpty(resource)) {
    return null
  }

  const {
    title,
    square_cover_480_url,
    series,
    slug,
    resource_progress,
    progress,
    type,
    path,
    lessons,
    image_128_url,
    items = [],
  } = resource

  const definedProgress = resource_progress || progress

  const {
    completed_lesson_count = 0,
    time_left = 0,
    lesson_count = 0,
    is_completed,
  } = definedProgress || {}

  const completedLessonSlugs = get(
    definedProgress,
    'completed_lessons',
    [],
  ).map((lesson: LessonResource) => lesson.slug)

  const allLessons =
    lessons || items.filter((item: any) => item.type === 'lesson')

  const current_lesson: any = first(
    allLessons.filter(
      (lesson: LessonResource) => !completedLessonSlugs.includes(lesson.slug),
    ),
  )

  const isInProgress = definedProgress && !is_completed
  const lessons_left = lesson_count - completed_lesson_count
  const resource_path = current_lesson?.path || path
  const image_url = square_cover_480_url || image_128_url

  return (
    <Card className={`${small ? 'sm:px-6 sm:py-4' : ''} ${className}`}>
      <div
        className={`flex w-full items-center ${
          small
            ? ''
            : 'items-center md:flex-row flex-col md:space-x-4 space-x-0'
        }`}
      >
        {image_url && resource_path && (
          <Link href={resource_path}>
            <a
              onClick={() =>
                track(`clicked continue watching`, {
                  slug: slug,
                  type: type,
                  location: 'resource in progress (image)',
                })
              }
              tabIndex={-1}
            >
              <Image
                src={image_url}
                alt={title}
                width={small ? 72 : square_cover_480_url ? 160 : 48}
                height={small ? 72 : square_cover_480_url ? 160 : 48}
              />
            </a>
          </Link>
        )}
        <div className="space-y-1 w-full pl-4">
          <div className="">
            <Link href={resource_path || '#'}>
              <a
                className="dark:hover:text-blue-300 hover:text-blue-600"
                onClick={() =>
                  track(`clicked continue watching`, {
                    slug: slug,
                    type: type,
                    location: 'resource in progress (title)',
                  })
                }
              >
                <h3
                  className={`${
                    small ? 'text-lg' : 'text-xl'
                  } font-semibold leading-tight`}
                >
                  {title}
                </h3>
              </a>
            </Link>
            {!isInProgress && series && (
              <div className="text-sm flex items-center">{series?.title}</div>
            )}
          </div>

          {isInProgress && (
            <h2 className="uppercase font-semibold text-xs text-gray-600 dark:text-gray-300 pb-1">
              {lessons_left} lessons left
              <span className="lowercase font-normal">
                {time_left ? ` (${convertTimeWithTitles(time_left)} left)` : ''}
              </span>
            </h2>
          )}

          {isInProgress && (
            <div className="flex items-center space-x-1">
              <Link href={resource_path || '#'}>
                <a
                  className="text-teal-500 dark:text-teal-600 flex bg-white rounded-full"
                  onClick={() =>
                    track(`clicked continue watching`, {
                      slug: slug,
                      type: type,
                      location: 'resource in progress (play button)',
                    })
                  }
                >
                  <PlayIcon />
                </a>
              </Link>

              {/* <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-600 overflow-hidden rounded-sm">
                <div
                  style={{width: `${percent_complete}%`}}
                  className="absolute left-0 top-0 bg-blue-600 h-full"
                />
              </div> */}

              <div className="flex relative w-full h-2 bg-gray-200 dark:bg-gray-600 overflow-hidden rounded-sm">
                {allLessons.map((lesson: any) => {
                  const isComplete = completedLessonSlugs.includes(lesson.slug)
                  console.log(isComplete)
                  return (
                    <Link href={lesson.path}>
                      <a
                        key={lesson.slug}
                        style={{width: `${100 / allLessons.length}%`}}
                        className={`${
                          isComplete
                            ? 'dark:bg-teal-500 dark:hover:bg-teal-600 bg-teal-400 hover:bg-teal-500'
                            : 'dark:bg-gray-500 dark:hover:bg-gray-400 bg-gray-200 hover:bg-gray-300'
                        } h-full border dark:border-gray-800 border-white transition-colors ease-in-out duration-200`}
                      />
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
          {!small && isInProgress && current_lesson && (
            <div className="leading-tighter flex items-baseline space-x-2">
              <div className="text-xs text-gray-600 dark:text-gray-300 flex-shrink-0">
                Up Next
              </div>
              <Link href={resource_path || '3'}>
                <a
                  className="text-sm font-medium leading-tight"
                  onClick={() =>
                    track(`clicked continue watching`, {
                      slug: slug,
                      type: type,
                      location: 'resource in progress (next lesson title)',
                    })
                  }
                >
                  {current_lesson?.title}
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default InProgressResource

const PlayIcon = () => {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM9.555 7.168A1 1 0 0 0 8 8v4a1 1 0 0 0 1.555.832l3-2a1 1 0 0 0 0-1.664l-3-2z"
          fill="currentColor"
        />
      </g>
    </svg>
  )
}
