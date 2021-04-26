import React, {FunctionComponent, SyntheticEvent} from 'react'
import {GetServerSideProps} from 'next'
import {useRouter} from 'next/router'
import {isEmpty, get, first, isFunction, filter} from 'lodash'
import {useMachine} from '@xstate/react'
import {Tabs, TabList, Tab, TabPanels, TabPanel} from '@reach/tabs'
import {playerMachine} from 'machines/lesson-player-machine'

import EggheadPlayer, {useEggheadPlayer} from 'components/EggheadPlayer'
import {useEggheadPlayerPrefs} from 'components/EggheadPlayer/use-egghead-player'
import Transcript from 'components/pages/lessons/transcript'
import PlaybackSpeedSelect from 'components/pages/lessons/playback-speed-select'
import {loadBasicLesson, loadLesson} from 'lib/lessons'
import {useViewer} from 'context/viewer-context'
import {LessonResource} from 'types'
import {NextSeo, VideoJsonLd} from 'next-seo'
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
import RecommendNextStepOverlay from 'components/pages/lessons/overlay/recommend-next-step-overlay'
import Markdown from 'react-markdown'
import Link from 'next/link'
import {track} from 'utils/analytics'
import Eggo from 'components/icons/eggo'
import Image from 'next/image'
import cookieUtil from 'utils/cookies'
import useBreakpoint, {bpMinSM, bpMinMD} from 'utils/breakpoints'
import Share from 'components/share'
import LessonDownload from 'components/pages/lessons/lesson-download'
import {useNextForCollection} from 'hooks/use-next-up-data'
import CollectionLessonsList from 'components/pages/lessons/collection-lessons-list'
import CodeLink, {
  IconCode,
  IconGithub,
} from 'components/pages/lessons/code-link'
import getDependencies from 'data/courseDependencies'
import AutoplayToggle from 'components/pages/lessons/autoplay-toggle'
import useCio from 'hooks/use-cio'
import LevelUpCTA from '../../components/survey/level-up-cta'
import Comments from '../../components/pages/lessons/comments/comments'
import Spinner from 'components/spinner'
import {
  BigPlayButton,
  ClosedCaptionButton,
  ControlBar,
  CurrentTimeDisplay,
  DurationDisplay,
  ForwardControl,
  FullscreenToggle,
  HLSSource,
  PlaybackRateMenuButton,
  Player,
  PlayToggle,
  ProgressControl,
  RemainingTimeDisplay,
  ReplayControl,
  TimeDivider,
  VolumeMenuButton,
} from 'cueplayer-react'

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
    <div className="flex-grow bg-gray-800 text-white bg-opacity-90 flex flex-col items-center justify-center relative z-5 px-4 py-6">
      {children}
    </div>
  )
}

type LessonProps = {
  initialLesson: LessonResource
}

const MAX_FREE_VIEWS = 7

