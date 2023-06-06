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
import {twMerge} from 'tailwind-merge'
import {
  Card,
  CardPreview,
  CardHeader,
  CardContent,
  CardBody,
  CardMeta,
} from 'components/card/index'
import Markdown from 'components/markdown'
import {get} from 'lodash'
import {PlayIcon} from '@heroicons/react/solid'
import {AcademicCapIcon} from '@heroicons/react/solid'

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

const ContinueCourseCard: React.FC<any> = ({
  resource,
  location,
  className = 'border-none',
  ...props
}) => {
  return (
    <Card
      {...props}
      className={twMerge(
        'bg-white dark:bg-gray-800 dark:bg-opacity-60 dark:text-gray-200 shadow-sm rounded-lg overflow-hidden p-5 flex flex-col sm:space-y-5 space-y-0 sm:space-x-0 space-x-5 items-center justify-center sm:text-left text-center',
        className,
      )}
    >
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
            <CardPreview>
              <Image
                src={get(resource.image, 'src', resource.image)}
                width={160}
                height={160}
                layout="fixed"
                className="transition ease-in-out hover:scale-110 duration-100 object-cover rounded-md"
                alt={`illustration for ${resource.title}`}
              />
            </CardPreview>
          </a>
        </Link>
      )}
      <CardContent className="flex flex-col justify-center items-center">
        <CardHeader className="mx-16">
          <Link href={resource.path}>
            <a
              onClick={() => {
                track('clicked resource', {
                  resource: resource.path,
                  linkType: 'text',
                  location,
                })
              }}
              className="inline-block hover:text-blue-600 dark:hover:text-blue-300 w-fit"
            >
              <h3 className="text-lg lg:text-xl font-bold leading-tighter dark:text-white dark:hover:text-blue-300 text-center">
                {resource.title}
              </h3>
            </a>
          </Link>
        </CardHeader>
        <CardMeta className="text-xs justify-center text-gray-600 dark:text-gray-300 pb-2 pt-1 text-center">
          {resource.byline}
        </CardMeta>
        <CardBody className="flex flex-col prose dark:prose-dark dark:prose-dark-sm dark:prose-a:text-blue-300 prose-a:text-blue-500 prose-sm max-w-none justify-center">
          <Markdown>{resource.description}</Markdown>
          <div className="grid grid-rows-2 items-center gap-y-2">
            {/* bg-blue-600 rounded px-4 py-2 flex sm:w-full w-48 items-center justify-center hover:bg-blue-500 transition-colors duration-200 ease-in-out text-xs md:text-base */}
            <button
              className="bg-blue-600 rounded py-2 flex sm:w-full items-center justify-center hover:bg-blue-500 transition-colors duration-200 ease-in-out text-xs md:text-base whitespace-nowrap"
              onClick={() => {
                analytics.events.engagementClickedWatchedLessonAgain(
                  lesson.slug,
                )
                onClickRewatch()
              }}
            >
              <AcademicCapIcon className="w-6 mr-2" />
              Watch Full Course
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  router.push(nextLesson.path || '#')
                  track('clicked play next', {
                    lesson: lesson.slug,
                    location: 'lesson overlay',
                  })
                }}
                className="border border-blue-600 rounded px-4 py-2 flex sm:w-full w-48 items-center justify-center hover:bg-gray-900 transition-colors duration-200 ease-in-out text-xs md:text-base whitespace-nowrap"
              >
                <PlayIcon className="w-6 mr-2" /> Play Next
              </button>
              <button
                onClick={() => {
                  router.push(nextLesson.path || '#')
                  track('clicked play next', {
                    lesson: lesson.slug,
                    location: 'lesson overlay',
                  })
                }}
                className="border border-blue-600 rounded px-4 py-2 flex sm:w-full w-48 items-center justify-center hover:bg-gray-900 transition-colors duration-200 ease-in-out text-xs md:text-base whitespace-nowrap"
              >
                <IconRefresh className="w-6 mr-2" /> Watch Again
              </button>
            </div>
          </div>
        </CardBody>
      </CardContent>
    </Card>
  )
}

const SearchCard = ({
  tagLabel,
  className,
}: {
  tagLabel: string
  className?: string
}) => {
  return (
    <Card
      className={twMerge(
        `bg-white dark:bg-gray-800 dark:bg-opacity-60 dark:text-gray-200 shadow-sm rounded-lg overflow-hidden p-5 flex sm:flex-row flex-col sm:space-x-5 space-x-0 sm:space-y-0 space-y-5 items-center sm:text-left text-center max-h-1/3`,
        className,
      )}
    >
      <CardContent className="grid grid-rows-2 w-full justify-center items-center">
        <CardHeader>
          <p className="tracking-tight text-gray-700 dark:text-white text-center">
            <h3 className="text-md font-medium leading-tighter">
              Search for more {tagLabel}:
            </h3>
          </p>
        </CardHeader>
        <CardBody className="prose dark:prose-dark dark:prose-dark-sm dark:prose-a:text-blue-300 prose-a:text-blue-500 prose-sm max-w-none">
          <SearchBar
            className="rounded-lg shadow-md transition duration-200 hover:shadow-lg focus-within:shadow-lg bg-gray-800 border-gray-700 focus-within:border-gray-500 hover:bg-gray-700"
            initialValue={tagLabel}
          />
        </CardBody>
      </CardContent>
    </Card>
  )
}

