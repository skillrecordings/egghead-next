import React, {FunctionComponent} from 'react'
import Card, {CardResource} from './'
import Link from 'next/link'
import {track} from 'utils/analytics'
import Image from 'next/image'
import {get} from 'lodash'
import Markdown from 'react-markdown'

export const CardHorizontal: FunctionComponent<{
  resource: CardResource
  className?: string
  location?: string
}> = ({resource, className = 'border-none my-4', location = 'home'}) => {
  return (
    <Card className={className}>
      <>
        <div className="flex sm:flex-row flex-col sm:space-x-5 space-x-0 sm:space-y-0 space-y-5 items-center sm:text-left text-center">
          {resource.image && (
            <Link href={resource.path}>
              <a
                onClick={() => {
                  track('clicked resource', {
                    resource: resource.path,
                    linkType: 'image',
                    location,
                  })
                }}
                className="block flex-shrink-0 sm:w-auto m:w-24 w-36"
                tabIndex={-1}
              >
                <Image
                  src={get(resource.image, 'src', resource.image)}
                  width={160}
                  height={160}
                  alt={`illustration for ${resource.title}`}
                />
              </a>
            </Link>
          )}
          <div className="flex flex-col justify-center sm:items-start items-center">
            <h2 className=" uppercase font-semibold text-xs tracking-tight text-gray-700 dark:text-gray-300 mb-1">
              {resource.name}
            </h2>
            <Link href={resource.path}>
              <a
                onClick={() => {
                  track('clicked resource', {
                    resource: resource.path,
                    linkType: 'text',
                    location,
                  })
                }}
                className="hover:text-blue-600 dark:hover:text-blue-300"
              >
                <h3 className="text-xl font-bold leading-tighter">
                  {resource.title}
                </h3>
              </a>
            </Link>
            <div className="text-xs text-gray-600 dark:text-gray-300 mb-2 mt-1">
              {resource.byline}
            </div>
            <Markdown
              source={resource.description || ''}
              className="prose dark:prose-dark dark:prose-dark-sm prose-sm max-w-none"
            />
          </div>
        </div>
      </>
    </Card>
  )
}

export default CardHorizontal
