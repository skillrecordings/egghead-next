import * as React from 'react'
import Link from 'next/link'
import axios from '@/utils/configured-axios'
import Image from 'next/legacy/image'
import analytics from '@/utils/analytics'

const Topics: React.FC<React.PropsWithChildren<{data: any}>> = ({data}) => {
  const {topics} = data
  return (
    <div className="sm:pt-16 px-3 pt-8 sm:pb-16 pb-8 max-w-screen-xl mx-auto">
      <h2 className="text-center sm:text-lg text-base dark:text-gray-200 text-gray-700 font-normal text-balance leading-tight pb-6">
        {data.title}
      </h2>
      <div className="grid lg:grid-cols-8 rounded-lg lg:overflow-visible overflow-hidden divide-x lg:divide-y-0 divide-y dark:divide-gray-900 divide-gray-100 sm:grid-cols-4 grid-cols-2 bg-white dark:bg-gray-800">
        {topics?.map(({path, title, slug, image}: any) => {
          return (
            <Link
              key={title}
              href={path}
              passHref
              className="flex flex-col sm:aspect-square lg:first-of-type:rounded-l-lg lg:last-of-type:rounded-r-lg items-center dark:hover:shadow-none hover:shadow-xl hover:z-5 relative justify-center p-5 bg-transparent dark:bg-gray-800 dark:hover:bg-gray-700/50 hover:bg-white ease-in-out transition-all duration-200"
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
              <div className="sm:w-auto w-10">
                {image && (
                  <Image
                    priority
                    aria-hidden
                    src={image}
                    width={40}
                    height={40}
                    alt={title}
                  />
                )}
              </div>
              <h3 className="sm:text-base text-sm text-center sm:pt-3 pt-2">
                {title}
              </h3>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Topics
