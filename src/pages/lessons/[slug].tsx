import React, {FunctionComponent, useState} from 'react'
import {GetServerSideProps} from 'next'
import {useRouter} from 'next/router'
import {isEmpty, get, first} from 'lodash'
import {useMachine} from '@xstate/react'
import {motion} from 'framer-motion'
import {Tabs, TabList, Tab, TabPanels, TabPanel} from '@reach/tabs'
import {useWindowSize} from 'react-use'
import playerMachine from 'machines/lesson-player-machine'
import EggheadPlayer from 'components/EggheadPlayer'
import LessonInfo from 'components/pages/lessons/LessonInfo'
import Transcript from 'components/pages/lessons/Transcript'
import {loadLesson} from 'lib/lessons'
import {useViewer} from 'context/viewer-context'
import {LessonResource} from 'types'
import {NextSeo} from 'next-seo'
import removeMarkdown from 'remove-markdown'
import getTracer from 'utils/honeycomb-tracer'
import {isBrowser} from 'utils/is-browser'
import {setupHttpTracing} from '@vercel/tracing-js'
import CreateAccountCTA from 'components/pages/lessons/CreateAccountCTA'
import JoinCTA from 'components/pages/lessons/JoinCTA'
import Head from 'next/head'
import NextUpOverlay from 'components/pages/lessons/overlay/next-up-overlay'
import useSWR from 'swr'
import fetcher from 'utils/fetcher'

const tracer = getTracer('lesson-page')

const OverlayWrapper: FunctionComponent<{children: React.ReactNode}> = ({
  children,
}) => {
  return (
    <div className="flex flex-col justify-center items-center h-full px-3">
      {children}
    </div>
  )
}

const Loader = () => (
  <div className="grid place-items-center w-full h-full absolute z-10 top-0 left-0 bg-black">
    <svg
      className="text-indigo-300"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <motion.g
        animate={{rotateZ: [0, 360]}}
        transition={{repeat: Infinity}}
        fill="currentColor"
      >
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M12 3a9 9 0 0 1 9 9h-2a7 7 0 0 0-7-7V3z"></path>
      </motion.g>
    </svg>
  </div>
)

type LessonProps = {
  initialLesson: LessonResource
}

const OFFSET_Y = 80
const VIDEO_MIN_HEIGHT = 480

