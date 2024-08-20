import React, {FunctionComponent} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {useMachine} from '@xstate/react'
import get from 'lodash/get'
import Markdown from 'react-markdown'
import Image from 'next/legacy/image'
import {loadLesson} from '@/lib/lessons'
import {useViewer} from '@/context/viewer-context'
import {GetServerSideProps} from 'next'
import {lessonMachine} from '@/machines/lesson-machine'
import {useWindowSize} from 'react-use'
import Transcript from '@/components/pages/lessons/transcript'
import {NextSeo, SocialProfileJsonLd, VideoJsonLd} from 'next-seo'
import removeMarkdown from 'remove-markdown'
import {useEnhancedTranscript} from '@/hooks/use-enhanced-transcript'
import {GenericErrorBoundary} from '@/components/generic-error-boundary'
import {VideoProvider} from '@skillrecordings/player'
import {
  VideoEvent,
  VideoStateContext,
} from '@skillrecordings/player/dist/machines/video-machine'
import {compact, truncate} from 'lodash'
import TalkPLayer from './_components/talk-player'

function toISO8601Duration(duration: number) {
  const seconds = Math.floor(duration % 60)
  const minutes = Math.floor((duration / 60) % 60)
  const hours = Math.floor((duration / (60 * 60)) % 24)
  const days = Math.floor(duration / (60 * 60 * 24))

  return `P${days}DT${hours}H${minutes}M${seconds}S`
}

type LessonProps = {
  initialLesson: any
}

const OFFSET_Y = 80
const VIDEO_MIN_HEIGHT = 480

