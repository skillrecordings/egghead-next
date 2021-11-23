import * as React from 'react'
import {GetServerSideProps} from 'next'
import {useRouter} from 'next/router'
import {filter, first, get, isEmpty, isFunction} from 'lodash'
import {useMachine} from '@xstate/react'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from '@reach/tabs'
import {playerMachine} from 'machines/lesson-player-machine'
import {useEggheadPlayer} from 'components/EggheadPlayer'
import {useEggheadPlayerPrefs} from 'components/EggheadPlayer/use-egghead-player'
import Transcript from 'components/pages/lessons/transcript'
import {loadBasicLesson, loadLesson} from 'lib/lessons'
import {useViewer} from 'context/viewer-context'
import {LessonResource, VideoResource} from 'types'
import {NextSeo, VideoJsonLd} from 'next-seo'
import removeMarkdown from 'remove-markdown'
import getTracer from 'utils/honeycomb-tracer'
import {setupHttpTracing} from 'utils/tracing-js/dist/src/index'
import RateCourseOverlay from 'components/pages/lessons/overlay/rate-course-overlay'
import AddNoteOverlay from 'components/pages/lessons/overlay/add-note-overlay'
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
import useBreakpoint from 'utils/breakpoints'
import Share from 'components/share'
import {useNextForCollection} from 'hooks/use-next-up-data'
import CodeLink, {
  IconCode,
  IconGithub,
} from 'components/pages/lessons/code-link'
import getDependencies from 'data/courseDependencies'
import useCio from 'hooks/use-cio'
import Comments from 'components/pages/lessons/comments/comments'
import Spinner from 'components/spinner'
import {PlayerProvider} from 'cueplayer-react'
import VideoResourcePlayer from 'components/player'
import PlayerContainer from 'components/player/player-container'
import PlayerSidebar from 'components/player/player-sidebar'
import OverlayWrapper from 'components/pages/lessons/overlay/wrapper'
import friendlyTime from 'friendly-time'
import {PublishedAt, UpdatedAt} from 'components/layouts/collection-page-layout'
import GoProCtaOverlay from 'components/pages/lessons/overlay/go-pro-cta-overlay'
import WatchFullCourseCtaOverlay from '../../components/pages/lessons/overlay/watch-full-course-cta-overlay'
import WatchNextLessonCtaOverlay from '../../components/pages/lessons/overlay/watch-next-lesson-cta-overlay'
import EmailCaptureCtaOverlay from '../../components/pages/lessons/overlay/email-capture-cta-overlay'

const tracer = getTracer('lesson-page')

