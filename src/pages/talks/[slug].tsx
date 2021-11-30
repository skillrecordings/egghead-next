import React, {FunctionComponent} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {useMachine} from '@xstate/react'
import EggheadPlayer from 'components/EggheadPlayer'
import get from 'lodash/get'
import Markdown from 'react-markdown'
import Image from 'next/image'
import {loadLesson} from 'lib/lessons'
import {useViewer} from 'context/viewer-context'
import {GetServerSideProps} from 'next'
import {playerMachine} from 'machines/lesson-player-machine'
import {useWindowSize} from 'react-use'
import Transcript from 'components/pages/lessons/transcript'
import {NextSeo} from 'next-seo'
import Head from 'next/head'
import removeMarkdown from 'remove-markdown'
import {useEnhancedTranscript} from 'hooks/use-enhanced-transcript'
import cookieUtil from 'utils/cookies'

type LessonProps = {
  initialLesson: any
}

const OFFSET_Y = 80
const VIDEO_MIN_HEIGHT = 480

const Talk: FunctionComponent<LessonProps> = ({initialLesson}) => {
  const router = useRouter()
  const playerRef = React.useRef(null)
  const [watchCount, setWatchCount] = React.useState<number>(0)
  const {viewer, authToken} = useViewer()
  const [playerState, send] = useMachine(playerMachine, {
    context: {
      lesson: initialLesson,
      viewer,
    },
    services: {
      loadLesson: async () => {
        if (cookieUtil.get(`egghead-watch-count`)) {
          setWatchCount(Number(cookieUtil.get(`egghead-watch-count`)))
        } else {
          setWatchCount(
            Number(
              cookieUtil.set(`egghead-watch-count`, 0, {
                expires: 15,
              }),
            ),
          )
        }

        console.debug('loading video with auth')
        const loadedLesson = await loadLesson(initialLesson.slug)
        console.debug('authed video loaded', {video: loadedLesson})

        return loadedLesson
      },
    },
  })
  const {height} = useWindowSize()
  const [lessonMaxWidth, setLessonMaxWidth] = React.useState(0)

  React.useEffect(() => {
    setLessonMaxWidth(Math.round((height - OFFSET_Y) * 1.6))
  }, [height])

  const lesson: any = get(playerState, 'context.lesson', initialLesson)
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

  const enhancedTranscript = useEnhancedTranscript(transcript_url)
  const transcriptAvailable = transcript || enhancedTranscript

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  if (!lesson) return null

  const playerVisible: boolean = ['playing', 'paused', 'viewing'].some(
    playerState.matches,
  )

  return (
    <>
      <NextSeo
        description={removeMarkdown(description)}
        canonical={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${path}`}
        title={title}
        titleTemplate={'%s | conference talk | egghead.io'}
        twitter={{
          handle: instructor?.twitter,
          site: `@eggheadio`,
          cardType: 'summary_large_image',
        }}
        openGraph={{
          title,
          url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${path}`,
          description: removeMarkdown(description),
          site_name: 'egghead',
          images: [
            {
              url: `https://og-image-react-egghead.now.sh/talk/${slug}?v=20201027`,
            },
          ],
        }}
      />
      <Head>
        <script src="//cdn.bitmovin.com/player/web/8/bitmovinplayer.js" />
      </Head>
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
            <div className="pt-[56.25%] w-full relative overflow-hidden bg-black text-white">
              <div className="absolute top-0 left-0 w-full h-full">
                <EggheadPlayer
                  ref={playerRef}
                  hls_url={hls_url}
                  dash_url={dash_url}
                  width="100%"
                  height="auto"
                  pip="true"
                  poster={`https://og-image-react-egghead.now.sh/talk/${get(
                    lesson,
                    'slug',
                  )}?v=20201027`}
                  controls
                  subtitlesUrl={get(lesson, 'subtitles_url')}
                />
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
                  <Link href={`/q/resources-by-${get(instructor, 'slug')}`}>
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
              <Markdown className="prose text-gray-900 dark:prose-dark lg:dark:prose-lg-dark lg:prose-lg max-w-none">
                {get(lesson, 'description')}
              </Markdown>
              {transcriptAvailable && (
                <div className="mt-8 sm:mt-16">
                  <h3 className="mb-4 text-lg font-bold leading-tight tracking-tight">
                    Transcript
                  </h3>
                  <Transcript
                    className="prose text-gray-800 dark:prose-dark max-w-none"
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
