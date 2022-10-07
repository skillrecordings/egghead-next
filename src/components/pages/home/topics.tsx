import * as React from 'react'
import Link from 'next/link'
import axios from 'utils/configured-axios'
import Image from 'next/image'
import analytics from 'utils/analytics'

const Topics: React.FC<{data: any}> = ({data}) => {
  const {topics} = data
  return (
    <div className="sm:pt-10 sm:pb-32 pt-0 pb-16">
      <h2 className="text-center lg:text-2xl sm:text-xl text-lg dark:text-white font-semibold leading-tight pb-6">
        {data.title}
      </h2>
      <div className="grid lg:grid-cols-8 sm:grid-cols-4 grid-cols-3 xl:gap-5 gap-3 max-w-screen-lg mx-auto">
        {topics?.map(({path, title, slug, image}: any) => {
          return (
            <Link key={title} href={path} passHref>
              <a
                className="flex flex-col items-center hover:shadow-smooth justify-center px-5 py-8 rounded-lg dark:bg-gray-800 dark:bg-opacity-60 dark:hover:bg-opacity-100 hover:bg-white ease-in-out transition-all duration-200"
                onClick={() => {
                  analytics.events.activityInternalLinkClick(
                    'curated topic page',
                    'home page',
                    title,
                    path,
                  )
                  axios.post(`/api/topic`, {
                    topic: slug,
                    amount: 1,
                  })
                }}
              >
                <div className="sm:w-auto w-8">
                  {image && (
                    <Image
                      aria-hidden
                      src={image}
                      width={48}
                      height={48}
                      alt={title}
                    />
                  )}
                </div>
                <h3 className="sm:text-base text-sm text-center sm:pt-3 pt-2">
                  {title}
                </h3>
              </a>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Topics
