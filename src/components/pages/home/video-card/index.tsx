import * as React from 'react'
import {track} from 'utils/analytics'
import PlayIcon from '../../courses/play-icon'
import Link from 'next/link'
import {Card} from 'components/card'
import Markdown from 'react-markdown'
import Image from 'next/image'
import {useEggheadPlayerPrefs} from 'components/EggheadPlayer/use-egghead-player'
import {useRouter} from 'next/router'

const VideoCard: React.FC<
  React.PropsWithChildren<{
    resource: any
    className?: string
    location?: any
  }>
> = ({resource, className, location}) => {
  const router = useRouter()
  const {setPlayerPrefs} = useEggheadPlayerPrefs()
  const {
    name,
    path,
    title,
    description,
    instructor_path,
    instructor,
    byline,
    image,
  } = resource

  const currentLocation = location ? location : router.pathname

  return (
    <Card className={className}>
      <div className="sm:grid grid-cols-2 flex flex-col-reverse">
        <div className="flex flex-col justify-center sm:pr-10 sm:pt-0 pt-5">
          <div>
            <h2 className="uppercase font-semibold text-xs text-gray-700 dark:text-gray-200">
              {name}
            </h2>
            <Link href={path}>
              <a
                onClick={() =>
                  track('clicked resource', {
                    resource: resource.slug,
                    linkType: 'text',
                    location: currentLocation,
                  })
                }
                className="hover:text-blue-600 dark:hover:text-blue-300"
              >
                <h3 className="text-2xl font-bold tracking-tight leading-tighter mt-2">
                  {title}
                </h3>
              </a>
            </Link>
            <div className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 transition-colors duration-150 ease-in-out mt-1">
              {byline}
              {instructor && instructor_path && (
                <Link href={instructor_path || ''}>
                  <a
                    onClick={() =>
                      track('clicked instructor', {
                        instructor: instructor,
                        linkType: 'text',
                        location: currentLocation,
                      })
                    }
                    className="hover:text-blue-600 dark:hover:text-blue-300"
                  >
                    {instructor}
                  </a>
                </Link>
              )}
            </div>
            <Markdown className="prose dark:prose-dark dark:prose-sm-dark dark:prose-a:text-blue-300 prose-a:text-blue-500 prose-sm mt-4">
              {description}
            </Markdown>
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center self-center">
          <Link href={path}>
            <a
              onClick={() => {
                setPlayerPrefs({autoplay: true})
                track('clicked resource', {
                  resource: resource.slug,
                  linkType: 'video',
                  location: currentLocation,
                })
              }}
              className="group sm:w-full flex items-center justify-center relative overflow-hidden rounded-md border dark:border-gray-700 border-gray-200"
            >
              <Image
                src={image}
                alt={title}
                width={1280 / 2.6}
                height={720 / 2.6}
              />
              <div className="group-hover:scale-105 shadow-xl backdrop-filter backdrop-blur-sm border-2 border-white absolute bg-gray-800 bg-opacity-70 z-10 rounded-full w-16 h-16 flex items-center justify-center leading-none transition-all ease-in-out duration-200">
                <PlayIcon className="w-4 h-4 text-white" />
                <span className="sr-only">Play</span>
              </div>
            </a>
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default VideoCard
