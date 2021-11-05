import * as React from 'react'
import Link from 'next/link'
import {track} from 'utils/analytics'

const Join = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-xl font-medium text-center">Become a member</h3>
      <p className="pb-8 text-center opacity-80">
        Learn the skills you need to advance your career
      </p>
      <Link href="/pricing" passHref>
        <a
          onClick={() => {
            track('clicked pricing', {location: 'homepage'})
          }}
          className="flex items-center justify-center px-8 py-3 text-sm transition-all duration-200 ease-in-out border-2 border-blue-500 rounded-md dark:hover:bg-gray-800 hover:bg-blue-50 group"
        >
          Pricing{' '}
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