const Lesson: FunctionComponent<LessonProps> = ({initialLesson}) => {
  const router = useRouter()
  const {subscriber, cioIdentify} = useCio()
  const {viewer} = useViewer()
  const {
    setPlayerPrefs,
    playbackRate,
    defaultView,
    volumeRate,
    subtitle,
  } = useEggheadPlayerPrefs()

  const {sm, md} = useBreakpoint()

  const [isFullscreen, setIsFullscreen] = React.useState(false)

  const playerRef = React.useRef(null)
  const actualPlayerRef = React.useRef<any>(null)
  const lastAutoPlayed = React.useRef()

  const [playerState, send] = useMachine(playerMachine, {
    context: {
      lesson: initialLesson,
      viewer,
    },
  })

  const lesson: any = get(playerState, 'context.lesson', initialLesson)

  const {onProgress, onEnded, autoplay} = useEggheadPlayer(lesson)
  const [playerVisible, setPlayerVisible] = React.useState<boolean>(false)
  const [lessonView, setLessonView] = React.useState<any>()
  const [watchCount, setWatchCount] = React.useState<number>(0)
  const currentPlayerState = playerState.value as string

  const {clearResource, updateResource} = useLastResource({
    ...lesson,
    image_url: lesson.icon_url,
  })

  const {
    instructor,
    transcript,
    transcript_url,
    title,
    tags = [],
    description,
    collection,
    free_forever,
    slug,
    comments,
  } = lesson

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

  const spinnerVisible = ['loading', 'completed'].includes(currentPlayerState)

  React.useEffect(() => {
    setPlayerVisible(
      [
        'playing',
        'paused',
        'loading',
        'loaded',
        'viewing',
        'completed',
      ].includes(currentPlayerState),
    )
  }, [currentPlayerState])

  const checkAutoPlay = async () => {
    if (nextLesson) {
      updateResource(nextLesson)
    }

    console.debug(`checking autoplay: ${autoplay} [${nextLesson.slug}]`)

    if (autoplay && nextLesson) {
      console.debug('autoplaying next lesson', {nextLesson})
      track('autoplaying next video', {
        video: nextLesson.slug,
      })

      if (isFullscreen) {
        const loadedLesson = await loadLesson(nextLesson.slug)

        console.debug('full screen authed video loaded', {video: loadedLesson})

        router
          .push(nextLesson.path, undefined, {
            shallow: true,
          })
          .then(() => {
            send({
              type: 'LOADED',
              lesson: loadedLesson,
              viewer,
            })
          })
      } else {
        router.push(nextLesson.path)
      }
    } else if (nextLesson) {
      console.debug(`Showing Next Lesson Overlay`)
      send(`NEXT`)
    } else {
      console.debug(`Showing Recommend Overlay`)
      send(`RECOMMEND`)
    }
  }

  const completeVideo = (lessonView: any) => {
    console.debug('completed video', {lessonView, video: lesson})
    clearResource()
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
    const mediaPresent = Boolean(lesson?.hls_url || lesson?.dash_url)
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
        console.debug(
          `changed to viewing isFullscreen: ${isFullscreen} mediaPresent: ${mediaPresent}`,
        )
        if (!mediaPresent && !isFullscreen) {
          console.log(`sending load event from viewing`)
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
  }, [currentPlayerState])

  React.useEffect(() => {
    const handleRouteChange = () => {
      if (!autoplay) {
        send('LOAD')
      }
    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router.events, send])

  React.useEffect(() => {
    async function run() {
      console.debug('loading video with auth')
      const loadedLesson = await loadLesson(initialLesson.slug)
      console.debug('authed video loaded', {video: loadedLesson})

      send({
        type: 'LOADED',
        lesson: {...initialLesson, ...loadedLesson},
        viewer,
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

  const numberOfComments = filter(
    comments,
    (comment) => comment.state !== 'hidden',
  ).length

  return (
    <>
      <NextSeo
        description={removeMarkdown(description)}
        canonical={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${lesson.path}`}
        title={title}
        titleTemplate={'%s | egghead.io'}
        twitter={{
          handle: instructor?.twitter,
          site: `@eggheadio`,
          cardType: 'summary_large_image',
        }}
        openGraph={{
          title,
          url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${lesson.path}`,
          description: removeMarkdown(description),
          site_name: 'egghead',
          images: [
            {
              url: `https://og-image-react-egghead.now.sh/lesson/${slug}?v=20201027`,
            },
          ],
        }}
      />
      <VideoJsonLd
        name={title}
        description={removeMarkdown(description)}
        uploadDate={lesson?.created_at}
        thumbnailUrls={[lesson?.thumb_url]}
      />

      <div className="sm:space-y-8 space-y-6 w-full sm:pb-16 pb-8 dark:text-gray-100">
        <div className="bg-black -mt-3 sm:-mt-5 -mx-5 sm:border-b border-gray-100  dark:border-gray-800">
          <div className="w-full flex flex-col lg:flex-row justify-center items-center">
            <div
              className="flex-grow w-full min-w-[320px] sm:min-w-[580px] md:min-w-[680px]"
              css={{
                maxWidth: 'calc(75vh * 1.77777)',
              }}
            >
              <div
                className="flex justify-center relative bg-black"
                css={{
                  '::before': {
                    content: '""',
                    display: 'block',
                    width: 0,
                    height: 0,
                    paddingTop: '56.25%',
                  },
                }}
              >
                <div
                  className={`${
                    playerVisible ? 'block' : 'hidden'
                  } w-full lg:block absolute top-0 left-0 right-0 bottom-0`}
                >
                  <Player
                    id="egghead-player"
                    ref={playerRef}
                    crossOrigin="anonymous"
                    className="font-sans"
                    poster={lesson?.thumb_url}
                    volume={0.2}
                    onCanPlay={(event: SyntheticEvent) => {
                      console.debug(`player ready [autoplay:${autoplay}]`)
                      const player: HTMLVideoElement = event.target as HTMLVideoElement
                      player.volume = volumeRate / 100
                      player.playbackRate = playbackRate
                      actualPlayerRef.current = player
                      const isDifferent =
                        lastAutoPlayed.current !== lesson?.hls_url
                      if (autoplay && isDifferent && isFunction(player.play)) {
                        console.debug(`autoplaying`)
                        lastAutoPlayed.current = lesson?.hls_url
                        player.play()
                      }
                    }}
                    onPause={() => {
                      send('PAUSE')
                    }}
                    onPlay={() => send('PLAY')}
                    onTimeUpdate={(event: any) => {
                      onProgress(
                        {playedSeconds: event.target.currentTime},
                        lesson,
                      ).then((lessonView: any) => {
                        if (lessonView) {
                          console.debug('progress recorded', {
                            progress: lessonView,
                          })
                          setLessonView(lessonView)
                        }
                      })
                    }}
                    onEnded={() => {
                      console.debug(`received ended event from player`)
                      send('COMPLETE')
                    }}
                    onVolumeChange={(event: SyntheticEvent) => {
                      const player: HTMLVideoElement = event.target as HTMLVideoElement
                      setPlayerPrefs({volumeRate: player.volume * 100})
                    }}
                  >
                    {lesson?.hls_url && (
                      <HLSSource
                        key={lesson?.hls_url}
                        isVideoChild
                        src={lesson?.hls_url}
                      />
                    )}
                    <track
                      key={lesson?.subtitles_url}
                      src={lesson?.subtitles_url}
                      kind="subtitles"
                      srcLang="en"
                      label="English"
                      default={subtitle?.language === 'en'}
                    />
                    <BigPlayButton position="center" />
                    {!sm && (
                      <ControlBar disableDefaultControls>
                        <PlayToggle key="play-toggle" order={1} />

                        <ProgressControl key="progress-control" order={8} />
                        <RemainingTimeDisplay
                          key="remaining-time-display"
                          order={9}
                        />
                        <ReplayControl key="replay-control" order={2} />
                        <ForwardControl key="forward-control" order={3} />
                        <VolumeMenuButton key="volume-menu-button" order={4} />
                        <CurrentTimeDisplay
                          key="current-time-display"
                          order={5}
                        />
                        <TimeDivider key="time-divider" order={6} />
                        <DurationDisplay key="duration-display" order={7} />
                        <PlaybackRateMenuButton
                          className="hidden"
                          key="playback-rate"
                          order={10}
                          selected={playbackRate}
                          onChange={(playbackRate: number) => {
                            setPlayerPrefs({playbackRate})
                          }}
                        />
                        {lesson?.subtitles_url && (
                          <ClosedCaptionButton
                            key={lesson?.subtitles_url}
                            order={11}
                            selected={subtitle}
                            onChange={(track: TextTrack) => {
                              console.log(track)
                              setPlayerPrefs({
                                subtitle: {
                                  id: track.id,
                                  kind: track.kind,
                                  label: track.label,
                                  language: track.language,
                                },
                              })
                            }}
                          />
                        )}
                        <FullscreenToggle key="fullscreen-toggle" order={12} />
                      </ControlBar>
                    )}
                  </Player>
                </div>

                {spinnerVisible && (
                  <div className="flex justify-center items-center absolute z-10 top-0 right-0 bottom-0 left-0 bg-black bg-opacity-80">
                    <Spinner />
                  </div>
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
                      nextLesson={nextLesson}
                      onClickRewatch={() => {
                        send('VIEW')
                        if (actualPlayerRef.current) {
                          actualPlayerRef.current.play()
                        }
                      }}
                    />
                  </OverlayWrapper>
                )}
                {playerState.matches('rating') && (
                  <OverlayWrapper>
                    <RateCourseOverlay
                      course={lesson.collection}
                      onRated={(review) => {
                        axios
                          .post(lessonView.collection_progress.rate_url, review)
                          .then(() => {
                            const comment = get(review, 'comment.comment')
                            const prompt = get(review, 'comment.context.prompt')

                            if (review) {
                              track('rated course', {
                                course: slug,
                                rating: review.rating,
                                ...(comment && {comment}),
                                ...(!!prompt && {prompt}),
                              })
                              if (subscriber) {
                                const currentScore =
                                  Number(
                                    subscriber.attributes?.learner_score,
                                  ) || 0
                                cioIdentify(subscriber.id, {
                                  learner_score: currentScore + 20,
                                })
                              }
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
              <div className="flex justify-between items-center w-full border-t border-gray-800 pl-2 3xl:pl-0 pr-3 3xl:pr-4 py-2">
                <div className="flex items-center justify-start flex-grow space-x-4">
                  <LessonDownload lesson={lesson} />
                </div>
                <div className="flex items-center justify-end flex-grow space-x-4">
                  <AutoplayToggle
                    enabled={true}
                    onDark={true}
                    player={actualPlayerRef.current}
                  />
                </div>
              </div>
            </div>
            {collection && collection?.lessons && (
              <div className="flex flex-shrink-0 bg-white flex-col w-full lg:w-3/12 2xl:w-1/5 self-stretch dark:text-gray-100 dark:bg-gray-900">
                {!md && (
                  <div className="p-4 sm:border-b border-gray-100 dark:border-gray-800">
                    <Course
                      course={collection}
                      currentLessonSlug={lesson.slug}
                    />
                  </div>
                )}
                <div className="relative h-full px-4 lg:px-0 py-3 lg:py-0">
                  <div className="lg:absolute top-0 bottom-0 left-0 right-0">
                    <CollectionLessonsList
                      course={collection}
                      currentLessonSlug={lesson.slug}
                      progress={lessonView?.collection_progress}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div
            className={`grid lg:grid-cols-1 max-w-screen-lg lg:gap-12 gap-8 grid-cols-1 mx-auto divide-y md:divide-transparent divide-gray-50`}
          >
            <div className="md:col-span-8 md:row-start-1 row-start-1 space-y-6 md:space-y-8 lg:space-y-10">
              <div className="space-y-4 sm:pb-8 pb-2 sm:pt-6 pt-0">
                <LevelUpCTA />
                {title && (
                  <h1 className="font-extrabold leading-tight text-xl lg:text-3xl">
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
                        className="flex flex-col items-end "
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
                {description && (
                  <Markdown className="prose prose-lg dark:prose-dark max-w-none font-medium text-gray-1000 dark:text-white">
                    {description}
                  </Markdown>
                )}
                {(lesson?.code_url || lesson?.repo_url) && (
                  <div className="sm:text-base dark:text-gray-100 text-sm sm:pt-2 w-full flex sm:items-center sm:flex-row flex-col sm:space-x-6 sm:space-y-0 space-y-2">
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
                        View code for this lesson
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
                        View code on GitHub
                      </CodeLink>
                    )}
                  </div>
                )}
              </div>
              {md && (
                <div className="py-4">
                  <Course course={collection} currentLessonSlug={lesson.slug} />
                </div>
              )}
              <Tabs
                index={defaultView === 'comments' ? 1 : 0}
                onChange={(index) => {
                  setPlayerPrefs({
                    defaultView: index === 1 ? 'comments' : 'transcript',
                  })
                }}
              >
                <TabList>
                  {transcriptAvailable && <Tab>Transcript</Tab>}
                  <Tab>
                    Comments{' '}
                    <span className="text-sm">({numberOfComments})</span>
                  </Tab>
                </TabList>
                <TabPanels className="bg-gray-50 dark:bg-gray-1000 sm:p-8 p-5 sm:mx-0 -mx-5 rounded-lg rounded-tl-none">
                  {transcriptAvailable && (
                    <TabPanel>
                      <Transcript
                        player={playerRef}
                        playerAvailable={playerVisible}
                        playVideo={() => send('PLAY')}
                        initialTranscript={transcript}
                        enhancedTranscript={enhancedTranscript}
                      />
                    </TabPanel>
                  )}
                  <TabPanel>
                    <div
                      className="space-y-6 sm:space-y-8"
                      css={{wordBreak: 'break-word'}}
                    >
                      <Comments
                        lesson={lesson}
                        commentingAllowed={viewer?.can_comment}
                      />
                    </div>
                  </TabPanel>
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
          <h4 className="text-gray-700 dark:text-gray-100 font-semibold mb-px text-xs uppercase">
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
