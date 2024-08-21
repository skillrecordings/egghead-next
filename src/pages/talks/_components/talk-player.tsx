import React from 'react'
import {useRouter} from 'next/router'
import {filter, get, isEmpty} from 'lodash'
import {useEggheadPlayer} from '@/components/EggheadPlayer'
import Overlays from '@/components/pages/lessons/overlays'
import useLastResource from '@/hooks/use-last-resource'
import {track} from '@/utils/analytics'
import cookieUtil from '@/utils/cookies'
import {useNextForCollection} from '@/hooks/use-next-up-data'
import DownloadControl from '@/components/player/download-control'
import useCio from '@/hooks/use-cio'
import cookies from '@/utils/cookies'
import {
  Player,
  usePlayerPrefs,
  HLSSource,
  useVideo,
  selectWithSidePanel,
  selectIsPaused,
  selectVideo,
  selectIsWaiting,
  selectHasEnded,
  selectIsFullscreen,
  selectViewer,
} from '@skillrecordings/player'
import cx from 'classnames'
import {useSelector} from '@xstate/react'
import {trpc} from '@/app/_trpc/client'
import {LessonProgress} from '@/lib/progress'
import {LessonResource, SectionResource, VideoResource} from '@/types'
import './talk-player.css'

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

const TalkPlayer: React.FC<React.PropsWithChildren<LessonProps>> = ({
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

  const hasEnded = useSelector(videoService, selectHasEnded)
  const isWaiting = useSelector(videoService, selectIsWaiting)
  const isPaused = useSelector(videoService, selectIsPaused)
  const isFullscreen = useSelector(videoService, selectIsFullscreen)
  const viewer = useSelector(videoService, selectViewer)

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

  const {collection, free_forever} = lesson

  const nextLesson = useNextForCollection(collection, lesson.slug)
  const {session_id} = router.query

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
        if (!initialMediaPresent && mediaPresent) {
          videoService.send({
            type: 'LOAD_RESOURCE',
            resource: lesson,
          })
        }
        if (!mediaPresent) {
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

  if (!initialLesson || !state) return null

  return (
    <>
      <div className={cx({'h-screen': isFullscreen})}>
        <div
          className={cx('bg-black w-full', {
            'absolute top-0': isFullscreen,
            relative: !isFullscreen,
          })}
          ref={fullscreenWrapperRef}
        >
          <div className="relative before:float-left after:clear-both after:table">
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
          </div>
        </div>
      </div>
    </>
  )
}

export default TalkPlayer