const Talk: FunctionComponent<React.PropsWithChildren<LessonProps>> = ({
  initialLesson,
}) => {
  const router = useRouter()
  const {viewer} = useViewer()
  const [lessonState, send] = useMachine(lessonMachine, {
    context: {
      lesson: initialLesson,
      viewer,
    },
    services: {
      loadLesson: async () => {
        console.debug('loading video with auth')
        const loadedLesson = await loadLesson(initialLesson.slug)
        console.debug('authed video loaded', {video: loadedLesson})

        return {
          ...initialLesson,
          ...loadedLesson,
        }
      },
    },
  })
  const {height} = useWindowSize()
  const [lessonMaxWidth, setLessonMaxWidth] = React.useState(0)
  const [watchCount, setWatchCount] = React.useState<number>(0)

  React.useEffect(() => {
    setLessonMaxWidth(Math.round((height - OFFSET_Y) * 1.6))
  }, [height])

  const lesson: any = get(lessonState, 'context.lesson', initialLesson)

  const {
    instructor,
    transcript,
    transcript_url,
    hls_url,
    dash_url,
    title,
    description,
    path,
    slug,
  } = lesson

  const instructorPagePath = `/q/resources-by-${get(
    instructor?.slug,
    'slug',
    '#',
  )}`
  const enhancedTranscript = useEnhancedTranscript(transcript_url)
  const transcriptAvailable = transcript || enhancedTranscript

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  if (!lesson) return null

  return (
    <>
      <NextSeo
        description={truncate(removeMarkdown(description?.replace(/"/g, "'")), {
          length: 150,
        })}
        canonical={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${path}`}
        title={truncate(removeMarkdown(title?.replace(/"/g, "'")), {
          length: 42,
        })}
        titleTemplate={'%s | conference talk | egghead.io'}
        twitter={{
          handle: instructor?.twitter,
          site: `@eggheadio`,
          cardType: 'summary_large_image',
        }}
        openGraph={{
          title,
          url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${path}`,
          description: truncate(
            removeMarkdown(description?.replace(/"/g, "'")),
            {
              length: 150,
            },
          ),
          site_name: 'egghead',
          images: [
            {
              url: `https://og-image-react-egghead.now.sh/talk/${slug}?v=20201027`,
            },
          ],
        }}
      />
      <VideoJsonLd
        name={title?.replace(/"/g, "'")}
        description={truncate(removeMarkdown(description?.replace(/"/g, "'")), {
          length: 150,
        })}
        contentUrl={lesson?.hls_url}
        duration={toISO8601Duration(Number(lesson?.duration ?? 0))}
        uploadDate={lesson?.created_at}
        thumbnailUrls={compact([lesson?.thumb_url])}
      />
      <SocialProfileJsonLd
        type="Person"
        name={instructor?.full_name}
        url={`https://egghead.io${instructorPagePath}`}
        sameAs={[`https://twitter.com/${instructor.twitter}`]}
      />
      <div>
        <div className="bg-black">
          <style jsx>
            {`
              @media (min-width: 960px) {
                .player-container {
                  max-width: ${height > VIDEO_MIN_HEIGHT + OFFSET_Y
                    ? lessonMaxWidth
                    : VIDEO_MIN_HEIGHT * 1.6}px;
                }
              }
              @media (min-width: 960px) and (max-height: 560px) {
                .player-container {
                  min-height: 432px;
                }
              }
            `}
          </style>
          <div className="w-full m-auto player-container">
            <div className="pt-[56.25%] w-full relative overflow-hidden bg-black text-white pb-12">
              <div className="absolute top-0 left-0 w-full h-full">
                <VideoProvider
                  services={{
                    loadViewer:
                      (_context: VideoStateContext, _event: VideoEvent) =>
                      async () => {
                        return await viewer
                      },
                    loadResource:
                      (_context: VideoStateContext, event: VideoEvent) =>
                      async () => {
                        const loadedLesson = get(event, 'resource') as any
                        return {
                          ...initialLesson,
                          ...loadedLesson,
                        }
                      },
                  }}
                >
                  <GenericErrorBoundary>
                    <TalkPLayer
                      state={[lessonState, send]}
                      initialLesson={initialLesson}
                      watchCount={watchCount}
                      setWatchCount={setWatchCount}
                    />
                  </GenericErrorBoundary>
                </VideoProvider>
              </div>
            </div>
          </div>
        </div>
        <main className="container">
          <div className="max-w-screen-lg py-8 mx-auto">
            <article>
              <header className="mb-6">
                <h1 className="text-2xl font-bold leading-tight tracking-tight">
                  {get(lesson, 'title')}
                </h1>
                <div className="flex items-center mt-2">
                  <Link
                    href={`/q/resources-by-${get(instructor, 'slug')}`}
                    legacyBehavior
                  >
                    <a className="flex items-center text-base text-gray-800 transition-colors duration-300 ease-in-out dark:text-gray-400 hover:text-blue-600">
                      {instructor.avatar_url && (
                        <Image
                          src={get(instructor, 'avatar_url')}
                          width={32}
                          height={32}
                          alt={get(instructor, 'full_name')}
                          className="rounded-full"
                        />
                      )}
                      <span className="ml-1">
                        {get(instructor, 'full_name')}
                      </span>
                    </a>
                  </Link>
                </div>
              </header>
              <Markdown className="prose text-gray-900 dark:prose-dark dark:prose-a:text-blue-300 prose-a:text-blue-500 lg:dark:prose-lg-dark lg:prose-lg max-w-none">
                {get(lesson, 'description')}
              </Markdown>
              {transcriptAvailable && (
                <div className="mt-8 sm:mt-16">
                  <h2 className="mb-4 text-lg font-bold leading-tight tracking-tight">
                    Transcript
                  </h2>
                  <Transcript
                    className="prose text-gray-800 dark:prose-dark dark:prose-a:text-blue-300 prose-a:text-blue-500 max-w-none"
                    initialTranscript={transcript}
                    enhancedTranscript={enhancedTranscript}
                  />
                </div>
              )}
            </article>
          </div>
        </main>
      </div>
    </>
  )
}

export default Talk

export const getServerSideProps: GetServerSideProps = async function ({
  res,
  req,
  params,
}) {
  const initialLesson = params && (await loadLesson(params.slug as string))

  return {
    props: {
      initialLesson,
    },
  }
}
