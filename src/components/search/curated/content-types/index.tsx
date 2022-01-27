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
  const {image, title, summary, description, resources, byline} = resource
  return (
    <div className="flex flex-col h-full overflow-hidden bg-white border border-gray-100 rounded-md lg:flex-row shadow-smooth">
      <div className="flex flex-col p-3 space-x-3 md:flex-row flex-nowrap grow">
        <div className="shrink-0">
          <Image src={image} alt={title} width={100} height={100} />
        </div>
        <div className="space-y-2 text-sm">
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="italic opacity-70">{summary}</p>
          <p>{description}</p>
        </div>
      </div>
      <div className="relative w-full lg:w-96 shrink-0">
        <div className="inset-0 lg:absolute">
          <ul className="w-full h-full overflow-y-scroll text-sm border-t border-gray-300 divide-y lg:border-t-0 lg:border-l overscroll-contain max-h-56 lg:max-h-full lg:min-h-[14rem]">
            {resources.map(
              (episode: FeaturedSeasonEpisodeResource, i: number) => {
                return (
                  <li key={i}>
                    <Link href={episode.path}>
                      <a className="flex items-center px-3 py-2 space-x-2 duration-100 hover:bg-gray-100">
                        <span className="shrink-0">{i + 1}.</span>
                        <div className="flex overflow-hidden rounded-full shrink-0">
                          <Image
                            src={episode.instructor.image}
                            width={40}
                            height={40}
                            alt={episode.instructor.name}
                          />
                        </div>
                        <div className="space-y-1 text-xs">
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
