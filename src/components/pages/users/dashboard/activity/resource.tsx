import * as React from 'react'
import {FunctionComponent} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {convertTimeWithTitles} from 'utils/time-utils'
import {track} from 'utils/analytics'

type ResourceProps = {
  title: string
  square_cover_480_url?: string
  image_480_url?: string
  slug: string
  series?: {
    square_cover_url: string
    title: string
  }
  progress?: {
    current_lesson: any
    completed_lesson_count: number
    time_left: number
    lesson_count: number
    is_completed: boolean
  }
  type: string
  path: string
}

const Resource: FunctionComponent<ResourceProps> = ({
  title,
  square_cover_480_url,
  image_480_url,
  series,
  slug,
  progress,
  type,
  path,
}) => {
  const {
    current_lesson,
    completed_lesson_count = 0,
    time_left = 0,
    lesson_count = 0,
    is_completed,
  } = progress || {}
  const isInProgress = progress && !is_completed
  const lessons_left = lesson_count - completed_lesson_count
  const percent_complete = (completed_lesson_count * 100) / lesson_count
  const resource_path = current_lesson?.path || path
  const image_url =
    series?.square_cover_url || image_480_url || square_cover_480_url
  return (
    <div>
      <div className="flex md:items-center md:flex-row flex-col md:space-x-4 space-x-0">
        {image_url && (
          <Link href={resource_path}>
            <a
              onClick={() =>
                track(`clicked continue watching`, {
                  slug: slug,
                  type: type,
                  location: 'resource in progress (image)',
                })
              }
            >
              <Image
                src={image_url}
                alt={title}
                width={square_cover_480_url ? 112 : 48}
                height={square_cover_480_url ? 112 : 48}
              />
            </a>
          </Link>
        )}
        <div className="space-y-1 w-full">
          <div className="">
            <Link href={resource_path}>
              <a
                onClick={() =>
                  track(`clicked continue watching`, {
                    slug: slug,
                    type: type,
                    location: 'resource in progress (title)',
                  })
                }
              >
                <h3 className="text-lg font-semibold leading-tight">{title}</h3>
              </a>
            </Link>
            {!isInProgress && series && (
              <div className="text-sm flex items-center">{series?.title}</div>
            )}
            {isInProgress && (
              <div className="text-gray-700 text-sm">
                {convertTimeWithTitles(time_left)} left to go ({lessons_left}{' '}
                more lessons)
              </div>
            )}
          </div>
          {isInProgress && (
            <div className="flex items-center space-x-1">
              <Link href={resource_path}>
                <a
                  className="text-blue-600"
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
              <div className="relative w-full h-2 bg-gray-200 overflow-hidden rounded-sm">
                <div
                  style={{width: `${percent_complete}%`}}
                  className="absolute left-0 top-0 bg-blue-600 h-full"
                />
              </div>
            </div>
          )}
          {isInProgress && (
            <div className="leading-tighter flex items-center space-x-2">
              <div className="text-xs text-gray-600">Up Next</div>
              <Link href={resource_path}>
                <a
                  className="text-sm font-medium"
                  onClick={() =>
                    track(`clicked continue watching`, {
                      slug: slug,
                      type: type,
                      location: 'resource in progress (next lesson title)',
                    })
                  }
                >
                  {current_lesson.title}
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Resource

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
