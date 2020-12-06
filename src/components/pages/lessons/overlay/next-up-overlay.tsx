import {useNextUpData} from 'hooks/use-next-up-data'
import Link from 'next/link'
import * as React from 'react'

const NextUpOverlay: React.FunctionComponent<{
  lesson: any
  send: any
  url: string
}> = ({lesson, send, url}) => {
  const {nextLessonTitle, nextUpPath} = useNextUpData(url)
  return (
    <>
      <img src={lesson.course.square_cover_480_url} alt="" className="w-32" />
      <div className="mt-8">Up Next</div>
      <h3 className="text-xl font-semibold mt-4">{nextLessonTitle}</h3>
      <div className="flex mt-16">
        <button
          className="bg-gray-300 rounded p-2 flex items-center"
          onClick={() => send('LOAD')}
        >
          <IconRefresh className="w-6 mr-3" /> Watch Again
        </button>
        <NextResourceButton
          path={nextUpPath}
          className="bg-gray-300 rounded p-2 flex items-center ml-4"
        >
          <IconPlay className="w-6 mr-3" /> Load the Next Video
        </NextResourceButton>
      </div>
      <div className="mt-20">
        Feeling stuck?{' '}
        <a href="#" className="font-semibold">
          Get help from egghead community
        </a>
      </div>
    </>
  )
}

export default NextUpOverlay

const NextResourceButton: React.FunctionComponent<{
  path: string
  className: string
}> = ({children, path, className = ''}) => {
  return (
    <Link href={path || '#'}>
      <a className={className}>{children || 'Next Lesson'}</a>
    </Link>
  )
}

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
