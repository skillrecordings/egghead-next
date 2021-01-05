import {useNextUpData} from 'hooks/use-next-up-data'
import Link from 'next/link'
import Image from 'next/image'
import * as React from 'react'
import {track} from 'utils/analytics'

const NextUpOverlay: React.FunctionComponent<{
  lesson: any
  send: any
  nextUp: any
  nextLesson: any
}> = ({lesson, send, nextUp, nextLesson}) => {
  const {nextLessonTitle, nextUpPath} = nextUp
  const courseImage = lesson?.course?.square_cover_480_url
  return (
    <>
      {courseImage && (
        <div className="w-12 h-12 md:w-16 md:h-16 lg:w-32 lg:h-32 relative">
          <Image
            src={courseImage}
            alt={`illustration of ${lesson.course.title} course`}
            layout="fill"
          />
        </div>
      )}
      <div className="mt-4 md:mt-6 lg:mt-8">Up Next</div>
      <h3 className="text-md md:text-lg lg:text-xl font-semibold mt-4 text-center">
        {nextLesson.title || nextLessonTitle}
      </h3>
      <div className="flex mt-6 md:mt-10 lg:mt-16">
        <button
          className="border border-blue-600 rounded px-3 py-2 flex items-center hover:bg-gray-900 transition-colors duration-200 ease-in-out"
          onClick={() => {
            track('clicked rewatch video', {
              lesson: lesson.slug,
            })
            send('LOAD')
          }}
        >
          <IconRefresh className="w-6 mr-2" /> Watch again
        </button>
        <Link href={nextLesson.path || nextUpPath || '#'}>
          <a
            onClick={() => {
              track('clicked play next', {
                lesson: lesson.slug,
              })
            }}
            className="bg-blue-600 rounded px-3 py-2 flex items-center ml-4 hover:bg-blue-500 transition-colors duration-200 ease-in-out"
          >
            <IconPlay className="w-6 mr-2" /> Play next
          </a>
        </Link>
      </div>
      <div className="mt-8 text-xs md:mt-12 lg:mt-20">
        Feeling stuck?{' '}
        <a
          onClick={() => {
            track('clicked feeling stuck', {
              lesson: lesson.slug,
            })
          }}
          href="#"
          className="font-semibold"
        >
          Get help from egghead community
        </a>
      </div>
    </>
  )
}

export default NextUpOverlay

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