const SearchVideoControls: React.FunctionComponent<{
  router: any
  nextLesson: any
  lesson: any
  tag: any
  courseImage: any
  onClickRewatch: any
  className?: string
}> = ({
  router,
  nextLesson,
  lesson,
  tag,
  courseImage,
  onClickRewatch,
  className = '',
}) => {
  return (
    <div
      className={twMerge(
        'flex flex-col items-center justify-center p-4 space-y-6',
        className,
      )}
    >
      <div className="hidden sm:flex flex-col justify-center items-center space-y-4">
        <h3 className="text-lg xl:text-xl 2xl:text-2xl font-semibold text-center">
          Search for more {tag.label}
        </h3>
        <SearchBar
          className="rounded-lg shadow-md transition duration-200 hover:shadow-lg focus-within:shadow-lg bg-gray-800 border-gray-700 focus-within:border-gray-500 hover:bg-gray-700 w-full max-w-md"
          initialValue={tag.label}
        />
      </div>
      <div className="flex flex-col items-center sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        {/* bg-blue-600 rounded px-4 py-2 flex sm:w-full w-48 items-center justify-center hover:bg-blue-500 transition-colors duration-200 ease-in-out text-xs md:text-base */}
        <button
          className="border border-blue-600 rounded px-4 py-2 flex sm:w-full w-48 items-center justify-center hover:bg-gray-900 transition-colors duration-200 ease-in-out text-xs md:text-base whitespace-nowrap"
          onClick={() => {
            analytics.events.engagementClickedWatchedLessonAgain(lesson.slug)
            onClickRewatch()
          }}
        >
          <IconRefresh className="w-5 mr-2" /> Watch again
        </button>
        <button
          onClick={() => {
            router.push(nextLesson.path || '#')
            track('clicked play next', {
              lesson: lesson.slug,
              location: 'lesson overlay',
            })
          }}
          className="bg-blue-600 rounded px-4 py-2 flex sm:w-full w-48 items-center justify-center hover:bg-blue-500 transition-colors duration-200 ease-in-out text-xs md:text-base whitespace-nowrap"
        >
          <IconPlay className="w-5 mr-2" /> Play next
        </button>
      </div>
    </div>
  )
}

const OfferSearchCTAOverlay: React.FunctionComponent<{
  lesson: any
  nextLesson: any
  ctaContent?: any
  onClickRewatch?: () => void
}> = ({lesson, nextLesson, onClickRewatch = noop, ctaContent}) => {
  const courseImage = lesson?.collection?.square_cover_480_url
  const router = useRouter()
  const tag = lesson.tags[0]
  console.log(lesson)
  const hits = transformHits(
    trpc.topics.top.useQuery({topic: tag.name})?.data,
    2,
  )

  console.log(hits)

  return (
    <OverlayWrapper className="absolute top-0 z-10 h-full max-w-full bg-opacity-100 dark max-h-full">
      <div className="hidden 2xl:grid grid-cols-2 gap-4 m-8 h-full">
        <div className="flex flex-col">
          <ContinueCourseCard
            resource={
              {
                title: lesson?.collection?.title,
                slug: tag.name,
                image: courseImage,
                path: `/courses/${lesson?.collection?.slug}`,
                description: `Continue to learn ${tag.label} with this course by ${lesson?.instructor?.full_name}!`,
                byline: ``,
              } as any
            }
            className="row-span-2 mb-4 h-3/4"
          />
          <SearchCard tagLabel={tag.label as string} className="h-1/4" />
        </div>
        {hits.length > 0 ? (
          <div className="flex flex-col">
            <HorizontalResourceCard
              resource={
                {
                  title: `More Expert Curated ${tag.label} Courses`,
                  slug: tag.name,
                  image: tag.image_url,
                  path: `/q/${tag.name}?access_state=free&type=playlist`,
                  description: `A hand-curated collection of the best free ${tag.label} courses on egghead.io.`,
                  byline: ``,
                } as any
              }
              className="mb-4"
            />
            <div className="grid grid-cols-2 gap-x-4">
              <VerticalResourceCard resource={hits[0] as any} />
              <VerticalResourceCard resource={hits[1] as any} />
            </div>
          </div>
        ) : (
          <HorizontalResourceCard
            resource={
              {
                title: `More Expert Curated ${tag.label} Courses`,
                slug: tag.name,
                image: tag.image_url,
                path: `/q/${tag.name}?access_state=free&type=playlist`,
                description: `A hand-curated collection of the best free ${tag.label} courses on egghead.io.`,
                byline: ``,
              } as any
            }
            className="p-8 min-w-0 3xl:w-[40rem] lg:w-[30rem] xl:ml-16 3xl:p-4"
          />
        )}
      </div>
      <div className="grid sm:grid-cols-2 2xl:hidden w-full mx-8 justify-center">
        <SearchVideoControls
          router={router}
          nextLesson={nextLesson}
          courseImage={courseImage}
          lesson={lesson}
          onClickRewatch={onClickRewatch}
          className="p-16"
          tag={tag}
        />
        <VerticalResourceCard
          resource={
            {
              title: `More Expert Curated ${tag.label} Courses`,
              slug: tag.name,
              image: tag.image_url,
              path: `/q/${tag.name}?access_state=free&type=playlist`,
              description: `A hand-curated collection of the best free ${tag.label} courses on egghead.io.`,
              byline: ``,
            } as any
          }
          className="hidden sm:block p-16"
        />
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
