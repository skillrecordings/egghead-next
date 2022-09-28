import Link from 'next/link'
import Image from 'next/image'
import * as React from 'react'
import {track} from 'utils/analytics'
import noop from 'utils/noop'
import OverlayWrapper from 'components/pages/lessons/overlay/wrapper'

const WatchFullCourseCtaOverlay: React.FunctionComponent<{
  lesson: any
  onClickRewatch?: () => void
}> = ({lesson, onClickRewatch = noop}) => {
  const courseImage = lesson?.collection?.square_cover_480_url

  return (
    <OverlayWrapper>
      <div className="flex flex-col items-center justify-center p-4">
        {courseImage && (
          <div className="w-16 h-16 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 relative flex-shrink-0">
            <Image
              src={courseImage}
              alt={`illustration of ${lesson.collection.title} course`}
              layout="fill"
            />
          </div>
        )}
        <div className="mt-4 md:mt-4">This Lesson is Part of a Course</div>
        <h3 className="text-md md:text-lg font-semibold mt-4 text-center">
          {lesson.collection.title}
        </h3>
        <div className="flex mt-6 md:mt-8">
          <button
            className="border border-blue-600 rounded px-3 py-2 flex items-center hover:bg-gray-900 transition-colors duration-200 ease-in-out"
            onClick={() => {
              track('clicked rewatch video', {
                lesson: lesson.slug,
                location: 'lesson overlay',
              })
              onClickRewatch()
            }}
          >
            <IconRefresh className="w-6 mr-2" /> Watch again
          </button>
          <Link href={lesson?.collection?.path || '#'}>
            <a
              onClick={() => {
                track('clicked view course', {
                  lesson: lesson.slug,
                  location: 'lesson overlay',
                })
              }}
              className="bg-blue-600 rounded px-3 py-2 flex items-center ml-4 hover:bg-blue-500 transition-colors duration-200 ease-in-out"
            >
              <IconPlay className="w-6 mr-2" /> Explore the Whole Course
            </a>
          </Link>
        </div>
      </div>
    </OverlayWrapper>
  )
}

export default WatchFullCourseCtaOverlay

const IconPlay: React.FunctionComponent<{className: string}> = ({
  className = '',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
      clipRule="evenodd"
    />
  </svg>
)

const IconRefresh: React.FunctionComponent<{className: string}> = ({
  className = '',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
)
