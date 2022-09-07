import Link from 'next/link'
import Image from 'next/image'
import * as React from 'react'
import {track} from 'utils/analytics'
import noop from 'utils/noop'
import {useTrackComponent} from 'hooks/use-track-component'
import {useRouter} from 'next/router'
import OverlayWrapper from 'components/pages/lessons/overlay/wrapper'

const WatchNextLessonCtaOverlay: React.FunctionComponent<{
  lesson: any
  nextLesson: any
  ctaContent?: any
  onClickRewatch?: () => void
}> = ({lesson, nextLesson, onClickRewatch = noop, ctaContent}) => {
  const [collapsed, setCollapsed] = React.useState<boolean>(false)
  const courseImage = lesson?.collection?.square_cover_480_url

  useTrackComponent('show next up', {
    course: lesson?.collection?.slug,
    lesson: lesson.slug,
  })

  const router = useRouter()

  return collapsed ? (
    <div className="absolute top-6 right-6">
      <div>
        <button
          className="bg-red-500 text-white p-2"
          onClick={() => setCollapsed(false)}
        >
          Expand
        </button>
      </div>
    </div>
  ) : (
    <OverlayWrapper>
      <div className="flex flex-col items-center justify-center p-4">
        <button
          className="absolute bg-red-500 text-white p-2 top-6 right-6"
          onClick={() => setCollapsed(true)}
        >
          Collapse
        </button>
        {courseImage && (
          <div className="w-16 h-16 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 relative flex-shrink-0">
            <Image
              src={courseImage}
              alt={`illustration of ${lesson.collection.title} course`}
              layout="fill"
            />
          </div>
        )}
        <div className="mt-4 md:mt-4">Up Next</div>
        <h3 className="text-md md:text-lg font-semibold mt-4 text-center">
          {nextLesson.title}
        </h3>
        <div className="flex mt-6 md:mt-8">
          <button
            className="border border-blue-600 rounded px-3 py-2 flex items-center hover:bg-gray-900 transition-colors duration-200 ease-in-out"
            onClick={() => {
              track('clicked rewatch video', {
                lesson: lesson.slug,
                location: 'lesson overlay',
              })
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
        {ctaContent && (
          <div className="flex flex-col mt-6 md:mt-8 space-y-3">
            <h3 className="text-md md:text-lg font-semibold mt-4 text-center">
              {ctaContent.headline}
            </h3>
            {ctaContent.linksTo.map((content: any) => {
              return (
                <Link
                  href={
                    content.slug ? `/${content.type}s/${content.slug}` : '#'
                  }
                >
                  <a
                    onClick={() => {
                      track('clicked cta content', {
                        from: lesson.slug,
                        [content.type]: content.slug,
                        location: 'lesson overlay',
                      })
                    }}
                    className="px-3 py-2 flex items-center ml-4 transition-colors duration-200 ease-in-out space-x-2 hover:underline"
                  >
                    <div className="w-12 h-12 relative flex-shrink-0 ">
                      <Image
                        src={content.imageUrl}
                        alt={`illustration of ${content.title} course`}
                        width="64"
                        height="64"
                        layout="fill"
                      />
                    </div>
                    <div className="font-bold relative">{content.title}</div>
                  </a>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </OverlayWrapper>
  )
}

export default WatchNextLessonCtaOverlay

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
