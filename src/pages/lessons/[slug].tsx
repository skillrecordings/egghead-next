import React, {FunctionComponent, useState} from 'react'
import {GetServerSideProps} from 'next'
import {useRouter} from 'next/router'
import {isEmpty, get, first} from 'lodash'
import {useMachine} from '@xstate/react'
import {motion} from 'framer-motion'
import {Tabs, TabList, Tab, TabPanels, TabPanel} from '@reach/tabs'
import {useWindowSize} from 'react-use'
import playerMachine, {PlayerStateEvent} from 'machines/lesson-player-machine'
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
import RateCourseOverlay from 'components/pages/lessons/overlay/rate-course-overlay'
import useSWR from 'swr'
import fetcher from 'utils/fetcher'
import {useEnhancedTranscript} from 'hooks/use-enhanced-transcript'
import useLastResource from 'hooks/use-last-resource'
import SortingHat from 'components/survey/sorting-hat'
import {useEggheadPlayer} from 'components/EggheadPlayer'
import getAccessTokenFromCookie from 'utils/getAccessTokenFromCookie'
import {useNextUpData} from 'hooks/use-next-up-data'
import AutoplayToggle from 'components/pages/lessons/AutoplayToggle'
import RecommendNextStepOverlay from 'components/pages/lessons/overlay/recommend-next-step-overlay'

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
  <div className="grid place-items-center w-full h-full absolute z-10 top-0 left-0">
    <svg
      className="text-gray-200"
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
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
  const [lesson, setLesson] = React.useState<any>(initialLesson)
  const clientHeight = isBrowser() ? height : 0
  const [lessonMaxWidth, setLessonMaxWidth] = useState(0)
  const router = useRouter()
  const playerRef = React.useRef(null)
  const {viewer} = useViewer()
  const [playerState, send] = useMachine(playerMachine)
  const {onProgress, onEnded, autoplay} = useEggheadPlayer(lesson)
  const [lessonView, setLessonView] = React.useState<any>()

  const currentPlayerState = playerState.value

  useLastResource({...lesson, image_url: lesson.icon_url})

  const {data} = useSWR(lesson.media_url, fetcher)

  React.useEffect(() => {
    setLesson(initialLesson)
    loadLesson(initialLesson.slug, getAccessTokenFromCookie()).then(setLesson)
  }, [initialLesson])

  const {
    instructor,
    next_up_url,
    transcript,
    transcript_url,
    http_url,
    title,
    tags,
    description,
    course,
    free_forever,
    slug,
  } = lesson

  const nextUp = useNextUpData(next_up_url)
  const enhancedTranscript = useEnhancedTranscript(transcript_url)
  const transcriptAvailable = transcript || enhancedTranscript

  const primary_tag = get(first(get(lesson, 'tags')), 'name', 'javascript')

  const getProgress = () => {
    if (lessonView?.collection_progress) {
      return lessonView.collection_progress
    } else if (nextUp.nextUpData?.list?.progress) {
      return nextUp.nextUpData.list.progress
    }
  }

  const completeVideo = () => {
    if (lessonView) {
      const progress = getProgress()
      if (progress?.rate_url) {
        send('RATE')
      } else if (autoplay && nextUp.nextUpPath) {
        // this is sloppy and transitions weird so we might consider
        // a "next" overlay with a 3-5 second "about to play" spinner
        // instead of just lurching forward
        // so instead of LOAD this might call NEXT but the next overlay
        // would read the autoplay preference and present the appropriate
        // UI
        send('LOAD')
        setTimeout(() => {
          console.log(`autoplaying ${nextUp.nextUpPath}`)
          router.push(nextUp.nextUpPath)
        }, 1250)
      } else if (nextUp.nextUpPath) {
        send(`NEXT`)
      } else {
        send(`RECOMMEND`)
      }
    } else {
      console.error('no lesson view')
    }
  }

  React.useEffect(() => {
    switch (currentPlayerState) {
      case 'loading':
        if (data) {
          const event: PlayerStateEvent = {
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
        completeVideo()
        break
    }
  }, [currentPlayerState, data, initialLesson])

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
    ['playing', 'paused', 'loaded', 'viewing', 'completed'].some(
      playerState.matches,
    ) && !isEmpty(data)

  return (
    <>
      <NextSeo
        description={removeMarkdown(description)}
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
          description: removeMarkdown(description),
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
      <div key={initialLesson.slug} className="space-y-8 w-full sm:pb-16 pb-8">
        <div className="bg-black -mt-3 sm:-mt-5 -mx-5">
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
              className="w-full relative overflow-hidden text-white"
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
                    resource={lesson}
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
                    onProgress={({...progress}) => {
                      onProgress(progress).then((lessonView: any) => {
                        if (lessonView) {
                          setLessonView(lessonView)
                        }
                      })
                    }}
                    onEnded={() => {
                      onEnded().then((lessonView: any) => {
                        if (lessonView) {
                          setLessonView(lessonView)
                        }
                        send('COMPLETE')
                      })
                    }}
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
                    <JoinCTA lesson={lesson} />
                  </OverlayWrapper>
                )}
                {playerState.matches('showingNext') && (
                  <OverlayWrapper>
                    <NextUpOverlay
                      lesson={lesson}
                      send={send}
                      nextUp={nextUp}
                    />
                  </OverlayWrapper>
                )}
                {playerState.matches('rating') && (
                  <OverlayWrapper>
                    <RateCourseOverlay
                      course={lesson.course}
                      onRated={() => {
                        // next in this scenario needs to be considered
                        // we should also consider adding the ability to
                        // comment
                        send('NEXT')
                      }}
                      rateUrl={lessonView.collection_progress.rate_url}
                    />
                  </OverlayWrapper>
                )}
                {playerState.matches('recommending') && (
                  <OverlayWrapper>
                    <RecommendNextStepOverlay lesson={lesson} />
                  </OverlayWrapper>
                )}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="grid gap-8 md:grid-cols-12 grid-cols-1 max-w-screen-xl mx-auto divide-y md:divide-transparent divide-gray-50">
            <div className="md:col-span-8 md:row-start-1 row-start-2">
              <SortingHat />
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
                        initialTranscript={transcript}
                        enhancedTranscript={enhancedTranscript}
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
              <div className="flex justify-end">
                <AutoplayToggle />
              </div>
              <LessonInfo
                title={title}
                instructor={instructor}
                tags={tags}
                description={description}
                course={course}
                nextUp={nextUp}
                lesson={lesson}
                playerState={playerState}
                className="space-y-6 divide-y divide-gray-100"
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
