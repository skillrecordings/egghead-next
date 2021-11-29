import * as React from 'react'
import Link from 'next/link'
import {track} from 'utils/analytics'
import title from 'title'

const Browse: React.FC<{topic?: string}> = ({topic}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Link href="/learn" passHref>
        <a
          onClick={() => {
            track('clicked start learning', {location: 'homepage'})
          }}
          className="flex items-center justify-center px-8 py-4 transition-all duration-200 ease-in-out dark:bg-blue-50 bg-gray-900 dark:text-black text-white rounded-md dark:hover:bg-white font-medium group"
        >
          Learn from Curated {title(topic?.replace('_', ' ') ?? 'Full Stack')}{' '}
          Courses
          <i
            className="transition-all duration-200 ease-in-out scale-75 gg-arrow-right group-hover:translate-x-1"
            aria-hidden
          />
        </a>
      </Link>
    </div>
  )
}

export default Browse
