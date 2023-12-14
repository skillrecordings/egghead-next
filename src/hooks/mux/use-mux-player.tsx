import * as React from 'react'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import {useRouter, usePathname} from 'next/navigation'
import {
  type MuxPlayerRefAttributes,
  type MuxPlayerProps,
} from '@mux/mux-player-react'
import {useVideoResource} from '@/hooks/use-video-resource'
import {useLesson} from '@/hooks/use-lesson'
import {useNextLesson} from './use-next-lesson'
import {
  handleTextTrackChange,
  setPreferredPlaybackRate,
  setPreferredTextTrack,
  usePlayerPrefs,
} from './use-player-prefs'
import {getNextSection} from './get-next-section'
// import {type AppAbility, createAppAbility} from '../utils/ability'
// import {trpcSkillLessons} from '../utils/trpc-skill-lessons'
import {useGlobalPlayerShortcuts} from './use-global-player-shortcut'
import {defaultHandleContinue} from '@/utils/video/default-handle-continue'
import {handlePlayFromBeginning as defaultHandlePlayFromBeginning} from '@/utils/video/handle-play-from-beginning'
import {type Module} from '@/schemas/module'
import {type Section} from '@/schemas/section'
import {type Lesson} from '@/schemas/lesson'
import {type NextRouter} from 'next/router'
import {useViewer} from '@/context/viewer-context'

type VideoContextType = {
  muxPlayerProps: MuxPlayerProps | any
  setPlayerPrefs: (prefs: {[key: string]: boolean | string}) => void
  setDisplayOverlay: (value: boolean) => void
  handlePlay: () => void
  displayOverlay: boolean
  nextExercise?: Lesson | null
  nextExerciseStatus?: 'error' | 'success' | 'loading'
  nextSection: Section | null
  path: string
  video?: {muxPlaybackId?: string}
  canShowVideo: boolean
  // refetchAbility: () => void
  loadingUserStatus: boolean
  // ability: AppAbility
  muxPlayerRef: React.RefObject<MuxPlayerRefAttributes>
  handleContinue: (options: {
    router: NextRouter
    module: Module
    section?: Section | null
    nextExercise?: Lesson | null
    handlePlay: () => void
    path: string
  }) => Promise<any>
  handlePlayFromBeginning: (options: {
    router: NextRouter
    section?: Section
    module: Module
    path: string
    handlePlay: () => void
  }) => Promise<any>
}

export const VideoContext = React.createContext({} as VideoContextType)

type VideoProviderProps = {
  exerciseSlug?: string
  path?: string
  muxPlayerRef: React.RefObject<MuxPlayerRefAttributes>
  onEnded?: () => Promise<any>
  onModuleEnded?: () => Promise<any>
  onModuleStarted?: () => Promise<any>
  handleContinue?: (options: {
    router: NextRouter
    module: Module
    section?: Section | null
    nextExercise?: Lesson | null
    handlePlay: () => void
    path: string
  }) => Promise<any>
  handlePlayFromBeginning?: (options: {
    router: NextRouter
    section?: Section
    module: Module
    path: string
    handlePlay: () => void
  }) => Promise<any>
}

export const VideoProvider: React.FC<
  React.PropsWithChildren<VideoProviderProps>
