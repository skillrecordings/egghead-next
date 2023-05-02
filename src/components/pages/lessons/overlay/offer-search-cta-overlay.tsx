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
import {trpc} from 'trpc/trpc.client'
import {integer} from 'aws-sdk/clients/cloudfront'

const shapeHit = (hit: any) => {
  const {title, instructor_name, instructor_avatar_url, slug, image} = hit
  return {
    title,
    instructor: {
      name: instructor_name,
      image: instructor_avatar_url,
    },
    slug,
    image,
    path: `/courses/${slug}`,
    description: '',
    byline: '',
  }
}

const transformHits = (hits: any, amount: integer) => {
  if (!hits) return []
  const slicedHits = hits.slice(0, amount)
  return slicedHits.map((hit: any) => shapeHit(hit as any))
}

const OfferSearchCTAOverlay: React.FunctionComponent<{
  lesson: any
  nextLesson: any
  ctaContent?: any
  onClickRewatch?: () => void
}> = ({lesson, nextLesson, onClickRewatch = noop, ctaContent}) => {
  const [collapsed, setCollapsed] = React.useState<boolean>(false)
  const courseImage = lesson?.collection?.square_cover_480_url
  const router = useRouter()

  // const hits = transformHits(
  //   trpc.topics.top.useQuery({topic: 'javascript'})?.data,
  //   2,
  // )

  const hits = [
    {
      title: 'Scale React Development with Nx',
      instructor: {
        name: 'Juri Strumpflohner',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/137/original/eggheadshirt.jpg',
      },
      slug: 'scale-react-development-with-nx-4038',
      image:
        'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/405/344/thumb/EGH_ScalingReactNx.png',
      path: `/courses/scale-react-development-with-nx-4038`,
      description: '',
      byline: '',
    },
    {
      title: 'Scale React Development with Nx',
      instructor: {
        name: 'Juri Strumpflohner',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/137/original/eggheadshirt.jpg',
      },
      slug: 'scale-react-development-with-nx-4038',
      image:
        'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/405/344/thumb/EGH_ScalingReactNx.png',
      path: `/courses/scale-react-development-with-nx-4038`,
      description: '',
      byline: '',
    },
  ]

  console.log('HITS', hits)

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
    <OverlayWrapper className="absolute top-0 z-10 h-full max-w-full">
      <div className="flex flex-row w-full mx-auto justify-center">
        <div className="flex flex-col items-center justify-center p-4">
          <div className="hidden sm:flex flex-col justify-center items-center">
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
          </div>
          <div className="flex flex-col items-center sm:flex-row mt-6 md:mt-8">
            <button
              className="border border-blue-600 rounded px-3 py-2 flex w-48 sm:w-auto items-center justify-center hover:bg-gray-900 transition-colors duration-200 ease-in-out"
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
              className="bg-blue-600 rounded px-3 py-2 flex items-center w-48 justify-center sm:w-auto mt-4 sm:mt-0 sm:ml-4 hover:bg-blue-500 transition-colors duration-200 ease-in-out"
            >
              <IconPlay className="w-6 mr-2" /> Play next
            </button>
          </div>
        </div>
        <div className="hidden md:visible xl:hidden w-[16rem] pl-8">
          <VerticalResourceCard
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
        <div className="xl:grid grid-rows-2 p-4 min-w-0 3xl:w-[40rem] lg:w-[30rem] hidden md:visible">
          <HorizontalResourceCard resource={hits[0] as any} />
          <div className="grid grid-cols-2 pt-4">
            <VerticalResourceCard className="px-2" resource={hits[0] as any} />
            <VerticalResourceCard className="px-2" resource={hits[1] as any} />
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