const Lesson: FunctionComponent<LessonProps> = ({initialLesson}) => {
  const {height} = useWindowSize()

  const clientHeight = isBrowser() ? height : 0
  const [lessonMaxWidth, setLessonMaxWidth] = useState(0)
  const router = useRouter()
  const playerRef = React.useRef(null)
  const {viewer} = useViewer()
  const [playerState, send] = useMachine(playerMachine)

  const currentPlayerState = playerState.value

  const lesson: any = {...initialLesson}

  const {data} = useSWR(lesson.media_url, fetcher)

  const {
    instructor,
    next_up_url,
    transcript,
    transcript_url,
    http_url,
    title,
    tags,
    summary,
    course,
    slug,
    free_forever,
  } = lesson

  const primary_tag = get(first(get(lesson, 'tags')), 'name', 'javascript')

  React.useEffect(() => {
    switch (currentPlayerState) {
      case 'loading':
        if (data) {
          const event: {type: 'LOADED'; lesson: any} = {
            type: 'LOADED',
            lesson: initialLesson,
          }
          send(event)
        }
        break
      case 'loaded':
        if (isEmpty(viewer) && free_forever) {
          send('JOIN')
        } else if (data.hls_url || data.dash_url) {
          send('VIEW')
        } else {
          send('SUBSCRIBE')
        }
        break
      case 'viewing':
        if (!data) {
          send('LOAD')
        }
        break
      case 'completed':
        send('NEXT')
        break
    }
  }, [currentPlayerState, data, free_forever, send, viewer, initialLesson])

  React.useEffect(() => {
    const handleRouteChange = () => {
      send('LOAD')
    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router.events, send])

  React.useEffect(() => {
    setLessonMaxWidth(Math.round((clientHeight - OFFSET_Y) * 1.6))
  }, [clientHeight])

  const loaderVisible = playerState.matches('loading')

  const playerVisible: boolean =
    ['playing', 'paused', 'loaded', 'viewing'].some(playerState.matches) &&
    !isEmpty(data)

  const transcriptAvailable = transcript || transcript_url

  return (
    <>
      <NextSeo
        description={removeMarkdown(summary)}
        canonical={http_url}
        title={title}
        titleTemplate={'%s | egghead.io'}
        twitter={{
          handle: instructor?.twitter,
          site: `@eggheadio`,
          cardType: 'summary_large_image',
        }}
        openGraph={{
          title,
          url: http_url,
          description: removeMarkdown(summary),
          site_name: 'egghead',
          images: [
            {
              url: `https://og-image-react-egghead.now.sh/lesson/${slug}?v=20201027`,
            },
          ],
        }}
      />
      <Head>
        <script
          async
          src="https://cdn.bitmovin.com/player/web/8/bitmovinplayer.js"
        />
      </Head>
      <div key={lesson.slug} className="space-y-8 w-full">
        <div className="-mt-3 sm:-mt-5 -mx-5 bg-black">
          <div
            className="w-full m-auto"
            css={{
              '@media (min-width: 960px)': {
                maxWidth:
                  height > VIDEO_MIN_HEIGHT + OFFSET_Y
                    ? lessonMaxWidth
                    : VIDEO_MIN_HEIGHT * 1.6,
              },
              '@media (min-width: 960px) and (max-height: 560px)': {
                minHeight: '432px',
              },
            }}
          >
            <div
              className="w-full relative overflow-hidden text-white bg-black"
              css={{
                paddingTop: '56.25%',
                '@media (max-width: 639px)': {
                  paddingTop: playerVisible || loaderVisible ? '56.25%' : '0',
                },
              }}
            >
              <div
                className={`${
                  playerVisible || loaderVisible
                    ? 'absolute'
                    : 'sm:absolute sm:py-0 py-5'
                } w-full h-full top-0 left-0`}
              >
                {loaderVisible && <Loader />}
                {playerVisible && (
                  <EggheadPlayer
                    ref={playerRef}
                    hls_url={data.hls_url}
                    dash_url={data.dash_url}
                    playing={playerState.matches('playing')}
                    width="100%"
                    height="auto"
                    pip="true"
                    controls
                    onPlay={() => send('PLAY')}
                    onPause={() => {
                      send('PAUSE')
                    }}
                    onEnded={() => send('COMPLETE')}
                    subtitlesUrl={get(lesson, 'subtitles_url')}
                  />
                )}

                {playerState.matches('joining') && (
                  <OverlayWrapper>
                    <CreateAccountCTA
                      lesson={get(lesson, 'slug')}
                      technology={primary_tag}
                    />
                  </OverlayWrapper>
                )}
                {playerState.matches('subscribing') && (
                  <OverlayWrapper>
                    <JoinCTA />
                  </OverlayWrapper>
                )}
                {playerState.matches('showingNext') && (
                  <OverlayWrapper>
                    <NextUpOverlay
                      lesson={lesson}
                      send={send}
                      url={next_up_url}
                    />
                  </OverlayWrapper>
                )}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="grid gap-8 md:grid-cols-12 grid-cols-1 max-w-screen-2xl xl:px-5 mx-auto divide-y md:divide-transparent divide-cool-gray-100">
            <div className="md:col-span-8 md:row-start-1 row-start-2">
              <Tabs>
                <TabList
                  css={{background: 'none'}}
                  className="text-lg font-semibold"
                >
                  {transcriptAvailable && <Tab>Transcript</Tab>}
                  <Tab>Comments</Tab>
                </TabList>
                <TabPanels className="mt-6">
                  {transcriptAvailable && (
                    <TabPanel>
                      <Transcript
                        className="prose sm:prose-lg max-w-none"
                        player={playerRef}
                        playerAvailable={playerVisible}
                        playVideo={() => send('PLAY')}
                        transcriptUrl={transcript_url}
                        initialTranscript={transcript}
                      />
                    </TabPanel>
                  )}
                  <TabPanel>
                    <p>Comments</p>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </div>
            <div className="md:col-span-4 flex flex-col space-y-8">
              <LessonInfo
                title={title}
                instructor={instructor}
                tags={tags}
                summary={summary}
                course={course}
                nextUpUrl={next_up_url}
                lesson={lesson}
                playerState={playerState}
                className="space-y-6 divide-y divide-cool-gray-100"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Lesson

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  res,
  params,
}) {
  setupHttpTracing({name: getServerSideProps.name, tracer, req, res})
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  res.setHeader(
    'Link',
    'https://cdn.bitmovin.com/player/web/8/bitmovinplayer.js; rel="preload"; as="script"',
  )

  const initialLesson: LessonResource | undefined =
    params && (await loadLesson(params.slug as string))

  return {
    props: {
      initialLesson,
    },
  }
}
