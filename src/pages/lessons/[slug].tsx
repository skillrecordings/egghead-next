import React, {FunctionComponent} from 'react'
import {GetServerSideProps} from 'next'
import {useRouter} from 'next/router'
import {isEmpty, get, first, isFunction} from 'lodash'
import {useMachine} from '@xstate/react'
import {motion} from 'framer-motion'
import {Tabs, TabList, Tab, TabPanels, TabPanel} from '@reach/tabs'
import {useWindowSize, useMeasure} from 'react-use'
import {playerMachine, PlayerStateEvent} from 'machines/lesson-player-machine'
import EggheadPlayer, {useEggheadPlayer} from 'components/EggheadPlayer'
import {useEggheadPlayerPrefs} from 'components/EggheadPlayer/use-egghead-player'
import LessonInfo from 'components/pages/lessons/lesson-info'
import Transcript from 'components/pages/lessons/Transcript_'
import PlaybackSpeedSelect from 'components/pages/lessons/playback-speed-select'
import {loadBasicLesson, loadLesson} from 'lib/lessons'
import {useViewer} from 'context/viewer-context'
import {LessonResource} from 'types'
import {NextSeo} from 'next-seo'
import removeMarkdown from 'remove-markdown'
import getTracer from 'utils/honeycomb-tracer'
import {setupHttpTracing} from '@vercel/tracing-js'
import CreateAccountCTA from 'components/pages/lessons/create-account-cta'
import JoinCTA from 'components/pages/lessons/join-cta'
import Head from 'next/head'
import NextUpOverlay from 'components/pages/lessons/overlay/next-up-overlay'
import RateCourseOverlay from 'components/pages/lessons/overlay/rate-course-overlay'
import axios from 'utils/configured-axios'
import {useEnhancedTranscript} from 'hooks/use-enhanced-transcript'
import useLastResource from 'hooks/use-last-resource'
import SortingHat from 'components/survey/sorting-hat'
import getAccessTokenFromCookie from 'utils/get-access-token-from-cookie'
import RecommendNextStepOverlay from 'components/pages/lessons/overlay/recommend-next-step-overlay'
import Markdown from 'react-markdown'
import Link from 'next/link'
import {track} from 'utils/analytics'
import Eggo from 'components/icons/eggo'
import Image from 'next/image'
import cookieUtil from 'utils/cookies'
import useBreakpoint from 'utils/breakpoints'
import Share from 'components/share'
import LessonDownload from 'components/pages/lessons/lesson-download'
import {useNextForCollection} from 'hooks/use-next-up-data'
import CollectionLessonsList from 'components/pages/lessons/collection-lessons-list'
import Comment from 'components/pages/lessons/comment'
import CodeLink, {
  IconCode,
  IconGithub,
} from 'components/pages/lessons/code-link'
import getDependencies from 'data/courseDependencies'
import AutoplayToggle from 'components/pages/lessons/autoplay-toggle'

