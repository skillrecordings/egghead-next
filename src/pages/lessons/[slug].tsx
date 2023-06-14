import * as React from 'react'
import {GetServerSideProps} from 'next'
import {useRouter} from 'next/router'
import {filter, get, isEmpty, compact} from 'lodash'
import queryString from 'query-string'
import {useMachine} from '@xstate/react'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from '@reach/tabs'
import {lessonMachine} from 'machines/lesson-machine'
import {useEggheadPlayer} from 'components/EggheadPlayer'
import Course from 'components/pages/lessons/course'
import Overlays from 'components/pages/lessons/overlays'
import specialLessons from 'components/pages/lessons/special-lessons'
import Tags from 'components/pages/lessons/tags'
import Transcript from 'components/pages/lessons/transcript'
import {loadLesson} from 'lib/lessons'
import {useViewer} from 'context/viewer-context'
import {LessonResource, VideoResource} from 'types'
import {NextSeo, VideoJsonLd} from 'next-seo'
import removeMarkdown from 'remove-markdown'
import getTracer from 'utils/honeycomb-tracer'
import {setupHttpTracing} from 'utils/tracing-js/dist/src/index'
import {useEnhancedTranscript} from 'hooks/use-enhanced-transcript'
import useLastResource from 'hooks/use-last-resource'
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
import DownloadControl from 'components/player/download-control'
import useCio from 'hooks/use-cio'
import Comments from 'components/pages/lessons/comments/comments'
import PlayerSidebar from 'components/player/player-sidebar'
import friendlyTime from 'friendly-time'
import {PublishedAt, UpdatedAt} from 'components/layouts/collection-page-layout'
import cookies from 'utils/cookies'
import AutoplayControl from '../../components/player/autoplay-control'
import {
  Player,
  usePlayerPrefs,
  VideoProvider,
  HLSSource,
  useVideo,
  selectWithSidePanel,
  selectMetadataTracks,
  selectIsPaused,
  selectVideo,
  selectIsWaiting,
  selectHasEnded,
  selectIsFullscreen,
  selectViewer,
  selectResource,
} from '@skillrecordings/player'
import cx from 'classnames'
import {
  VideoEvent,
  VideoStateContext,
} from '@skillrecordings/player/dist/machines/video-machine'
import {useSelector} from '@xstate/react'
import {addCueNote, deleteCueNote} from '../../lib/notes'
import {CheckCircleIcon as CheckCircleIconOutline} from '@heroicons/react/outline'
import {CheckCircleIcon} from '@heroicons/react/solid'
import {trpc} from 'trpc/trpc.client'
import {LessonProgress} from 'lib/progress'

