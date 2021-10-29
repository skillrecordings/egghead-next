import * as React from 'react'
import CreateAccount from '../create-account'
import Link from 'next/link'
import {track} from 'utils/analytics'

const Join = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-xl font-medium text-center">Become a member</h3>
      <p className="opacity-80 pb-8 text-center">
        Learn the skills you need to advance your career
      </p>
      <Link href="/pricing" passHref>
        <a
          onClick={() => {
            track('clicked pricing', {location: 'homepage'})
          }}
          className="flex items-center justify-center transition-all ease-in-out duration-200 px-8 py-3 dark:hover:bg-gray-800 hover:bg-blue-50 group text-sm rounded-md border-2 border-blue-500"
        >
          Pricing{' '}
          <i
            className="gg-arrow-right scale-75 group-hover:translate-x-1 transition-all ease-in-out duration-200"
            aria-hidden
          />
        </a>
      </Link>
    </div>
  )
}

const FreeAccount = () => {
  return (
    <div>
      <h3 className="text-xl font-medium text-center">Create free account</h3>
      <p className="opacity-80 pb-8 text-center">
        Start learning from hundreds of free lessons
      </p>
      <CreateAccount
        actionLabel="Create free account"
        location="homepage footer"
      />
    </div>
  )
}

const Footer = () => {
  return (
    <section className="flex md:flex-row flex-col items-center sm:py-24 py-12 max-w-screen-lg w-full mx-auto">
      <FreeAccount />
      <hr className="md:px-16 md:my-0 my-12 w-full max-w-[60px] md:rotate-90 dark:border-gray-800 border-gray-100" />
      <Join />
    </section>
  )
}

export default Footer