const specialLessons: any = {
  'javascript-3-ways-to-update-the-content-of-an-array-of-objects-with-javascript':
    {
      headline: 'Check out these in-depth courses on JavaScript Arrays',
      linksTo: [
        {
          title: 'Understand JavaScript Arrays',
          isPro: true,
          path: 'understand-javascript-arrays',
          type: 'course',
          imageUrl:
            'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/714/square_480/EGH_JSarrays.png',
        },
        {
          title: 'Reduce Data with Javascript Array#reduce',
          isPro: true,
          path: 'reduce-data-with-javascript-array-reduce',
          type: 'course',
          imageUrl:
            'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/557/square_480/EGH_ReduceDataJS.png',
        },
      ],
    },

  'javascript-creating-demo-apis-with-json-server': {
    headline: 'Build better APIs with these in-depth courses',
    linksTo: [
      {
        title: 'Build a Serverless API with Cloudflare Workers',
        isPro: false,
        slug: 'build-a-serverless-api-with-cloudflare-workers-d67ca551',
        type: 'course',
        imageUrl:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/441/045/square_480/EGH_cloudflare-workers_424_2x.png',
      },
      {
        title: 'Building an API with Express',
        isPro: true,
        slug: 'building-an-api-with-express-f1ea',
        type: 'course',
        imageUrl:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/359/square_480/expressjslogo.png',
      },
    ],
  },
}

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  res,
  params,
}) {
  setupHttpTracing({name: getServerSideProps.name, tracer, req, res})

  try {
    const initialLesson: LessonResource | undefined =
      params && (await loadBasicLesson(params.slug as string))

    if (initialLesson && initialLesson?.slug !== params?.slug) {
      res.setHeader('Location', initialLesson.path)
      res.statusCode = 302
      res.end()
      return {props: {}}
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
    res.setHeader('Location', '/')
    res.statusCode = 307
    res.end()
    return {props: {}}
  }
}

type LessonProps = {
  initialLesson: LessonResource
}

const MAX_FREE_VIEWS = 4

const Lesson: React.FC<LessonProps> = ({initialLesson}) => {
  const router = useRouter()
  const {subscriber, cioIdentify} = useCio()
  const {viewer} = useViewer()
  const {setPlayerPrefs, getPlayerPrefs} = useEggheadPlayerPrefs()

  const {defaultView, autoplay} = getPlayerPrefs()

  const {md} = useBreakpoint()

  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [newNotes, setNewNotes] = React.useState<any>([])

  const playerContainer = React.useRef<any>(null)
  const actualPlayerRef = React.useRef<any>(null)
  const lastAutoPlayed = React.useRef()

  const [playerState, send] = useMachine(playerMachine, {
    context: {
      lesson: initialLesson,
      viewer,
    },
  })

  const lesson: any = get(playerState, 'context.lesson', initialLesson)

  const {onProgress, onEnded} = useEggheadPlayer(lesson)
  const [playerVisible, setPlayerVisible] = React.useState<boolean>(false)
  const [lessonView, setLessonView] = React.useState<any>()
  const [watchCount, setWatchCount] = React.useState<number>(0)

  const currentPlayerState = playerState.value as string

  const [isIncomingAnonViewer, setIsIncomingAnonViewer] =
    React.useState<boolean>(false)

  React.useEffect(() => {
    function run() {
      const storage = window?.sessionStorage
      if (!storage) return

      const prevPath = storage.getItem('prevPath')

      if (isEmpty(prevPath) && !subscriber && !viewer) {
        setIsIncomingAnonViewer(true)
      } else {
        setIsIncomingAnonViewer(false)
      }
    }

    setTimeout(run, 750)
  }, [subscriber, viewer])

  const {clearResource, updateResource} = useLastResource({
    ...lesson,
    image_url: lesson.icon_url,
  })

  const {
    instructor,
    transcript,
    transcript_url,
    title,
    created_at,
    updated_at,
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
        'addingNote',
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
    } else if (lesson.collection && isIncomingAnonViewer) {
      send(`COURSE_PITCH`)
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
        console.debug('presenting opportunity to rate course', {
          lessonView,
          video: lesson,
        })
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

  const {session_id} = router.query

  React.useEffect(() => {
    //TODO: We are doing work here that the lesson machine should
    //be handling but we don't have enough information in the context
    console.debug(`current state of player:`, currentPlayerState)
    const lesson = get(playerState, 'context.lesson')
    const mediaPresent = Boolean(lesson?.hls_url || lesson?.dash_url)
    switch (currentPlayerState) {
      case 'loaded':
        const viewLimitNotReached = watchCount < MAX_FREE_VIEWS

        // TODO: Detangle this nested series of `if` statements to make the
        // logic more immediately easy to reason about.

        if (session_id) {
          // If the URL contains the session ID, even if there is a viewer, put
          // them in the `subscribing` state.
          send('SUBSCRIBE')
        } else {
          if (isEmpty(viewer) && free_forever) {
            if (viewLimitNotReached && mediaPresent) {
              send('VIEW')
            } else {
              send('JOIN')
            }
          } else if (mediaPresent) {
            send('VIEW')
          } else {
            // If lesson is not 'free_forever' and the media isn't present,
            // then we deduce that the lesson is Pro-only and the user needsto
            // subscribe before viewing it.
            send('SUBSCRIBE')
          }
        }

        break
      case 'viewing':
        console.debug(
          `changed to viewing isFullscreen: ${isFullscreen} mediaPresent: ${mediaPresent}`,
        )
        if (!mediaPresent && !isFullscreen) {
          console.debug(`sending load event from viewing`)
          send('LOAD')
        }
        break
      case 'completed':
        console.debug('handling a change to completed', {
          lesson,
          lessonView,
          isIncomingAnonViewer,
        })
        onEnded(lesson)
          .then((lessonView: any) => {
            if (lessonView) {
              setLessonView(lessonView)
              completeVideo(lessonView)
            } else if (lesson.collection && isIncomingAnonViewer) {
              send(`COURSE_PITCH`)
            } else if (nextLesson) {
              console.debug(`Showing Next Lesson Overlay`)
              checkAutoPlay()
            } else {
              console.debug(`Showing Recommend Overlay`)
              send(`RECOMMEND`)
            }
          })
          .catch(() => {
            if (lessonView) {
              completeVideo(lessonView)
            } else if (lesson.collection && isIncomingAnonViewer) {
              send(`COURSE_PITCH`)
            } else if (nextLesson) {
              console.debug(`Showing Next Lesson Overlay`)
              checkAutoPlay()
            } else {
              console.debug(`Showing Recommend Overlay`)
              send(`RECOMMEND`)
            }
          })

        break
    }
  }, [currentPlayerState, session_id])

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

    send({
      type: 'LOAD',
      lesson: initialLesson,
      viewer,
    })

    run()
  }, [initialLesson.slug])

  // TODO: Temporary duplication of the above useEffect to ensure the lesson is
  // loaded when transitioning from the 'subscribing'/Thank You overlay to
  // watching the lesson. If this loading process was moved into the machine as
  // an Invoked Callback, then state transitions could be employed to handle
  // what the useEffects are doing.
  React.useEffect(() => {
    // only execute the contents of this effect if the machine is in the
    // process of loading. Any other Player Machine state change should bail
    // early.
    if (currentPlayerState !== 'loading') return

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

    send({
      type: 'LOAD',
      lesson: initialLesson,
      viewer,
    })

    run()
  }, [currentPlayerState])

  const numberOfComments = filter(
    comments,
    (comment) => comment.state !== 'hidden',
  ).length

  return (
    <>
      <style jsx>
        {`
          .player-provider {
            max-width: calc((75vh * 1.77777) + 300px);
          }
          .player-wrapper::before {
            padding-bottom: ${isEmpty(lesson.staff_notes_url)
              ? 'calc(56.25% + 3.5rem)'
              : 'calc(56.25% + 4.5rem)'};
          }
        `}
      </style>
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

      <div className="overflow-hidden">
        <PlayerProvider>
          <div className="player-provider relative grid grid-cols-1 lg:grid-cols-12 font-sans text-base w-full mx-auto lg:min-w-[1024px] gap-6 lg:gap-0">
            <div
              className={`player-wrapper relative before:float-left after:clear-both after:table ${
                isFullscreen ? 'lg:col-span-12' : 'lg:col-span-9'
              }`}
            >
              <PlayerContainer ref={playerContainer}>
                <VideoResourcePlayer
                  key={lesson.slug}
                  containerRef={playerContainer}
                  actualPlayerRef={actualPlayerRef.current}
                  videoResource={lesson}
                  hidden={!playerVisible}
                  onFullscreenChange={(isFullscreen: boolean) => {
                    setIsFullscreen(isFullscreen)
                  }}
                  newNotes={newNotes}
                  onCanPlay={(event: any) => {
                    console.debug(`player ready [autoplay:${autoplay}]`)
                    const videoElement: HTMLVideoElement =
                      event.target as HTMLVideoElement

                    actualPlayerRef.current = videoElement

                    const isDifferent =
                      lastAutoPlayed.current !== lesson?.hls_url
                    if (
                      autoplay &&
                      isDifferent &&
                      isFunction(videoElement.play)
                    ) {
                      console.debug(`autoplaying`)
                      lastAutoPlayed.current = lesson?.hls_url
                      videoElement.play()
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
                  onAddNote={() => {
                    send('ADD_NOTE')
                  }}
                />
              </PlayerContainer>
              {spinnerVisible && (
                <div className="absolute top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center bg-black bg-opacity-80">
                  <Spinner />
                </div>
              )}

              {playerState.matches('joining') && (
                <OverlayWrapper>
                  <EmailCaptureCtaOverlay
                    lesson={lesson}
                    technology={primary_tag}
                  />
                </OverlayWrapper>
              )}
              {playerState.matches('subscribing') && (
                <OverlayWrapper>
                  <GoProCtaOverlay
                    lesson={lesson}
                    viewLesson={() => {
                      send({
                        type: 'LOAD',
                        lesson: initialLesson,
                        viewer,
                      })
                    }}
                  />
                </OverlayWrapper>
              )}
              {playerState.matches('pitchingCourse') && (
                <OverlayWrapper>
                  <WatchFullCourseCtaOverlay
                    lesson={lesson}
                    onClickRewatch={() => {
                      send('VIEW')
                      if (actualPlayerRef.current) {
                        actualPlayerRef.current.play()
                      }
                    }}
                  />
                </OverlayWrapper>
              )}
              {playerState.matches('showingNext') && (
                <OverlayWrapper>
                  <WatchNextLessonCtaOverlay
                    lesson={lesson}
                    nextLesson={nextLesson}
                    ctaContent={specialLessons[lesson.slug]}
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
                                Number(subscriber.attributes?.learner_score) ||
                                0
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
              {playerState.matches('addingNote') && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
                  <AddNoteOverlay
                    resourceId={lesson.slug}
                    onClose={(newNote: any) => {
                      if (newNote) setNewNotes([newNote])
                      send('VIEW')
                    }}
                    currentTime={Math.floor(
                      actualPlayerRef.current?.currentTime ?? 0,
                    )}
                  />
                </div>
              )}
            </div>
            <div className="lg:col-span-3 side-bar">
              <PlayerSidebar
                relatedResources={specialLessons[lesson.slug]}
                videoResource={lesson}
                onAddNote={() => send('ADD_NOTE')}
              />
            </div>
          </div>
        </PlayerProvider>
      </div>

      <div className="container max-w-screen-lg py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 divide-y lg:grid-cols-1 lg:gap-12 md:divide-transparent divide-gray-50">
          <div className="row-start-1 space-y-6 md:col-span-8 md:row-start-1 md:space-y-8 lg:space-y-10">
            <div className="pb-2 space-y-4 sm:pb-8">
              {title && (
                <h1 className="text-xl font-extrabold leading-tight lg:text-3xl">
                  {title}
                </h1>
              )}
              <div className="flex flex-col flex-wrap justify-between w-full pt-4 space-y-5 lg:flex-row lg:space-x-8 lg:space-y-0 lg:items-center">
                <div className="flex items-center justify-between w-full space-x-5 md:w-auto">
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
                          className="flex mr-2 itemes-center"
                        >
                          {get(instructor, 'avatar_64_url') ? (
                            <Image
                              width={48}
                              height={48}
                              src={instructor.avatar_64_url}
                              alt={instructor.full_name}
                              className="m-0 rounded-full"
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
                  <div className="flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-2">
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
              <div className="flex flex-col items-center mt-4 text-sm opacity-80 md:items-start">
                {created_at && (
                  <PublishedAt date={friendlyTime(new Date(created_at))} />
                )}
                {updated_at && (
                  <UpdatedAt date={friendlyTime(new Date(updated_at))} />
                )}
              </div>
              {description && (
                <Markdown className="font-medium prose prose-lg dark:prose-dark max-w-none text-gray-1000 dark:text-white">
                  {description}
                </Markdown>
              )}
              {(lesson?.code_url || lesson?.repo_url) && (
                <div className="flex flex-col w-full space-y-2 text-sm sm:text-base dark:text-gray-100 sm:pt-2 sm:items-center sm:flex-row sm:space-x-6 sm:space-y-0">
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
            <div>
              {md && (
                <div className="py-4">
                  <Course course={collection} currentLessonSlug={lesson.slug} />
                </div>
              )}
            </div>
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
                  Comments <span className="text-sm">({numberOfComments})</span>
                </Tab>
              </TabList>
              <TabPanels className="p-5 rounded-lg rounded-tl-none bg-gray-50 dark:bg-gray-1000 sm:p-8">
                {transcriptAvailable && (
                  <TabPanel>
                    <Transcript
                      initialTranscript={transcript}
                      enhancedTranscript={enhancedTranscript}
                    />
                  </TabPanel>
                )}
                <TabPanel>
                  <div className="space-y-6 sm:space-y-8 break-[break-word]">
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
    </>
  )
}

const LessonPage: React.FC<{initialLesson: VideoResource}> = ({
  initialLesson,
  ...props
}) => {
  return <Lesson initialLesson={initialLesson} {...props} />
}

export default LessonPage

const Course: React.FC<{
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
          <a className="relative flex-shrink-0 block w-12 h-12 lg:w-20 lg:h-20">
            <Image
              src={course.square_cover_480_url}
              alt={`illustration for ${course.title}`}
              layout="fill"
            />
          </a>
        </Link>
        <div className="ml-2 lg:ml-4">
          <h4 className="mb-px text-xs font-semibold text-gray-700 uppercase dark:text-gray-100">
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

const Tags: React.FC<{tags: any; lesson: any}> = ({tags, lesson}) => {
  return (
    <>
      {!isEmpty(tags) && (
        <div className="flex items-center space-x-4">
          {/* <div className="font-medium">Tech used:</div> */}
          <ul className="grid items-center grid-flow-col-dense gap-5 text-sm">
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
                    className="inline-flex items-center hover:underline"
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