const tracer = getTracer('lesson-page')

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  res,
  params,
}) {
  setupHttpTracing({name: getServerSideProps.name, tracer, req, res})

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

type LessonProps = {
  state: any
  initialLesson: VideoResource
  watchCount: number
  setWatchCount: (value: number) => void
}

const MAX_FREE_VIEWS = 4

const notesEnabled = process.env.NEXT_PUBLIC_NOTES_ENABLED === 'true'

const Lesson: React.FC<LessonProps> = ({
  initialLesson,
  state,
  watchCount,
  setWatchCount,
}) => {
  const router = useRouter()
  const {subscriber, cioIdentify} = useCio()

  const videoService = useVideo()
  const video = useSelector(videoService, selectVideo)

  // see all state changes
  // @ts-ignore
  // videoService.onTransition((state) => {
  //   console.debug(state.value)
  // })

  const {setPlayerPrefs, getPlayerPrefs} = usePlayerPrefs()
  const {autoplay, defaultView, subtitle} = getPlayerPrefs()
  const withSidePanel = useSelector(videoService, selectWithSidePanel)
  const metadataTracks = useSelector(videoService, selectMetadataTracks)
  const isWaiting = useSelector(videoService, selectIsWaiting)
  const hasEnded = useSelector(videoService, selectHasEnded)
  const isPaused = useSelector(videoService, selectIsPaused)
  const isFullscreen = useSelector(videoService, selectIsFullscreen)
  const viewer: any = useSelector(videoService, selectViewer)

  const {md} = useBreakpoint()

  const [lessonState, send] = state

  const lesson: any = lessonState.context.lesson

  const {onProgress, onEnded} = useEggheadPlayer(lesson)
  const [playerVisible, setPlayerVisible] = React.useState<boolean>(false)
  const [lessonView, setLessonView] = React.useState<any>()

  const currentLessonState = lessonState.value as string

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

  const instructorPagePath = `/q/resources-by-${get(instructor, 'slug', '#')}`

  const nextLesson = useNextForCollection(collection, lesson.slug)
  const enhancedTranscript = useEnhancedTranscript(transcript_url)
  const transcriptAvailable = transcript || enhancedTranscript
  const {session_id} = router.query

  const getProgress = (lessonView: any) => {
    if (lessonView?.collection_progress) {
      return lessonView.collection_progress
    }
  }

  const spinnerVisible = ['loading', 'completed'].includes(currentLessonState)

  const {data} = trpc.progress.forLesson.useQuery<LessonProgress>({
    slug: lesson.slug,
  })

  const [lessonCompleted, setLessonCompleted] = React.useState<boolean>(false)

  React.useEffect(() => {
    const completed = data?.lessonProgress?.completed
    if (completed) {
      setLessonCompleted(completed)
    }
  }, [data?.lessonProgress?.completed])

  const trpcUtils = trpc.useContext()

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
        'showingNext',
        'offeringSearch',
      ].includes(currentLessonState),
    )
  }, [currentLessonState])

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
      router.push(nextLesson.slug)
    } else if (lesson.collection && isIncomingAnonViewer) {
      console.debug(`Showing Offer Search Overlay`)
      send(`OFFER_SEARCH`)
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
        videoService.send({type: 'EXIT_FULLSCREEN'})
      }

      if (!hasNextLesson && progress?.rate_url) {
        console.debug('presenting opportunity to rate course', {
          lessonView,
          video: lesson,
        })
        console.debug('RATE')
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

  const numberOfComments = filter(
    comments,
    (comment) => comment.state !== 'hidden',
  ).length

  React.useEffect(() => {
    //TODO: We are doing work here that the lesson machine should
    //be handling but we don't have enough information in the context
    console.debug(`current state of lesson:`, currentLessonState)
    const lesson = get(lessonState, 'context.lesson')
    const mediaPresent = Boolean(lesson?.hls_url || lesson?.dash_url)
    const initialMediaPresent = Boolean(
      initialLesson?.hls_url || initialLesson?.dash_url,
    )

    switch (currentLessonState) {
      case 'loaded':
        const viewLimitNotReached = watchCount < MAX_FREE_VIEWS
        // TODO: Detangle this nested series of `if` statements to make the
        // logic more immediately easy to reason about.

        if (session_id) {
          // If the URL contains the session ID, even if there is a viewer, put
          // them in the `subscribing` state.
          console.debug('SUBSCRIBE')
          send('SUBSCRIBE')
        } else {
          if (
            isEmpty(viewer) &&
            isEmpty(cookies.get('customer')) &&
            free_forever
          ) {
            if (viewLimitNotReached && mediaPresent) {
              console.debug('VIEW')
              send('VIEW')
            } else {
              console.debug('JOIN')
              send('JOIN')
            }
          } else if (mediaPresent) {
            console.debug('VIEW')
            send('VIEW')
          } else {
            // If lesson is not 'free_forever' and the media isn't present,
            // then we deduce that the lesson is Pro-only and the user needsto
            // subscribe before viewing it.
            console.debug('SUBSCRIBE')
            send('SUBSCRIBE')
          }
        }
        break

      case 'viewing':
        console.debug(
          `changed to viewing isFullscreen: ${isFullscreen} mediaPresent: ${mediaPresent}`,
        )
        if (!initialMediaPresent && mediaPresent) {
          videoService.send({
            type: 'LOAD_RESOURCE',
            resource: lesson,
          })
        }
        if (!mediaPresent && !isFullscreen) {
          console.debug(`sending load event from viewing`)
          console.debug('LOAD')
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
              console.debug('OFFER_SEARCH')
              send(`OFFER_SEARCH`)
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
              console.debug('OFFER_SEARCH')
              send(`OFFER_SEARCH`)
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
  }, [currentLessonState, session_id])

  React.useEffect(() => {
    // Keep lesson machine state in sync with
    // videoService to control overlays and stuff
    if (!isWaiting) {
      hasEnded && send('COMPLETE')
      isPaused ? send('PAUSE') : send('PLAY')
    }
  }, [hasEnded, isPaused, isWaiting])

  React.useEffect(() => {
    // Load the video resource
    send({type: 'LOAD', lesson: initialLesson})
    videoService.send({
      type: 'LOAD_RESOURCE',
      resource: initialLesson,
    })
    // Focus the video element to allow keyboard shortcuts to work right away
    videoService.send('ACTIVITY')
  }, [initialLesson.slug])

  const play = () => {
    const playPromise = video?.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          video?.play()
          videoService.send({type: 'PLAY'})
        })
        .catch((e: any) => console.error(`PLAY failed: ${e}`))
    }
  }

  React.useEffect(() => {
    // Autoplay
    if (autoplay && !isWaiting) {
      play()
    }
  }, [isWaiting, video])

  const fullscreenWrapperRef = React.useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = React.useState<boolean>(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    // Record progress
    const recordProgress = (e: any) => {
      const {currentTime} = e.srcElement
      onProgress({playedSeconds: currentTime}, lesson).then(
        (lessonView: any) => {
          if (lessonView) {
            console.debug('progress recorded', {
              progress: lessonView,
            })
            setLessonView(lessonView)
          }
        },
      )
    }
    video?.addEventListener('timeupdate', recordProgress)
    return () => {
      video?.removeEventListener('timeupdate', recordProgress)
    }
  }, [video])

  const markComplete = trpc.progress.markLessonComplete.useMutation({
    onSuccess: (data) => {
      trpcUtils.progress.forLesson.invalidate({slug: data.lesson_slug})

      if (data?.collection_progress?.rate_url) {
        console.debug('presenting opportunity to rate course', {
          data,
          video: data.lesson_slug,
        })
        console.debug('RATE')
        send('RATE')
      }
    },
    onError: (error) => {
      console.error(error)
    },
  })

  const markLessonComplete = () => {
    markComplete.mutateAsync({
      lessonId: lesson.id,
      collectionId: lesson.collection?.id,
    })

    setLessonCompleted(true)
  }

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
        thumbnailUrls={compact([lesson?.thumb_url])}
      />
      <div className={cx({'h-screen': isFullscreen})}>
        <div
          className={cx(
            'bg-black w-full lg:grid lg:grid-cols-12 lg:space-y-0',
            {
              'absolute top-0': isFullscreen,
              relative: !isFullscreen,
            },
          )}
          ref={fullscreenWrapperRef}
        >
          <div
            className={cx(
              'relative before:float-left after:clear-both after:table',
              {
                'col-span-9': withSidePanel,
                'col-span-12': !withSidePanel,
              },
            )}
          >
            <div className={cx({hidden: !playerVisible})}>
              <Player
                canAddNotes={
                  isEmpty(viewer) || !notesEnabled ? false : !isFullscreen
                }
                className="font-sans"
                container={fullscreenWrapperRef.current || undefined}
                controls={
                  <DownloadControl
                    key={lesson.download_url}
                    download_url={lesson.download_url}
                    slug={lesson.slug}
                    state={lesson.state}
                  />
                }
                // poster={lesson.thumb_url}
              >
                {lesson.hls_url && (
                  <HLSSource key={lesson.hls_url} src={lesson.hls_url} />
                )}
                {lesson.subtitles_url && lesson.hls_url && (
                  <track
                    key={lesson.subtitles_url}
                    src={lesson.subtitles_url}
                    kind="subtitles"
                    srcLang="en"
                    label="English"
                    default={subtitle?.language === 'en'}
                  />
                )}
                {notesEnabled && metadataTracks && (
                  <track
                    key={lesson.slug}
                    id="notes"
                    src={queryString.stringifyUrl({
                      url: `/api/lessons/notes/${lesson?.slug}`,
                      query: {
                        staff_notes_url: lesson?.staff_notes_url || undefined,
                      },
                    })}
                    kind="metadata"
                    label="notes"
                  />
                )}
              </Player>
            </div>
            {/* <div
              className={cx('aspect-w-16 aspect-h-9', {
                hidden: mounted,
              })}
            /> */}
            <Overlays
              lessonSend={send}
              lessonState={lessonState}
              lesson={lesson}
              nextLesson={nextLesson}
              viewer={viewer}
              videoService={videoService}
              lessonView={lessonView}
              subscriber={subscriber}
              cioIdentify={cioIdentify}
            />
          </div>
          {withSidePanel && (
            <div className="flex flex-col col-span-3 dark:bg-gray-800 bg-gray-50">
              <PlayerSidebar
                relatedResources={specialLessons[lesson.slug]}
                videoResource={lesson}
              />
              <AutoplayControl />
            </div>
          )}
        </div>
      </div>
      <div className="container max-w-screen-lg py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 divide-y lg:grid-cols-1 lg:gap-12 md:divide-transparent divide-gray-50">
          <div className="row-start-1 space-y-6 md:col-span-8 md:row-start-1 md:space-y-8 lg:space-y-10">
            {lesson.state === 'RETIRED' && (
              <div className="p-3 -my-4 text-orange-800 bg-orange-100 border border-orange-900 rounded-md textmy--lg md:-my-8 border-opacity-20">
                ⚠️ This lesson is retired and might contain outdated
                information.
              </div>
            )}
            <div className="pb-2 space-y-4 sm:pb-8">
              {title && (
                <div className="flex space-x-2 -ml-7">
                  {lessonCompleted ? (
                    <span className="self-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500  rounded-full" />
                    </span>
                  ) : (
                    <span className="self-center " onClick={markLessonComplete}>
                      <CheckCircleIconOutline className="h-5 w-5 text-gray-300 hover:text-green-500 hover:cursor-pointer " />
                    </span>
                  )}
                  <h1 className="text-xl font-extrabold leading-tight lg:text-3xl">
                    {title}
                  </h1>
                </div>
              )}
              <div className="flex flex-col flex-wrap justify-between w-full pt-4 space-y-5 lg:flex-row lg:space-x-8 lg:space-y-0 lg:items-center">
                <div className="flex items-center justify-between w-full space-x-5 md:w-auto">
                  {instructor && (
                    <div className="flex items-center flex-shrink-0">
                      <Link href={instructorPagePath}>
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
                          <Link href={instructorPagePath}>
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
                  {!md && (
                    <Tags
                      tags={tags}
                      lessonSlug={lesson.slug}
                      collectionSlug={collection?.slug}
                    />
                  )}
                </div>

                {md && (
                  <Tags
                    tags={tags}
                    lessonSlug={lesson.slug}
                    collectionSlug={collection?.slug}
                  />
                )}
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
                <Markdown className="font-medium prose prose-lg dark:prose-dark dark:prose-a:text-blue-300 prose-a:text-blue-500 max-w-none text-gray-1000 dark:text-white">
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
                      commentingAllowed={viewer?.can_comment as any}
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
  const {viewer} = useViewer()
  const [watchCount, setWatchCount] = React.useState<number>(0)
  const [lessonState, send] = useMachine(lessonMachine, {
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

        return {
          ...initialLesson,
          ...loadedLesson,
        }
      },
    },
  })
  return (
    <VideoProvider
      services={{
        addCueNote,
        deleteCueNote,
        loadViewer:
          (_context: VideoStateContext, _event: VideoEvent) => async () => {
            return await viewer
          },
        loadResource:
          (_context: VideoStateContext, event: VideoEvent) => async () => {
            const loadedLesson = get(event, 'resource')
            return {
              ...initialLesson,
              ...loadedLesson,
            }
          },
      }}
    >
      <Lesson
        state={[lessonState, send]}
        initialLesson={initialLesson}
        watchCount={watchCount}
        setWatchCount={setWatchCount}
        {...props}
      />
    </VideoProvider>
  )
}

export default LessonPage
