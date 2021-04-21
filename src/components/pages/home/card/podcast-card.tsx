import React, {FunctionComponent} from 'react'
import Markdown from 'react-markdown'
import Link from 'next/link'
import {track} from 'utils/analytics'
import Image from 'next/image'
import {convertTimeWithTitles} from 'utils/time-utils'
import {get} from 'lodash'

export type PodcastResource = {
  title: string
  summary: string
  image_url: string
  path: string
  duration: number
  episode_number: number
}

type PodcastProps = {
  className?: string
  resource?: PodcastResource
  location?: string
}

const PodcastCard: FunctionComponent<PodcastProps> = ({
  className,
  resource,
  location = 'home',
  ...restProps
}) => {
  const {title, summary, image_url, path, duration, episode_number} =
    resource || {}

  return (
    <div
      className={`flex flex-col items-center sm:flex-row bg-white dark:bg-gray-800 dark:text-gray-200 shadow-sm rounded-lg overflow-hidden sm:p-8 p-5 space-x-6 ${
        className ? className : ''
      }`}
      {...restProps}
    >
      {image_url && path && (
        <Link href={path}>
          <a
            onClick={() => {
              track('clicked home page resource', {
                resource: path,
                linkType: 'image',
                location,
              })
            }}
            className="block sm:w-auto w-22 mx-auto mb-4"
          >
            <Image
              src={get(image_url, 'src', image_url)}
              width={110}
              height={110}
              alt={`illustration for ${title}`}
              className="inline rounded-full"
            />
          </a>
        </Link>
      )}
      <div>
        <h2 className="uppercase font-semibold text-xs mb-1 text-gray-700 dark:text-gray-300">
          Podcast Episode
        </h2>
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
                <h3 className="text-xl font-bold tracking-tight leading-tight mb-2">
                  {title}
                </h3>
              </a>
            </Link>
          ) : (
            <h3 className="text-xl font-bold tracking-tight leading-tight mb-2">
              {title}
            </h3>
          ))}
        <div className="flex space-x-4">
          {duration && (
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {convertTimeWithTitles(duration)}
            </div>
          )}
          {episode_number && (
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Episode #{episode_number}
            </div>
          )}
        </div>
        {summary && (
          <Markdown className="prose prose-sm dark:prose-dark dark:prose-dark-sm max-w-none mb-3">
            {summary}
          </Markdown>
        )}
      </div>
    </div>
  )
}

export default PodcastCard
