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
import AutoplayToggle from 'components/pages/lessons/AutoplayToggle'
import RecommendNextStepOverlay from 'components/pages/lessons/overlay/recommend-next-step-overlay'
import Markdown from 'react-markdown'
import Link from 'next/link'
import {track} from 'utils/analytics'
import Eggo from 'components/icons/eggo'
import Image from 'next/image'
import cookieUtil from 'utils/cookies'
import useBreakpoint from 'utils/breakpoints'
import NextUpList from 'components/pages/lessons/NextUpList'
import Share from 'components/Share'
import LessonDownload from 'components/pages/lessons/LessonDownload'
import {useNextForCollection, useNextUpData} from 'hooks/use-next-up-data'
import CollectionLessonsList from 'components/pages/lessons/collection-lessons-list'
import CodeLink, {
  IconCode,
  IconGithub,
} from 'components/pages/lessons/code-link'

const tracer = getTracer('lesson-page')

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  res,
  params,
}) {
  setupHttpTracing({name: getServerSideProps.name, tracer, req, res})

  const initialLesson: LessonResource | undefined =
    params && (await loadLesson(params.slug as string))

  if (initialLesson && initialLesson?.slug !== params?.slug) {
    res.setHeader('Location', initialLesson.path)
    res.statusCode = 302
    res.end()
    return {props: {}}
  } else {
    res.setHeader(
      'Link',
      'https://cdn.bitmovin.com/player/web/8/bitmovinplayer.js; rel="preload"; as="script"',
    )
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
    return {
      props: {
        initialLesson,
      },
    }
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
const MAX_FREE_VIEWS = 7

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
  const [watchCount, setWatchCount] = React.useState<number>(0)

  const currentPlayerState = playerState.value

  useLastResource({...lesson, image_url: lesson.icon_url})

  const {data} = useSWR(lesson.media_url, fetcher)

  React.useEffect(() => {
    send('LOAD')
    setLesson(initialLesson)
    loadLesson(initialLesson.slug, getAccessTokenFromCookie()).then(setLesson)
    if (cookieUtil.get(`egghead-watch-count`)) {
      setWatchCount(Number(cookieUtil.get(`egghead-watch-count`)))
    } else {
      setWatchCount(
        Number(
          cookieUtil.set(`egghead-watch-count`, 0, {
            expires: 7,
          }),
        ),
      )
    }
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
  const nextLesson = useNextForCollection(collection, lesson.slug)
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

  const checkAutoPlay = () => {
    if (autoplay && (nextLesson || nextUp.nextUpPath)) {
      // this is sloppy and transitions weird so we might consider
      // a "next" overlay with a 3-5 second "about to play" spinner
      // instead of just lurching forward
      // so instead of LOAD this might call NEXT but the next overlay
      // would read the autoplay preference and present the appropriate
      // UI
      send('LOAD')
      setLesson({})
      setTimeout(() => {
        console.log(`autoplaying ${nextLesson.path || nextUp.nextUpPath}`)
        router.push(nextLesson.path || nextUp.nextUpPath)
      }, 1250)
    } else if (nextLesson || nextUp.nextUpPath) {
      send(`NEXT`)
    } else {
      send(`RECOMMEND`)
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
      } else if (nextLesson || nextUp.nextUpPath) {
        send(`NEXT`)
      } else {
        send(`RECOMMEND`)
      }
    } else {
      console.error('no lesson view')
      const newWatchCount = Number(
        cookieUtil.set(`egghead-watch-count`, watchCount + 1, {
          expires: 15,
        }),
      )
      setWatchCount(newWatchCount)
      checkAutoPlay()
    }
  }

  React.useEffect(() => {
    switch (currentPlayerState) {
      case 'loading':
        if (data) {
          const event: PlayerStateEvent = {
            type: 'LOADED',
            lesson: lesson,
          }
          send(event)
        }
        break
      case 'loaded':
        if (!data) {
          send('LOAD')
        } else if (isEmpty(viewer) && free_forever) {
          if (watchCount < MAX_FREE_VIEWS && (data.hls_url || data.dash_url)) {
            send('VIEW')
          } else {
            send('JOIN')
          }
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
  }, [currentPlayerState, data, lesson])

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

  const {xs, sm, md, lg} = useBreakpoint()

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
            className="w-full m-auto flex"
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
                      nextLesson={nextLesson}
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
          <div className="grid lg:gap-12 gap-8 lg:grid-cols-12 grid-cols-1 max-w-screen-xl mx-auto divide-y md:divide-transparent divide-gray-50">
            <div className="md:col-span-8 md:row-start-1 row-start-1 md:space-y-10 space-y-6">
              <div className="space-y-4">
                <SortingHat />
                {title && (
                  <h1 className="font-extrabold tracking-tight leading-tighter text-xl lg:text-3xl">
                    {title}
                  </h1>
                )}
                <div className="pt-2">
                  {lesson?.code_url && (
                    <CodeLink
                      onClick={() => {
                        track(`clicked open code`, {
                          lesson: lesson.slug,
                        })
                      }}
                      url={lesson.code_url}
                      icon={<IconCode />}
                    >
                      Open code for this lesson
                    </CodeLink>
                  )}
                  {lesson?.repo_url && (
                    <CodeLink
                      onClick={() => {
                        track(`clicked open github`, {
                          lesson: lesson.slug,
                        })
                      }}
                      url={lesson.repo_url}
                      icon={<IconGithub />}
                    >
                      Open code on GitHub
                    </CodeLink>
                  )}
                </div>

                {description && (
                  <Markdown className="prose sm:prose-xl max-w-none font-medium">
                    {description}
                  </Markdown>
                )}
                <div className="pt-4 flex md:flex-row flex-col w-full justify-between flex-wrap md:space-x-8 md:space-y-0 space-y-5 md:items-center">
                  <div className="md:w-auto w-full flex justify-between items-center">
                    {instructor && (
                      <div className="flex items-center flex-shrink-0">
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
                            className="mr-2 flex itemes-center"
                          >
                            {get(instructor, 'avatar_64_url') ? (
                              <Image
                                width={48}
                                height={48}
                                src={instructor.avatar_64_url}
                                alt={instructor.full_name}
                                className="rounded-full m-0"
                              />
                            ) : (
                              <Eggo className="w-8 rounded-full" />
                            )}
                          </a>
                        </Link>
                        <div className="flex flex-col">
                          <span className="text-xs">Instructor</span>
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
                                className="font-semibold leading-tighter hover:underline"
                              >
                                {instructor.full_name}
                              </a>
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                    {md && <Tags tags={tags} lesson={lesson} />}
                  </div>
                  <div className="flex items-center space-x-8">
                    <div className="flex items-center space-x-2">
                      <Share
                        className="flex flex-col items-end"
                        resource={{
                          path: lesson.path,
                          title: lesson.title,
                          type: 'lesson',
                        }}
                        instructor={instructor}
                      />
                    </div>
                    {!md && <Tags tags={tags} lesson={lesson} />}
                  </div>
                </div>
              </div>
              {md && (
                <>
                  <Course course={collection} lesson={lesson} />
                  <AutoplayToggle enabled={playerVisible && next_up_url} />
                  {!playerState.matches('loading') && !collection && nextUp && (
                    <NextUpList
                      nextUp={nextUp}
                      currentLessonSlug={lesson.slug}
                    />
                  )}
                  {collection && collection.lessons && (
                    <CollectionLessonsList
                      course={collection}
                      currentLessonSlug={lesson.slug}
                      progress={lessonView?.collection_progress}
                    />
                  )}
                  <LessonInfo
                    autoplay={{enabled: playerVisible && next_up_url}}
                    title={title}
                    instructor={instructor}
                    tags={tags}
                    description={description}
                    course={collection}
                    nextUp={nextUp}
                    lesson={lesson}
                    playerState={playerState}
                    className="space-y-6"
                  />
                </>
              )}

              <Tabs>
                <TabList className="md:text-lg text-normal font-semibold bg-transparent space-x-1">
                  {transcriptAvailable && <Tab>Transcript</Tab>}
                  <Tab>Comments</Tab>
                </TabList>
                <TabPanels className="md:mt-6 mt-3">
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
                    <p>Coming soon!</p>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </div>
            <div className="md:col-span-4 flex flex-col space-y-4">
              {!md && (
                <>
                  <div className="w-full flex justify-end items-center space-x-4">
                    <LessonDownload lesson={lesson} />
                    <AutoplayToggle enabled={playerVisible && next_up_url} />
                  </div>
                  <Course course={collection} lesson={lesson} />
                  {!playerState.matches('loading') && !collection && nextUp && (
                    <NextUpList
                      nextUp={nextUp}
                      currentLessonSlug={lesson.slug}
                    />
                  )}
                  {collection && collection.lessons && (
                    <CollectionLessonsList
                      course={collection}
                      currentLessonSlug={lesson.slug}
                      progress={lessonView?.collection_progress}
                    />
                  )}
                </>
              )}

              {!md && (
                <>
                  <LessonInfo
                    autoplay={{enabled: playerVisible && next_up_url}}
                    title={title}
                    instructor={instructor}
                    tags={tags}
                    description={description}
                    course={collection}
                    nextUp={nextUp}
                    lesson={lesson}
                    playerState={playerState}
                    className="space-y-6"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Lesson

const Course: FunctionComponent<{
  course: {
    title: string
    square_cover_480_url: string
    slug: string
    path: string
  }
  lesson: any
}> = ({course, lesson}) => {
  return course ? (
    <div>
      <div className="flex items-center">
        <Link href={course.path}>
          <a className="flex-shrink-0 relative block w-12 h-12 lg:w-20 lg:h-20">
            <Image
              src={course.square_cover_480_url}
              alt={`illustration for ${course.title}`}
              layout="fill"
            />
          </a>
        </Link>
        <div className="ml-2 lg:ml-4">
          <h4 className="text-gray-700 font-semibold mb-px text-xs uppercase">
            Course
          </h4>
          <Link href={course.path}>
            <a
              onClick={() => {
                track(`clicked open course`, {
                  lesson: lesson.slug,
                })
              }}
              className="hover:underline"
            >
              <h3 className="font-bold leading-tighter text-md lg:text-lg">
                {course.title}
              </h3>
            </a>
          </Link>
        </div>
      </div>
    </div>
  ) : null
}

const Tags: FunctionComponent<{tags: any; lesson: any}> = ({tags, lesson}) => {
  return (
    <>
      {!isEmpty(tags) && (
        <div className="flex space-x-4 items-center">
          {/* <div className="font-medium">Tech used:</div> */}
          <ul className="flex flex-wrap items-center space-x-4">
            {tags.slice(0, 1).map((tag: any, index: number) => (
              <li key={index} className="inline-flex items-center">
                <Link href={`/q/${tag.name}`}>
                  <a
                    onClick={() => {
                      track(`clicked view topic`, {
                        lesson: lesson.slug,
                        topic: tag.name,
                      })
                    }}
                    className="inline-flex items-center  hover:underline"
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
    </>
  )
}
