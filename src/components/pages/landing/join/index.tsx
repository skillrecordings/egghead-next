import * as React from 'react'
import Link from 'next/link'
import {track} from 'utils/analytics'
import CreateAccount from '../create-account'
import title from 'title'

const Join: React.FC<React.PropsWithChildren<{topic?: string}>> = ({topic}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* <h3 className="text-xl font-medium text-center">Become a member</h3>
      <p className="pb-8 text-center opacity-80">
        Learn the skills you need to advance your career
      </p> */}
      <Link href="/pricing" passHref>
        <a
          onClick={() => {
            track('clicked pricing', {location: 'homepage'})
          }}
          className="flex items-center justify-center px-8 py-4 transition-all duration-200 ease-in-out dark:bg-blue-50 bg-gray-900 dark:text-black text-white rounded-md dark:hover:bg-white font-medium group"
        >
          Become a Member and Unlock{' '}
          {title(topic?.replace('_', ' ') ?? 'Full Stack')} Courses
          <i
            className="transition-all duration-200 ease-in-out scale-75 gg-arrow-right group-hover:translate-x-1"
            aria-hidden
          />
        </a>
      </Link>
    </div>
  )
}

export default Join
