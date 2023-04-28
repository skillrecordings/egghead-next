import Link from 'next/link'
import Image from 'next/image'
import * as React from 'react'
import {track} from 'utils/analytics'
import noop from 'utils/noop'
import {useRouter} from 'next/router'
import OverlayWrapper from 'components/pages/lessons/overlay/wrapper'
import analytics from 'utils/analytics'
import SearchBar from 'components/app/header/search-bar'
import {HorizontalResourceCard} from 'components/card/new-horizontal-resource-card'
import {VerticalResourceCard} from 'components/card/new-vertical-resource-card'

const OfferSearchCTAOverlay: React.FunctionComponent<{
  lesson: any
  nextLesson: any
  ctaContent?: any
  onClickRewatch?: () => void
}> = ({lesson, nextLesson, onClickRewatch = noop, ctaContent}) => {
  const [collapsed, setCollapsed] = React.useState<boolean>(false)
  const courseImage = lesson?.collection?.square_cover_480_url

  const router = useRouter()

  return collapsed ? (
    <div className="absolute top-3 right-3">
      <div>
        <button
          className="rounded bg-black/50 text-white p-2"
          onClick={() => setCollapsed(false)}
        >
          Next Lesson
        </button>
      </div>
    </div>
  ) : (
    <OverlayWrapper className="absolute top-0 z-10">
      <div className="flex flex-col items-center justify-center p-4 lg:w-full lg:h-full">
        <button
          className="rounded bg-black/50 absolute text-white p-2 top-3 right-3"
          onClick={() => setCollapsed(true)}
        >
          Back to the video
        </button>
        <div className="grid grid-cols-2 h-1/4 lg:h-auto lg:w-1/2">
          <div className="flex flex-col items-center justify-center p-4">
            {courseImage && (
              <div className="w-16 h-16 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 relative flex-shrink-0">
                <Image
                  src={
                    'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1659039554/eggodex/search-eggo.svg'
                  }
                  alt={`illustration of ${lesson.collection.title} course`}
                  layout="fill"
                />
              </div>
            )}
            <h3 className="text-md md:text-lg font-semibold mt-4 text-center">
              Search for more JavaScript:
            </h3>
            <SearchBar initialValue="JavaScript" />
            <div className="flex mt-6 md:mt-8">
              <button
                className="border border-blue-600 rounded px-3 py-2 flex items-center hover:bg-gray-900 transition-colors duration-200 ease-in-out"
                onClick={() => {
                  analytics.events.engagementClickedWatchedLessonAgain(
                    lesson.slug,
                  )
                  onClickRewatch()
                }}
              >
                <IconRefresh className="w-6 mr-2" /> Watch again
              </button>
              <button
                onClick={() => {
                  router.push(nextLesson.path || '#')
                  track('clicked play next', {
                    lesson: lesson.slug,
                    location: 'lesson overlay',
                  })
                }}
                className="bg-blue-600 rounded px-3 py-2 flex items-center ml-4 hover:bg-blue-500 transition-colors duration-200 ease-in-out"
              >
                <IconPlay className="w-6 mr-2" /> Play next
              </button>
            </div>
          </div>
          <VerticalResourceCard
            className="lg:hidden"
            resource={{
              name: '',
              byline: `kent c. dodds`,
              slug: `the-beginner-s-guide-to-react`,
              title: `the beginner's guide to react`,
              instructor: {
                name: 'Kent C. Dodds',
                image: `https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/011/medium/photo-512.png`,
              },
              path: `/courses/the-beginner-s-guide-to-react`,
              image: `https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/490/full/EGH_BeginnersReact2.png`,
              description: ``,
            }}
          />
          <div className="lg:grid grid-rows-2 p-4 hidden lg:visible">
            <div className="w-full h-full relative">
              <Image
                src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1641463980/egghead-next-pages/Javascript/og-image--javascript_2x.png"
                layout="fill"
              />
            </div>
            <div className="grid grid-cols-2 pt-4">
              <VerticalResourceCard
                className="px-2"
                resource={{
                  name: '',
                  byline: `kent c. dodds`,
                  slug: `the-beginner-s-guide-to-react`,
                  title: `the beginner's guide to react`,
                  instructor: {
                    name: 'Kent C. Dodds',
                    image: `https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/011/medium/photo-512.png`,
                  },
                  path: `/courses/the-beginner-s-guide-to-react`,
                  image: `https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/490/full/EGH_BeginnersReact2.png`,
                  description: ``,
                }}
              />
              <VerticalResourceCard
                className="px-2"
                resource={{
                  name: '',
                  byline: `kent c. dodds`,
                  slug: `the-beginner-s-guide-to-react`,
                  title: `the beginner's guide to react`,
                  instructor: {
                    name: 'Kent C. Dodds',
                    image: `https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/011/medium/photo-512.png`,
                  },
                  path: `/courses/the-beginner-s-guide-to-react`,
                  image: `https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/490/full/EGH_BeginnersReact2.png`,
                  description: ``,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </OverlayWrapper>
  )
}

export default OfferSearchCTAOverlay

const IconPlay: React.FunctionComponent<{className: string}> = ({
  className = '',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
      clipRule="evenodd"
    />
  </svg>
)

const IconRefresh: React.FunctionComponent<{className: string}> = ({
  className = '',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
)