> = ({
  muxPlayerRef,
  children,
  path = '',
  onEnded = async () => {},
  onModuleEnded = async () => {},
  onModuleStarted = async () => {},
  handleContinue = defaultHandleContinue,
  handlePlayFromBeginning = defaultHandlePlayFromBeginning,
  exerciseSlug,
}) => {
  const router = useRouter()
  const pathname = usePathname()

  const {videoResource, loadingVideoResource} = useVideoResource()

  const {lesson, section, module} = useLesson()

  useGlobalPlayerShortcuts(muxPlayerRef)

  const {nextExercise, nextExerciseStatus} = useNextLesson(
    lesson,
    module,
    section,
  )

  const nextSection = section
    ? getNextSection({
        module,
        currentSection: section,
      })
    : null

  // const {
  //   data: abilityRules,
  //   status: abilityRulesStatus,
  //   refetch: refetchAbility,
  // } = trpcSkillLessons.modules.rules.useQuery({
  //   moduleSlug: module.slug.current,
  //   moduleType: module.moduleType,
  //   lessonSlug: exerciseSlug,
  //   sectionSlug: section?.slug,
  //   isSolution: lesson._type === 'solution',
  //   convertkitSubscriberId: subscriber?.id,
  // })

  // const ability = createAppAbility(abilityRules || [])

  const {ability} = useViewer()
  const canShowVideo = true //ability.can('view', 'Content')

  const {setPlayerPrefs} = usePlayerPrefs()

  const [displayOverlay, setDisplayOverlay] = React.useState(false)

  const title = get(lesson, 'title') || get(lesson, 'label')

  // const loadingUserStatus =
  //   abilityRulesStatus === 'loading' || loadingVideoResource
  const loadingUserStatus = false

  const handlePlay = React.useCallback(() => {
    const videoElement = document.getElementById(
      'mux-player',
    ) as HTMLVideoElement
    return videoElement?.play()
  }, [])

  const exitFullscreen = () => {
    if (!isEmpty(window.document.fullscreenElement)) {
      window.document.exitFullscreen()
    }
  }

  const handleNext = React.useCallback(async () => {
    if (lesson._type === 'exercise' && !pathname?.endsWith('/exercise')) {
      await router.push(pathname + '/exercise')
    }
    setDisplayOverlay(true)
  }, [lesson._type, router])

  const onPlay = React.useCallback(() => {
    setDisplayOverlay(false)
    // track('started lesson video', {
    //   module: module.slug.current,
    //   lesson: lesson.slug,
    //   moduleType: module.moduleType,
    //   lessonType: lesson._type,
    // })
  }, [lesson._type, lesson.slug, module.moduleType, module.slug])

  const isModuleComplete =
    nextExerciseStatus !== 'loading' && !nextExercise && !nextSection

  const isFirstLessonInModule =
    (module.lessons &&
      Boolean(module.lessons?.length) &&
      module.lessons[0].slug === lesson.slug) ||
    (section?.lessons &&
      Boolean(section.lessons?.length) &&
      section?.lessons[0]?.slug === lesson.slug)

  const onEndedCallback = React.useCallback(async () => {
    exitFullscreen()
    handleNext()
    // track('completed lesson video', {
    //   module: module.slug.current,
    //   lesson: lesson.slug,
    //   moduleType: module.moduleType,
    //   lessonType: lesson._type,
    // })

    if (isFirstLessonInModule && onModuleStarted) {
      await onModuleStarted()
    }

    if (isModuleComplete && onModuleEnded) {
      await onModuleEnded()
    }
    return onEnded()
  }, [
    handleNext,
    lesson._type,
    lesson.slug,
    module.moduleType,
    module.slug,
    onEnded,
    onModuleEnded,
    isModuleComplete,
  ])

  const onRateChange = React.useCallback(() => {
    setPlayerPrefs({
      playbackRate: muxPlayerRef.current?.playbackRate,
    })
  }, [muxPlayerRef, setPlayerPrefs])

  const setDisplayOverlayCallback = React.useCallback(
    (value: boolean) => {
      setDisplayOverlay(value)
    },
    [setDisplayOverlay],
  )

  // initialize player state
  React.useEffect(() => {
    if (pathname?.endsWith('/exercise') && lesson) {
      muxPlayerRef.current && muxPlayerRef.current.pause()
      setDisplayOverlay(true)
    } else {
      setDisplayOverlay(false)
    }
  }, [lesson, pathname, muxPlayerRef])

  const handleUserPreferences = React.useCallback(() => {
    setPreferredPlaybackRate(muxPlayerRef)
    setPreferredTextTrack(muxPlayerRef)
    handleTextTrackChange(muxPlayerRef, setPlayerPrefs)
  }, [muxPlayerRef, setPlayerPrefs])

  const context = {
    muxPlayerProps: {
      id: 'mux-player',
      onPlay,
      onPause: () => {},
      onEnded: onEndedCallback,
      onRateChange,
      defaultHiddenCaptions: true,
      streamType: 'on-demand',
      metadata: {
        video_title: `${title} (${lesson._type})`,
      },
      onLoadedData: handleUserPreferences,
      playbackRates: [0.75, 1, 1.25, 1.5, 1.75, 2],
    } as MuxPlayerProps,
    setPlayerPrefs,
    setDisplayOverlay: setDisplayOverlayCallback,
    handlePlay,
    displayOverlay,
    nextExercise,
    nextExerciseStatus,
    nextSection,
    video: videoResource,
    path,
    canShowVideo,
    // refetchAbility,
    ability,
    loadingUserStatus,
    muxPlayerRef,
    handleContinue,
    handlePlayFromBeginning,
  }
  return (
    <VideoContext.Provider value={context}>{children}</VideoContext.Provider>
  )
}

export const useMuxPlayer = () => {
  const muxVideoContext = React.useContext(VideoContext)

  return muxVideoContext
}
