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
import CreateAccountCTA from 'components/pages/lessons/create-account-cta'
import JoinCTA from 'components/pages/lessons/join-cta'
import NextUpOverlay from 'components/pages/lessons/overlay/next-up-overlay'
import CoursePitchOverlay from 'components/pages/lessons/overlay/course-pitch-overlay'
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
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
    return {
      props: {
        initialLesson,
      },
    }
  }
}

type LessonProps = {
  initialLesson: LessonResource
}

const MAX_FREE_VIEWS = 7

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

  React.useEffect(() => {
    //TODO: We are doing work here that the lesson machine should
    //be handling but we don't have enough information in the context
    console.debug(`current state of player:`, currentPlayerState)
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
  }, [currentPlayerState])

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

      <div className="-mx-5 -mt-3 sm:-mt-5 overflow-hidden">
        <PlayerProvider>
          <div
            className="relative grid grid-cols-1 lg:grid-cols-12 font-sans text-base w-full mx-auto lg:min-w-[1024px] gap-6 lg:gap-0"
            css={{
              maxWidth: 'calc((75vh * 1.77777) + 300px)',
            }}
          >
            <div
              className={`relative before:float-left after:clear-both after:table ${
                isFullscreen ? 'lg:col-span-12' : 'lg:col-span-9'
              }`}
              css={{
                ':before': {
                  paddingBottom: `calc(56.25% + ${
                    isEmpty(lesson.staff_notes_url) ? '3.5rem' : '4.5rem'
                  })`,
                },
              }}
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
              {playerState.matches('pitchingCourse') && (
                <OverlayWrapper>
                  <CoursePitchOverlay
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
                <div className="absolute z-20 inset-0 bg-black/50 flex justify-center items-center">
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
                videoResource={lesson}
                onAddNote={() => send('ADD_NOTE')}
              />
            </div>
          </div>
        </PlayerProvider>
      </div>

      <div className="grid lg:grid-cols-1 max-w-screen-lg lg:gap-12 gap-8 grid-cols-1 mx-auto divide-y md:divide-transparent divide-gray-50">
        <div className="md:col-span-8 md:row-start-1 row-start-1 space-y-6 md:space-y-8 lg:space-y-10">
          <div className="space-y-4 sm:pb-8 pb-2 pt-6">
            {title && (
              <h1 className="font-extrabold leading-tight text-xl lg:text-3xl">
                {title}
              </h1>
            )}
            <div className="pt-4 flex lg:flex-row flex-col w-full justify-between flex-wrap lg:space-x-8 lg:space-y-0 space-y-5 lg:items-center">
              <div className="md:w-auto w-full flex justify-between items-center space-x-5">
                {instructor && (
                  <div className="flex items-center flex-shrink-0">
                    <Link href={`/instructors/${get(instructor, 'slug', '#')}`}>
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
                          href={`/instructors/${get(instructor, 'slug', '#')}`}
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
            <div className="opacity-80 mt-4 text-sm flex flex-col items-center md:items-start">
              {created_at && (
                <PublishedAt date={friendlyTime(new Date(created_at))} />
              )}
              {updated_at && (
                <UpdatedAt date={friendlyTime(new Date(updated_at))} />
              )}
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
            <TabPanels className="bg-gray-50 dark:bg-gray-1000 sm:p-8 p-5 sm:mx-0 -mx-5 rounded-lg rounded-tl-none">
              {transcriptAvailable && (
                <TabPanel>
                  <Transcript
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

const Tags: React.FC<{tags: any; lesson: any}> = ({tags, lesson}) => {
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
