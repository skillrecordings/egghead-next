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
import {useEnhancedTranscript} from '@/hooks/use-enhanced-transcript'
import {GenericErrorBoundary} from '@/components/generic-error-boundary'
import {VideoProvider} from '@skillrecordings/player'
import {
  VideoEvent,
  VideoStateContext,
} from '@skillrecordings/player/dist/machines/video-machine'
import {LessonResource} from '@/types'
import TalkPlayer from '@/components/talks/talk-player'
import PageSEO from '@/components/talks/page-seo'

type LessonProps = {
  initialLesson: any
}

const OFFSET_Y = 80
const VIDEO_MIN_HEIGHT = 480

const Talk: FunctionComponent<React.PropsWithChildren<LessonProps>> = ({
  initialLesson,
  ...props
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

  if (!lesson || !initialLesson) return null

  return (
    <>
      <PageSEO lesson={lesson} />
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
                    <TalkPlayer
                      state={[lessonState, send]}
                      initialLesson={initialLesson}
                      watchCount={watchCount}
                      setWatchCount={setWatchCount}
                      {...props}
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
  try {
    const initialLesson: LessonResource | undefined =
      params && (await loadLesson(params.slug as string))

    if (initialLesson && initialLesson?.slug !== params?.slug) {
      return {
        redirect: {
          destination: initialLesson.path,
          permanent: true,
        },
      }
    } else {
      res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
      return {
        props: {
          initialLesson,
        },
      }
    }
  } catch (e) {
    console.error(e)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}
