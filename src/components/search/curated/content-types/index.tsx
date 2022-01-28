import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {isEmpty} from 'lodash'

type FeaturedSeasonEpisodeInstructor = {
  image: string
  name: string
}

type FeaturedSeasonEpisodeResource = {
  byline: string
  description: string
  instructor: FeaturedSeasonEpisodeInstructor
  path: string
  summary: string
  title: string
}

type FeaturedSeasonResource = {
  byline: string
  image: string
  title: string
  summary: string
  description: string
  resources: FeaturedSeasonEpisodeResource[]
  host: {
    image: string
    name: string
  }
}

type FeaturedEpisodeResource = {
  byline: string
  description: string
  quote: string
  summary: string
  title: string
}

const FeaturedSeasonCard: React.FC<{resource: FeaturedSeasonResource}> = ({
  resource,
}) => {
  const {image, title, description, resources, host} = resource
  return (
    <div className="flex flex-col h-full overflow-hidden bg-white border border-gray-200 rounded-md dark:border-gray-800 lg:flex-row shadow-smooth dark:bg-gray-1000 bg-opacity-80 dark:bg-opacity-100">
      <div className="flex py-3 space-x-3 md:flex-row flex-nowrap grow lg:py-0">
        <div className="relative w-32 shrink-0">
          <Image src={image} alt={title} layout="fill" objectFit="cover" />
        </div>
        <div className="py-4 pr-4 space-y-2 text-sm min-h-[14rem]">
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="flex items-center space-x-2 text-xs">
            <span className="text-gray-600 dark:text-gray-400">
              interviewed by
            </span>
            <div className="flex overflow-hidden rounded-full shrink-0">
              <Image src={host.image} alt={host.name} width={24} height={24} />
            </div>
            <span className="font-semibold">{host.name}</span>
          </p>
          <p>{description}</p>
        </div>
      </div>
      <div className="relative flex flex-col w-full border-t border-gray-200 dark:border-gray-800 lg:w-96 shrink-0 lg:border-t-0 lg:border-l">
        <div className="px-3.5 pt-5 pb-2 flex items-center text-xs justify-between shrink-0">
          <span className="font-medium text-gray-500 uppercase dark:text-gray-400">
            {resources.length} episode{resources.length > 1 && 's'}
          </span>
        </div>
        <div className="relative grow">
          <div className="inset-0 lg:absolute">
            <ul className="w-full h-full overflow-y-scroll text-sm divide-y divide-gray-200 dark:divide-gray-800 overscroll-contain max-h-56 lg:max-h-full lg:min-h-[14rem]">
              {resources.map(
                (episode: FeaturedSeasonEpisodeResource, i: number) => {
                  return (
                    <li key={i}>
                      <Link href={episode.path}>
                        <a className="flex items-center p-2 duration-100 dark:hover:bg-gray-900 hover:bg-gray-200 leading-tighter group">
                          <PlayIcon />
                          <div className="flex ml-0.5 mr-2 overflow-hidden rounded-full shrink-0">
                            <Image
                              src={episode.instructor.image}
                              width={32}
                              height={32}
                              alt={episode.instructor.name}
                            />
                          </div>
                          <div className="space-y-1">
                            <div>{episode.title}</div>
                            <div className="flex items-center space-x-2">
                              <span className="opacity-60">
                                {episode.instructor.name}
                              </span>
                              <span>&#183;</span>
                              <span className="opacity-60">1hr 23mins</span>
                            </div>
                          </div>
                        </a>
                      </Link>
                    </li>
                  )
                },
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

const FeaturedEpisodeCard: React.FC<{resource: FeaturedEpisodeResource}> = ({
  resource,
}) => {
  const {byline, description, quote, summary, title} = resource
  return (
    <div className="flex p-3 bg-white border border-gray-100 rounded-md shadow-smooth">
      123
    </div>
  )
}

const ContentTypePage = ({typeData, type}: any) => {
  console.log('typeData:', typeData)

  return (
    <>
      {!isEmpty(typeData?.featuredCollections?.resources) && (
        <div className="p-3 mt-3">
          <h2 className="w-full text-lg font-semibold leading-tight lg:text-2xl sm:text-xl dark:text-white">
            Featured Seasons
          </h2>
          <div className="mt-4 space-y-3">
            {typeData.featuredCollections.resources.map(
              (resource: FeaturedSeasonResource, i: number) => {
                return (
                  <div key={i}>
                    <FeaturedSeasonCard resource={resource} />
                  </div>
                )
              },
            )}
          </div>
        </div>
      )}
      {!isEmpty(typeData?.featuredResources?.resources) && (
        <div className="p-3 my-3">
          <h2 className="w-full text-lg font-semibold leading-tight lg:text-2xl sm:text-xl dark:text-white">
            Featured Episode
          </h2>
          <div className="mt-4 space-y-3">
            {typeData.featuredResources.resources.map(
              (resource: FeaturedEpisodeResource, i: number) => {
                return (
                  <div key={i}>
                    <FeaturedEpisodeCard resource={resource} />
                  </div>
                )
              },
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ContentTypePage

const PlayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 20 20"
    className="p-1.5 dark:group-hover:text-orange-300 group-hover:text-orange-500 text-gray-500 transition flex-shrink-0"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M4 3.323A1.25 1.25 0 015.939 2.28l10.32 6.813a1.25 1.25 0 010 2.086L5.94 17.992A1.25 1.25 0 014 16.949V3.323z"
    />
  </svg>
)