const tracer = getTracer('lesson-page')

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  res,
  params,
}) {
  setupHttpTracing({name: getServerSideProps.name, tracer, req, res})

  const initialLesson: LessonResource | undefined =
    params && (await loadBasicLesson(params.slug as string))

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

const OverlayWrapper: FunctionComponent<{
  children: React.ReactNode
}> = ({children}) => {
  return (
    <div className="flex flex-col justify-center items-center h-full px-3 py-3 md:px-4 md:py-6 lg:py-8">
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

const MAX_FREE_VIEWS = 7
const HEADER_HEIGHT = 80

const Lesson: FunctionComponent<LessonProps> = ({initialLesson}) => {
  const router = useRouter()

  const {viewer} = useViewer()
  const {setPlayerPrefs, playbackRate, defaultView} = useEggheadPlayerPrefs()

  const {md} = useBreakpoint()

  const {height} = useWindowSize()
  const CONTENT_OFFSET = height < 450 ? 30 : 120
  const HEIGHT_OFFSET = HEADER_HEIGHT + CONTENT_OFFSET

  const [lessonMaxWidth, setLessonMaxWidth] = React.useState(0)
  const [ref, {width: videoWidth}] = useMeasure<any>()

  const [media, setMedia] = React.useState<any>()
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  const playerRef = React.useRef(null)
  const actualPlayerRef = React.useRef<any>(null)

  const [playerState, send] = useMachine(playerMachine, {
    context: {lesson: initialLesson},
  })

  const lesson: any = get(playerState, 'context.lesson', initialLesson)

  const {onProgress, onEnded, autoplay} = useEggheadPlayer(lesson)
  const [playerVisible, setPlayerVisible] = React.useState<boolean>(false)
  const [lessonView, setLessonView] = React.useState<any>()
  const [watchCount, setWatchCount] = React.useState<number>(0)
  const currentPlayerState = playerState.value as string

  useLastResource({...lesson, image_url: lesson.icon_url})

  const {
    instructor,
    transcript,
    transcript_url,
    http_url,
    title,
    tags = [],
    description,
    collection,
    free_forever,
    slug,
    media_url,
    comments,
  } = lesson

  React.useEffect(() => {
    setMedia(false)
    if (media_url) {
      axios.get(media_url).then(({data}) => {
        setMedia(data)
        const event: PlayerStateEvent = {
          type: 'LOADED',
          lesson: lesson,
        }
        send(event)
      })
    }
  }, [media_url])

  const nextLesson = useNextForCollection(collection, lesson.slug)
  const enhancedTranscript = useEnhancedTranscript(transcript_url)
  const transcriptAvailable = transcript || enhancedTranscript
  const courseDependencies: any = getDependencies(collection?.slug)
  const {dependencies} = courseDependencies

  const collectionTags = tags.map((tag: any) => {
    const version = get(dependencies, tag.name)
    return {
      ...tag,
      ...(!!version && {version}),
    }
  })

  const primary_tag = get(first(get(lesson, 'tags')), 'name', 'javascript')

  const getProgress = (lessonView: any) => {
    if (lessonView?.collection_progress) {
      return lessonView.collection_progress
    }
  }

  const loaderVisible = ['loading', 'completed'].includes(currentPlayerState)

  const commentsAvailable =
    comments?.some((comment: any) => comment.state === 'published') ?? false

  React.useEffect(() => {
    setPlayerVisible(
      [
        'playing',
        'paused',
        'loaded',
        'viewing',
        'completed',
        'showingNext',
      ].includes(currentPlayerState),
    )
  }, [currentPlayerState])

  const checkAutoPlay = async () => {
    if (autoplay && nextLesson) {
      console.debug('autoplaying next lesson', {nextLesson})
      track('autoplaying next video', {
        video: nextLesson.slug,
      })

      if (isFullscreen) {
        const loadedLesson = await loadLesson(
          nextLesson.slug,
          getAccessTokenFromCookie(),
        )

        console.debug('full screen authed video loaded', {video: loadedLesson})

        const mediaUrls = {
          hls_url: loadedLesson.hls_url,
          dash_url: loadedLesson.dash_url,
        }

        send({
          type: 'VIEW',
          lesson: loadedLesson,
        })

        setMedia(mediaUrls)

        router.push(loadedLesson.path, undefined, {
          shallow: true,
        })
      } else {
        router.push(nextLesson.path)
      }
    } else if (nextLesson) {
      send(`NEXT`)
    } else {
      send(`RECOMMEND`)
    }
  }

  const completeVideo = (lessonView: any) => {
    console.debug('completed video', {lessonView, video: lesson})
    if (lessonView) {
      const hasNextLesson = nextLesson
      const progress = getProgress(lessonView)

      if (!hasNextLesson && isFullscreen) {
        window.document.exitFullscreen()
        setIsFullscreen(false)
      }

      if (!hasNextLesson && progress?.rate_url) {
        send('RATE')
      } else {
        checkAutoPlay()
      }
    } else {
      console.debug('no lesson view - incrementing watch count')
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
    const lesson = get(playerState, 'context.lesson')
    const mediaPresent =
      lesson?.hls_url || lesson?.dash_url || media?.hls_url || media?.dash_url
    switch (currentPlayerState) {
      case 'loaded':
        const viewLimitNotReached = watchCount < MAX_FREE_VIEWS

        if (isEmpty(viewer) && free_forever) {
          if (viewLimitNotReached && mediaPresent) {
            send('VIEW')
          } else {
            send('JOIN')
          }
        } else if (mediaPresent) {
          send('VIEW')
        } else {
          send('SUBSCRIBE')
        }
        break
      case 'viewing':
        if (!mediaPresent && !isFullscreen) {
          send('LOAD')
        }
        break
      case 'completed':
        let completed = false
        console.debug('handling a change to completed', {lesson, lessonView})
        onEnded(lesson).then((lessonView: any) => {
          if (lessonView) {
            setLessonView(lessonView)
          }
          if (!completed) completeVideo(lessonView)
        })

        if (lessonView) {
          completeVideo(lessonView)
          completed = true
        }
        break
    }
  }, [currentPlayerState, media])

  React.useEffect(() => {
    const handleRouteChange = () => {
      send('LOAD')
      setMedia(false)
    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router.events, send])

  React.useEffect(() => {
    async function run() {
      console.debug('loading video with auth')
      const loadedLesson = await loadLesson(
        initialLesson.slug,
        getAccessTokenFromCookie(),
      )
      console.debug('authed video loaded', {video: loadedLesson})

      const mediaUrls = {
        hls_url: loadedLesson.hls_url,
        dash_url: loadedLesson.dash_url,
      }

      setMedia(mediaUrls)

      send({
        type: 'LOADED',
        lesson: loadedLesson,
      })
    }

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

    run()
  }, [initialLesson.slug])

  React.useEffect(() => {
    setLessonMaxWidth(Math.round((height - HEIGHT_OFFSET) * 1.77))
  }, [height])

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
      <div
        key={initialLesson.slug}
        className="sm:space-y-8 space-y-6 w-full sm:pb-16 pb-8"
      >
        <div className="bg-black -mt-3 sm:-mt-5 -mx-5 border-b border-gray-100">
          <div className="w-full flex flex-col lg:flex-row justify-center">
            <div
              ref={ref}
              className="flex-grow"
              css={{
                maxWidth: lessonMaxWidth,
                '@media (min-width: 1024px)': {
                  minWidth: '640px',
                },
              }}
            >
              <div
                className="flex flex-grow bg-black"
                css={{
                  minHeight: Math.round(videoWidth / 1.77777),
                }}
              >
                <div
                  className={`w-full relative ${
                    playerVisible || loaderVisible ? 'h-0' : ''
                  }`}
                  css={{
                    paddingTop: playerVisible || loaderVisible ? '56.25%' : 0,
                  }}
                >
                  <div
                    className={`flex items-center justify-center text-white h-full ${
                      playerVisible || loaderVisible
                        ? 'absolute top-0 right-0 bottom-0 left-0'
                        : ''
                    }`}
                  >
                    <div
                      className={`${
                        playerVisible || loaderVisible ? 'absolute' : ''
                      } w-full h-full top-0 left-0`}
                    >
                      <EggheadPlayer
                        ref={playerRef}
                        hidden={!playerVisible}
                        resource={lesson}
                        hls_url={lesson?.hls_url || media?.hls_url}
                        dash_url={lesson?.dash_url || media?.dash_url}
                        playing={playerState.matches('playing')}
                        playbackRate={playbackRate}
                        width="100%"
                        height="auto"
                        pip="true"
                        controls
                        onPlay={() => send('PLAY')}
                        onViewModeChanged={({to}: {to: string}) => {
                          if (to === 'fullscreen') {
                            track('entered fullscreen video', {
                              video: lesson.slug,
                            })

                            setIsFullscreen(true)
                          } else {
                            setIsFullscreen(false)
                          }
                        }}
                        onReady={(player: any) => {
                          actualPlayerRef.current = player
                          if (autoplay && isFunction(player.play)) {
                            player.play()
                          }
                        }}
                        onPause={() => {
                          send('PAUSE')
                        }}
                        onProgress={({...progress}) => {
                          onProgress(progress, lesson).then(
                            (lessonView: any) => {
                              if (lessonView) {
                                console.debug('progress recorded', {
                                  progress: lessonView,
                                })
                                setLessonView(lessonView)
                              }
                            },
                          )
                        }}
                        onEnded={() => {
                          send('COMPLETE')
                        }}
                        subtitlesUrl={get(lesson, 'subtitles_url')}
                      />

                      {loaderVisible && <Loader />}

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
                        <NextUpOverlay
                          lesson={lesson}
                          nextLesson={nextLesson}
                          onClickRewatch={() => {
                            send('VIEW')
                            if (actualPlayerRef.current) {
                              actualPlayerRef.current.play()
                            }
                          }}
                        />
                      )}
                      {playerState.matches('rating') && (
                        <OverlayWrapper>
                          <RateCourseOverlay
                            course={lesson.collection}
                            onRated={(review) => {
                              axios
                                .post(
                                  lessonView.collection_progress.rate_url,
                                  review,
                                )
                                .then(() => {
                                  const comment = get(review, 'comment.comment')
                                  const prompt = get(
                                    review,
                                    'comment.context.prompt',
                                  )

                                  if (review) {
                                    track('rated course', {
                                      course: slug,
                                      rating: review.rating,
                                      ...(comment && {comment}),
                                      ...(!!prompt && {prompt}),
                                    })
                                  }
                                })
                                .finally(() => {
                                  setTimeout(() => {
                                    send('RECOMMEND')
                                  }, 1500)
                                })
                            }}
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
              <div className="flex justify-between items-center w-full border-t border-gray-900 pl-2 3xl:pl-0 pr-3 3xl:pr-4 py-2">
                <div className="flex items-center flex-grow space-x-4">
                  {playbackRate && (
                    <PlaybackSpeedSelect
                      playbackRate={playbackRate}
                      changePlaybackRate={(rate: number) =>
                        setPlayerPrefs({playbackRate: rate})
                      }
                      video={slug}
                    />
                  )}
                  <LessonDownload lesson={lesson} />
                </div>
                <div>
                  <AutoplayToggle
                    enabled={true}
                    onDark={true}
                    player={actualPlayerRef.current}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-shrink-0 bg-white flex-col w-full lg:w-3/12 2xl:w-1/5 border-l border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <Course course={collection} currentLessonSlug={lesson.slug} />
              </div>
              <div className="relative h-full px-4 lg:px-0 py-3 lg:py-0">
                <div className="lg:absolute top-0 bottom-0 left-0 right-0">
                  {collection && collection.lessons && (
                    <CollectionLessonsList
                      course={collection}
                      currentLessonSlug={lesson.slug}
                      progress={lessonView?.collection_progress}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div
            className={`grid lg:grid-cols-1 max-w-screen-lg lg:gap-12 gap-8 grid-cols-1 mx-auto divide-y md:divide-transparent divide-gray-50`}
          >
            <div className="md:col-span-8 md:row-start-1 row-start-1 space-y-6 md:space-y-8 lg:space-y-10">
              <div className="space-y-4">
                <SortingHat />
                {title && (
                  <h1 className="font-extrabold tracking-tight leading-tighter text-xl lg:text-3xl">
                    {title}
                  </h1>
                )}
                <div className="pt-4 flex lg:flex-row flex-col w-full justify-between flex-wrap lg:space-x-8 lg:space-y-0 space-y-5 lg:items-center">
                  <div className="md:w-auto w-full flex justify-between items-center space-x-5">
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
                    {!md && <Tags tags={collectionTags} lesson={lesson} />}
                  </div>
                  {md && <Tags tags={collectionTags} lesson={lesson} />}
                  <div className="flex items-center space-x-8">
                    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
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
                  </div>
                </div>

                {(lesson?.code_url || lesson?.repo_url) && (
                  <div className="sm:text-base text-sm sm:pt-2 w-full flex sm:items-center sm:flex-row flex-col sm:space-x-6 sm:space-y-0 space-y-2">
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
                )}

                {description && (
                  <Markdown className="prose sm:prose-xl max-w-none font-medium">
                    {description}
                  </Markdown>
                )}
              </div>
              {md && (
                <>
                  <Course course={collection} currentLessonSlug={lesson.slug} />

                  <LessonInfo
                    autoplay={{enabled: false}}
                    title={title}
                    instructor={instructor}
                    tags={tags}
                    description={description}
                    course={collection}
                    lesson={lesson}
                    playerState={playerState}
                    className="space-y-4 lg:space-y-6"
                  />
                </>
              )}
              <Tabs
                defaultIndex={
                  defaultView === 'comments' && commentsAvailable ? 1 : 0
                }
                onChange={(index) => {
                  setPlayerPrefs({
                    defaultView:
                      index === 1 && commentsAvailable
                        ? 'comments'
                        : 'transcript',
                  })
                }}
              >
                <TabList className="md:text-lg text-normal font-semibold bg-transparent space-x-1">
                  {transcriptAvailable && <Tab>Transcript</Tab>}
                  <Tab>Comments</Tab>
                </TabList>
                <TabPanels className="md:mt-6 mt-3">
                  {transcriptAvailable && (
                    <TabPanel>
                      <Transcript
                        className="prose sm:prose-lg max-w-none break-words"
                        player={playerRef}
                        playerAvailable={playerVisible}
                        playVideo={() => send('PLAY')}
                        initialTranscript={transcript}
                        enhancedTranscript={enhancedTranscript}
                      />
                    </TabPanel>
                  )}
                  {commentsAvailable && (
                    <TabPanel>
                      <div className="space-y-10">
                        {comments.map((comment: any) => (
                          <Comment
                            key={comment.id}
                            comment={comment.comment}
                            state={comment.state}
                            createdAt={comment.created_at}
                            isCommentableOwner={comment.is_commentable_owner}
                            user={comment.user}
                          />
                        ))}
                      </div>
                    </TabPanel>
                  )}
                </TabPanels>
              </Tabs>
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
  currentLessonSlug: string
}> = ({course, currentLessonSlug}) => {
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
                  lesson: currentLessonSlug,
                })
              }}
              className="hover:underline"
            >
              <h3 className="font-bold leading-tighter 2xl:text-lg">
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
          <ul className="grid grid-flow-col-dense gap-5 items-center text-sm">
            {tags.map((tag: any, index: number) => (
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
                      width={20}
                      height={20}
                      className="flex-shrink-0"
                    />
                    <span className="ml-1">{tag.label}</span>
                    {tag.version && (
                      <span className="ml-2">
                        <code>{tag.version}</code>
                      </span>
                    )}
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
