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
import Markdown from 'react-markdown'
import useClipboard from 'react-use-clipboard'
import Link from 'next/link'
import {track} from '../../utils/analytics'
import Eggo from '../../components/images/eggo.svg'
import Image from 'next/image'
import axios from '../../utils/configured-axios'

const tracer = getTracer('lesson-page')

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
    collection,
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
                      course={lesson.collection}
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
            <div className="md:col-span-8 md:row-start-1 row-start-2 space-y-10">
              <div className="space-y-4">
                <SortingHat />
                {title && (
                  <h1 className="font-bold leading-tighter text-lg lg:text-xl">
                    {title}
                  </h1>
                )}
                <div className="pt-2 grid xl:grid-cols-2 md:grid-cols-1 grid-cols-2 gap-5">
                  {instructor && (
                    <div>
                      <h4 className="font-semibold">Instructor</h4>
                      <div className="flex items-center mt-3 flex-shrink-0">
                        <Link
                          href={`/instructors/${get(instructor, 'slug', '#')}`}
                        >
                          <a
                            onClick={() => {
                              track(`clicked view instructor`, {
                                lesson: lesson.slug,
                                location: 'avatar',
                              })
                            }}
                            className="mr-2"
                          >
                            {get(instructor, 'avatar_64_url') ? (
                              <img
                                src={instructor.avatar_64_url}
                                alt=""
                                className="w-10 rounded-full m-0"
                              />
                            ) : (
                              <Eggo className="w-8 rounded-full" />
                            )}
                          </a>
                        </Link>
                        {get(instructor, 'full_name') && (
                          <Link
                            href={`/instructors/${get(
                              instructor,
                              'slug',
                              '#',
                            )}`}
                          >
                            <a
                              onClick={() => {
                                track(`clicked view instructor`, {
                                  lesson: lesson.slug,
                                  location: 'text link',
                                })
                              }}
                              className="hover:underline"
                            >
                              {instructor.full_name}
                            </a>
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                  {!isEmpty(tags) && (
                    <div>
                      <h4 className="font-semibold">Tech used</h4>
                      <ul
                        className="grid gap-3 mt-5"
                        css={{
                          gridTemplateColumns:
                            'repeat(auto-fill, minmax(100px, 1fr))',
                        }}
                      >
                        {tags.map((tag: any, index: number) => (
                          <li key={index}>
                            <Link href={`/q/${tag.name}`}>
                              <a
                                onClick={() => {
                                  track(`clicked view topic`, {
                                    lesson: lesson.slug,
                                    topic: tag.name,
                                  })
                                }}
                                className="inline-flex items-center first:ml-0 hover:underline"
                              >
                                <Image
                                  src={tag.image_url}
                                  alt={tag.name}
                                  width={24}
                                  height={24}
                                  className="flex-shrink-0"
                                />
                                <span className="ml-1">{tag.label}</span>
                              </a>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {description && <Markdown>{description}</Markdown>}
                <div>
                  <h4 className="font-semibold">
                    Share this lesson with your friends
                  </h4>
                  <div className="flex items-center mt-3">
                    <div className="flex items-center">
                      <TweetLink lesson={lesson} instructor={instructor} />
                      <CopyToClipboard
                        stringToCopy={`${process.env.NEXT_PUBLIC_REDIRECT_URI}${lesson.path}`}
                        className="ml-2"
                      />
                    </div>
                  </div>
                </div>
              </div>

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
              <div className="flex justify-end space-x-6">
                {lesson.download_url && viewer?.is_pro ? (
                  <div className="flex items-center">
                    <a
                      onClick={(e) => {
                        e.preventDefault()
                        axios.get(lesson.download_url).then(({data}) => {
                          window.location.href = data
                        })
                        track(`clicked download lesson`, {
                          lesson: lesson.slug,
                        })
                      }}
                      href={lesson.download_url}
                      className="flex items-center text-blue-600 hover:underline font-semibold"
                    >
                      <IconDownload className="w-5 mr-2 text-blue-700" />
                      Download Video
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div
                      onClick={() => {
                        track(`clicked download lesson blocked`, {
                          lesson: lesson.slug,
                        })
                      }}
                      className="flex items-center text-blue-600 opacity-30 font-semibold"
                    >
                      <IconDownload className="w-5 mr-2 text-blue-700" />
                      Download Video {!viewer?.is_pro && `(members only)`}
                    </div>
                  </div>
                )}
                <AutoplayToggle enabled={playerVisible && next_up_url} />
              </div>
              <LessonInfo
                title={title}
                instructor={instructor}
                tags={tags}
                description={description}
                course={collection}
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

const TweetLink: FunctionComponent<{
  lesson: {
    title: string
    path: string
  }
  instructor: {
    slug: string
    twitter?: string
  }
  className?: string
}> = ({lesson, instructor, className = ''}) => {
  const encodeTweetUrl = () => {
    const twitterBase = `https://twitter.com/intent/tweet/?text=`
    const instructorTwitterText = isEmpty(get(instructor, 'twitter'))
      ? ''
      : ` by @${instructor.twitter}`
    const tweetText = `${lesson.title} ${instructorTwitterText}, lesson on @eggheadio`
    const encodeLessonUrl = encodeURIComponent(
      process.env.NEXT_PUBLIC_REDIRECT_URI + lesson.path,
    )
    const tweetParams = `&url=${encodeLessonUrl}`
    return twitterBase + tweetText + tweetParams
  }
  return get(lesson, 'title') && get(lesson, 'path') ? (
    <a
      className={`flex text-sm items-center rounded px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors ease-in-out duration-150 ${className}`}
      target="_blank"
      rel="noopener noreferrer"
      href={encodeTweetUrl()}
    >
      <IconTwitter className="w-5 mr-2" />
      <span>Tweet</span>
    </a>
  ) : null
}
const CopyToClipboard: FunctionComponent<{
  stringToCopy: string
  className?: string
}> = ({stringToCopy = '', className = ''}) => {
  const [isCopied, setCopied] = useClipboard(stringToCopy, {
    successDuration: 1000,
  })

  return (
    <div>
      <button
        type="button"
        onClick={setCopied}
        className={`rounded text-sm px-3 py-2 flex justify-center items-center bg-gray-100 hover:bg-gray-200 transition-colors duration-150 ease-in-out ${className}`}
      >
        {isCopied ? (
          'Copied'
        ) : (
          <>
            <IconLink className="w-5 mr-2" />
            <span>
              Copy link
              <span className="hidden lg:inline"> to clipboard</span>
            </span>
          </>
        )}
      </button>
    </div>
  )
}

const IconLink: FunctionComponent<{className?: string}> = ({
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
      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
    />
  </svg>
)

const IconTwitter: FunctionComponent<{className?: string}> = ({
  className = '',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
  >
    <g fill="currentColor">
      <path fill="none" d="M0 0h24v24H0z"></path>
      <path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z"></path>
    </g>
  </svg>
)

const IconDownload: FunctionComponent<{className?: string}> = ({
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
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
)
