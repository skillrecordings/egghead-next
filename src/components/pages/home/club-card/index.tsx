import React, {FunctionComponent} from 'react'
import Link from 'next/link'
import {track} from 'utils/analytics'
import Image from 'next/image'
import {get} from 'lodash'

export type CardResource = {
  title: string
  subTitle: string
  path: string
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
  const {title, subTitle, path, image} = resource || {}

  return (
    <div
      className={`grid bg-white dark:bg-gray-800 dark:text-gray-200 shadow-sm rounded-lg overflow-hidden sm:p-8 p-5 ${
        className ? className : ''
      }`}
      {...restProps}
    >
      <div className="self-center">
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
              className="block flex-shrink-0 sm:w-auto w-20 mx-auto text-center mb-2"
            >
              <Image
                src={get(image, 'src', image)}
                width={100}
                height={100}
                alt={`illustration for ${title}`}
                className="inline"
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
                  <h2 className="uppercase font-semibold text-xs mb-1 text-gray-700 dark:text-gray-300 text-center">
                    Portfolio Club
                  </h2>
                  <h3 className="text-xl font-bold tracking-tight leading-tight mb-2 text-center">
                    {title}
                  </h3>
                </a>
              </Link>
            ) : (
              <>
                <h2 className="uppercase font-semibold text-xs mb-1 text-gray-700 dark:text-gray-300 text-center">
                  Portfolio Club
                </h2>
                <h3 className="text-xl font-bold tracking-tight leading-tight mb-2 text-center">
                  {title}
                </h3>
              </>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-3 border-t-2 border-gray-100 dark:border-gray-700 pt-5 self-end mt-4">
        {subTitle && (
          <div className="col-span-2 text-sm text-gray-600 dark:text-gray-300">
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
                className="w-full mt-4 transition-all duration-150 ease-in-out bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:scale-105 transform hover:shadow-xl text-white font-semibold py-2 px-6 rounded-md"
              >
                Join
              </a>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClubCard
