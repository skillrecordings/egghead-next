import React, {FunctionComponent} from 'react'
import Link from 'next/link'
import {track} from 'utils/analytics'
import Image from 'next/image'
import {get} from 'lodash'

export type CardResource = {
  title: string
  subTitle: string
  path: string
  meta: boolean
  image: string | {src: string; alt: string}
}

type CardProps = {
  resource?: CardResource
  className?: string
  location?: string
}

const ClubCard: FunctionComponent<CardProps> = ({
  resource,
  className,
  location = 'home',
  ...restProps
}) => {
  const {title, subTitle, path, meta, image} = resource || {}

  return (
    <div
      className={`bg-white dark:bg-gray-800 dark:text-gray-200 shadow-sm rounded-lg overflow-hidden sm:p-8 p-5 ${
        className ? className : ''
      }`}
      {...restProps}
    >
      <div>
        <div>
          {meta ? (
            <div className="flex items-center">
              <span className="flex h-3 w-3 relative mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <h2 className="uppercase font-semibold text-xs text-gray-700 dark:text-gray-300">
                Live
              </h2>
            </div>
          ) : (
            <h2 className="uppercase font-semibold text-xs text-gray-700 dark:text-gray-300">
              Self-paced
            </h2>
          )}
        </div>

        <div className="my-4">
          {image && path && (
            <Link href={path}>
              <a
                onClick={() => {
                  track('clicked home page resource', {
                    resource: path,
                    linkType: 'image',
                    location,
                  })
                }}
                className="block flex-shrink-0 sm:w-auto w-20 mx-auto text-center"
              >
                <Image
                  src={get(image, 'src', image)}
                  width={140}
                  height={140}
                  alt={`illustration for ${title}`}
                  className="inline mb-4"
                />
              </a>
            </Link>
          )}
          <div className="flex flex-col justify-center">
            {title &&
              (path ? (
                <Link href={path}>
                  <a
                    onClick={() => {
                      track('clicked home page resource', {
                        resource: path,
                        linkType: 'text',
                        location,
                      })
                    }}
                    className="hover:text-blue-600 dark:hover:text-blue-300"
                  >
                    <h3 className="text-xl font-bold tracking-tight leading-tight mb-2 text-center">
                      {title}
                    </h3>
                  </a>
                </Link>
              ) : (
                <h3 className="text-xl font-bold tracking-tight leading-tight mb-2 text-center">
                  {title}
                </h3>
              ))}
          </div>
        </div>
        <div className="grid grid-cols-3 align-baseline border-t-2 border-gray-100 dark:border-gray-700 pt-5">
          {subTitle && (
            <div className="col-span-2 text-sm text-gray-600 dark:text-gray-300 mb-3">
              {subTitle}
            </div>
          )}
          {path && (
            <div className="justify-self-end">
              <Link href={path}>
                <a
                  onClick={() => {
                    track('clicked home page resource', {
                      resource: path,
                      linkType: 'image',
                      location,
                    })
                  }}
                  className="w-full mt-4 transition-all duration-150 ease-in-out bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:scale-105 transform hover:shadow-xl text-white font-semibold py-3 px-5 rounded-md"
                >
                  Join
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClubCard
