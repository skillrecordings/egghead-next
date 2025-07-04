import React from 'react'
import {useRouter} from 'next/router'
import {filter, get, isEmpty, compact, truncate} from 'lodash'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from '@reach/tabs'
import {useEggheadPlayer} from '@/components/EggheadPlayer'
import Course from '@/components/pages/lessons/course'
import Overlays from '@/components/pages/lessons/overlays'
import specialLessons from '@/components/pages/lessons/special-lessons'
import Transcript from '@/components/pages/lessons/transcript'
import {VideoResource} from '@/types'
import {NextSeo, SocialProfileJsonLd, VideoJsonLd} from 'next-seo'
import removeMarkdown from 'remove-markdown'
import {useEnhancedTranscript} from '@/hooks/use-enhanced-transcript'
import useLastResource from '@/hooks/use-last-resource'
import Markdown from 'react-markdown'
import Link from 'next/link'
import {track} from '@/utils/analytics'
import Eggo from '@/components/icons/eggo'
import Image from 'next/legacy/image'
import cookieUtil from '@/utils/cookies'
import useBreakpoint from '@/utils/breakpoints'
import Share from '@/components/share'
import {useNextForCollection} from '@/hooks/use-next-up-data'
import {useNextForCollectionSection} from '@/hooks/next-data-sections'
import CodeLink, {
  IconCode,
  IconGithub,
} from '@/components/pages/lessons/code-link'
import DownloadControl from '@/components/player/download-control'
import useCio from '@/hooks/use-cio'
import friendlyTime from 'friendly-time'
import {
  PublishedAt,
  UpdatedAt,
} from '@/components/layouts/collection-page-layout'
import cookies from '@/utils/cookies'
import AutoplayControl from '@/components/player/autoplay-control'
import {
  Player,
  usePlayerPrefs,
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
} from '@skillrecordings/player'
import cx from 'classnames'
import {useSelector} from '@xstate/react'
import {
  CheckCircleIcon as CheckCircleIconOutline,
  ArrowsExpandIcon,
} from '@heroicons/react/outline'
import {CheckCircleIcon, CheckIcon} from '@heroicons/react/solid'
import {trpc} from '@/app/_trpc/client'
import {LessonProgress} from '@/lib/progress'
import PlayerSidebar from '@/components/player/player-sidebar'
import Comments from '@/components/pages/lessons/comments/comments'
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown'
import CodeBlock from '@/components/code-block'
import {LessonResource, SectionResource} from '@/types'

const Tags = dynamic(() => import('@/components/pages/lessons/tags'), {
  ssr: false,
})

type LessonProps = {
  state: any
  initialLesson: VideoResource
  watchCount: number
  setWatchCount: (value: number) => void
  lessons?: LessonResource[]
  sections?: SectionResource[]
}

const MAX_FREE_VIEWS = 4

const notesEnabled = process.env.NEXT_PUBLIC_NOTES_ENABLED === 'true'

function toISO8601Duration(duration: number) {
  const seconds = Math.floor(duration % 60)
  const minutes = Math.floor((duration / 60) % 60)
  const hours = Math.floor((duration / (60 * 60)) % 24)
  const days = Math.floor(duration / (60 * 60 * 24))

  return `P${days}DT${hours}H${minutes}M${seconds}S`
}

