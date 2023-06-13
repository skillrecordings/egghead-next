import Link from 'next/link'
import Image from 'next/image'
import * as React from 'react'
import {track} from 'utils/analytics'
import noop from 'utils/noop'
import {useRouter} from 'next/router'
import OverlayWrapper from 'components/pages/lessons/overlay/wrapper'
import analytics from 'utils/analytics'
import SearchBar from 'components/app/header/search-bar'
import {HorizontalResourceCard} from 'components/card/overlay/overlay-horiztonal-resource-card'
import {VerticalResourceCard} from 'components/card/overlay/overlay-vertical-resource-card'
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

const FEATURE = 'anon-user-overlay'

const transformHits = (hits: any, amount: integer) => {
  if (!hits) return []
  const slicedHits = hits.slice(0, amount)
  return slicedHits.map((hit: any) => shapeHit(hit as any))
}

const ContinueCourseCard: React.FC<any> = ({
  resource,
  location,
  className = 'border-none',
  onClickRewatch,
  router,
  lesson,
  nextLesson,
  ...props
}) => {
  return (
    <Card
      {...props}
      className={twMerge(
        'bg-gray-800 bg-opacity-60 text-gray-200 shadow-sm rounded-lg flex flex-col items-center justify-center sm:text-left text-center',
        className,
      )}
    >
      <CardContent className="flex flex-col justify-center items-center">
        <div className="hidden md:flex md:flex-col justify-center items-center shrink">
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
                    width={180}
                    height={180}
                    layout="fixed"
                    className="transition ease-in-out hover:scale-110 duration-100 object-cover rounded-md"
                    alt={`illustration for ${resource.title}`}
                  />
                </CardPreview>
              </a>
            </Link>
          )}
          <CardHeader className="mx-16">
            <Link href={resource.path}>
              <a
                onClick={() => {
                  track('clicked resource', {
                    resource: resource.path,
                    linkType: 'text',
                    location,
                    feature: FEATURE,
                  })
                }}
                className="inline-block hover:text-blue-600 dark:hover:text-blue-300 w-fit"
              >
                <h3 className="text-lg 3xl:text-xl font-bold leading-tighter dark:text-white dark:hover:text-blue-300 text-center">
                  {resource.title}
                </h3>
              </a>
            </Link>
          </CardHeader>
          <CardMeta className="text-xs justify-center text-gray-600 dark:text-gray-300 pb-2 pt-1 text-center">
            {resource.byline}
          </CardMeta>
        </div>
        <div className="flex flex-col items-center gap-y-2 3xl:mt-4">
          {lesson?.collection?.path && (
            <Link href={lesson.collection.path}>
              <a
                onClick={() => {
                  track('clicked view course', {
                    lesson: lesson.slug,
                    location: 'lesson overlay',
                    feature: FEATURE,
                  })
                }}
                className="w-full"
              >
                <button className="bg-blue-600 rounded py-2 flex w-full items-center justify-center hover:bg-blue-500 transition-colors duration-200 ease-in-out text-xs md:text-base whitespace-nowrap">
                  <AcademicCapIcon className="w-6 mr-2" />
                  Watch Full Course
                </button>
              </a>
            </Link>
          )}
          <div className="flex flex-row space-x-2">
            <button
              onClick={() => {
                analytics.events.engagementClickedPlayNextLesson(
                  lesson.slug,
                  FEATURE,
                )
                router.push(nextLesson.path || '#')
              }}
              className="border border-blue-600 rounded px-4 py-2 flex w-full sm:w-1/2 items-center justify-center hover:bg-gray-900 transition-colors duration-200 ease-in-out text-xs md:text-base whitespace-nowrap"
            >
              <PlayIcon className="w-6 mr-2" /> Play Next
            </button>
            <button
              onClick={() => {
                analytics.events.engagementClickedWatchedLessonAgain(
                  lesson.slug,
                  FEATURE,
                )
                onClickRewatch()
              }}
              className="border border-blue-600 rounded px-4 py-2 flex sm:w-1/2 w-full items-center justify-center hover:bg-gray-900 transition-colors duration-200 ease-in-out text-xs md:text-base whitespace-nowrap"
            >
              <IconRefresh className="w-6 mr-2" /> Watch Again
            </button>
          </div>
        </div>
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
        `bg-gray-800 bg-opacity-60 text-gray-200 rounded-lg p-8`,
        className,
      )}
    >
      <CardContent className="flex flex-col w-full h-full justify-center items-center">
        <CardHeader className="mb-4">
          <p className="tracking-tight dark:text-white text-center">
            <h3 className="text-lg font-medium leading-tighter">
              Search for more {tagLabel}:
            </h3>
          </p>
        </CardHeader>
        <CardBody className="prose prose-dark prose-dark-sm prose-a:text-blue-300  max-w-none">
          <SearchBar
            className="rounded-lg shadow-md transition duration-200 hover:shadow-lg focus-within:shadow-lg bg-gray-800 border-gray-700 focus-within:border-gray-500 hover:bg-gray-700"
            initialValue={tagLabel}
            feature={FEATURE}
          />
        </CardBody>
      </CardContent>
    </Card>
  )
}

const AnonUserOverlay: React.FunctionComponent<{
  lesson: any
  nextLesson: any
  onClickRewatch?: () => void
}> = ({lesson, nextLesson, onClickRewatch = noop}) => {
  const courseImage = lesson?.collection?.square_cover_480_url
  const router = useRouter()
  const tag = lesson.tags[0]
  console.log(lesson)
  const hits = transformHits(
    trpc.topics.top.useQuery({topic: tag.name})?.data,
    2,
  )

  return (
    <OverlayWrapper className="absolute overflow-y-scroll top-0 z-10 h-full max-w-full bg-opacity-100 darks">
      <div className="flex flex-row w-3/4 h-full items-stretch">
        <div className="flex flex-col 2xl:w-1/2 w-full">
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
            router={router}
            onClickRewatch={onClickRewatch}
            lesson={lesson}
            nextLesson={nextLesson}
            className="row-span-2 2xl:mb-4 grow"
          />
          <SearchCard
            tagLabel={tag.label as string}
            className="hidden 2xl:block"
          />
        </div>
        {hits.length > 0 ? (
          <div className="hidden 2xl:flex 2xl:flex-col w-1/2 ml-4 h-full grow">
            <div className="mb-4 grow h-full">
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
                feature={FEATURE}
              />
            </div>
            <div className="flex flex-row w-full grow h-full items-stretch">
              <div className="w-1/2 grow">
                <VerticalResourceCard
                  feature={FEATURE}
                  resource={hits[0] as any}
                />
              </div>
              <div className="w-1/2 ml-4 grow">
                <VerticalResourceCard
                  feature={FEATURE}
                  resource={hits[1] as any}
                />
              </div>
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
            feature={FEATURE}
            className="p-8 min-w-0 3xl:w-[40rem] lg:w-[30rem] xl:ml-16 3xl:p-4"
          />
        )}
      </div>
    </OverlayWrapper>
  )
}

export default AnonUserOverlay

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