const Lesson: React.FC<React.PropsWithChildren<LessonProps>> = ({
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

  const hasScrimbaUrl = initialLesson?.scrimba?.url
  const scrimbaTranscript = initialLesson?.scrimba?.transcript

  const iframeRef = React.useRef<HTMLIFrameElement>(null)

  const toggleFullscreen = () => {
    const iframe = iframeRef.current

    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen()
      }
    }
  }

  const nextLessonSection = useNextForCollectionSection(collection, lesson.slug)

  return (
    <>
      <NextSeo
        description={truncate(removeMarkdown(description?.replace(/"/g, "'")), {
          length: 155,
        })}
        canonical={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${lesson.path}`}
        title={title?.replace(/"/g, "'")}
        titleTemplate={'%s | egghead.io'}
        twitter={{
          handle: instructor?.twitter,
          site: `@eggheadio`,
          cardType: 'summary_large_image',
        }}
        openGraph={{
          title: title?.replace(/"/g, "'"),
          url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${lesson.path}`,
          description: truncate(
            removeMarkdown(description?.replace(/"/g, "'")),
            {length: 155},
          ),
          site_name: 'egghead',
          images: [
            {
              url: `https://og-image-react-egghead.now.sh/lesson/${slug}?v=20201027`,
            },
          ],
        }}
      />
      <VideoJsonLd
        name={title?.replace(/"/g, "'")}
        description={truncate(removeMarkdown(description?.replace(/"/g, "'")), {
          length: 155,
        })}
        contentUrl={lesson?.hls_url}
        duration={toISO8601Duration(Number(lesson?.duration ?? 0))}
        uploadDate={lesson?.created_at}
        thumbnailUrls={compact([lesson?.thumb_url])}
      />
      <SocialProfileJsonLd
        type="Person"
        name={instructor?.full_name}
        url={`https://egghead.io${instructorPagePath}`}
        sameAs={[`https://twitter.com/${instructor?.twitter}`]}
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
            {hasScrimbaUrl ? (
              <>
                <div className="w-full">
                  <div className="aspect-[16/10] relative">
                    <div className="absolute inset-0 flex flex-col">
                      <div className="h-full w-full">
                        <iframe
                          ref={iframeRef}
                          src={lesson.scrimba?.url}
                          title="Scrimba Embed"
                          height="100%"
                          sandbox="allow-same-origin allow-scripts"
                          className="w-full"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  className={cx('aspect-[16/9] relative', {
                    hidden: !playerVisible,
                  })}
                >
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
                    <HLSSource key={lesson.hls_url} src={lesson.hls_url} />
                    {lesson.subtitles_url && (
                      <track
                        key={lesson.subtitles_url}
                        src={lesson.subtitles_url}
                        kind="subtitles"
                        srcLang="en"
                        label="English"
                        default={subtitle?.language === 'en'}
                      />
                    )}
                  </Player>
                </div>
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
              </>
            )}
            <div
              className={cx('aspect-[16/9]', {
                hidden: mounted,
              })}
            />
          </div>
          {withSidePanel && (
            <div className="flex flex-col col-span-3 dark:bg-gray-800 bg-gray-50">
              <PlayerSidebar
                relatedResources={specialLessons[lesson.slug]}
                videoResource={lesson}
              />
              {hasScrimbaUrl ? (
                <>
                  <div className="bg-player-bg bg-opacity-80 px-3 py-2 flex items-center justify-between w-full group h-[54px]">
                    <div className="flex md:mt-0">
                      <button className="px-4 py-2" onClick={toggleFullscreen}>
                        <ArrowsExpandIcon className="h-5 w-5 text-gray-800  dark:text-white" />
                      </button>
                    </div>
                    {nextLessonSection && (
                      <Link
                        href={nextLessonSection.path}
                        onClick={markLessonComplete}
                        className="bg-blue-600 text-white sm:px-2 sm:py-2 px-3 py-2 rounded-md tracking-tight hover:bg-blue-700 transition text-sm"
                      >
                        Complete and Continue
                      </Link>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <AutoplayControl />
                </>
              )}
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
                      <Link
                        href={instructorPagePath}
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
                      </Link>
                      <div className="flex flex-col">
                        <span className="text-xs">Instructor</span>
                        {get(instructor, 'full_name') && (
                          <Link
                            href={instructorPagePath}
                            onClick={() => {
                              track(`clicked view instructor`, {
                                lesson: lesson.slug,
                                location: 'text link',
                              })
                            }}
                            className="font-semibold leading-tighter hover:underline"
                          >
                            {instructor.full_name}
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
              {mounted && (
                <div className="flex flex-col items-center mt-4 text-sm opacity-80 md:items-start">
                  {created_at && (
                    <PublishedAt date={friendlyTime(new Date(created_at))} />
                  )}
                  {updated_at && (
                    <UpdatedAt date={friendlyTime(new Date(updated_at))} />
                  )}
                </div>
              )}
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
              {mounted && md && (
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
                {scrimbaTranscript && <Tab>Transcript</Tab>}
                <Tab>
                  Comments <span className="text-sm">({numberOfComments})</span>
                </Tab>
              </TabList>
              <TabPanels className="p-5 rounded-lg rounded-tl-none bg-gray-50 dark:bg-gray-1000 sm:p-8">
                {scrimbaTranscript && (
                  <TabPanel>
                    <ReactMarkdown
                      skipHtml={false}
                      components={{
                        code: (props) => {
                          return <CodeBlock {...props} />
                        },
                      }}
                      className="prose dark:prose-dark max-w-none text-gray-800 dark:text-gray-100 dark:prose-a:text-blue-300 prose-a:text-blue-500"
                    >
                      {scrimbaTranscript}
                    </ReactMarkdown>
                  </TabPanel>
                )}
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
                    <Comments lesson={lesson} />
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

export default Lesson
