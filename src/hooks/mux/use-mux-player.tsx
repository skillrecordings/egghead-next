import * as React from 'react'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import {useRouter, usePathname} from 'next/navigation'
import {
  type MuxPlayerRefAttributes,
  type MuxPlayerProps,
} from '@mux/mux-player-react'
import {
  handleTextTrackChange,
  setPreferredPlaybackRate,
  setPreferredTextTrack,
  usePlayerPrefs,
} from './use-player-prefs'
import {useGlobalPlayerShortcuts} from './use-global-player-shortcut'

type VideoContextType = {
  muxPlayerProps: MuxPlayerProps | any
  setPlayerPrefs: (prefs: {[key: string]: boolean | string}) => void
  setDisplayOverlay: (value: boolean) => void
  handlePlay: () => void
  displayOverlay: boolean
  path: string
  video?: {muxPlaybackId?: string}
  // canShowVideo: boolean
  // refetchAbility: () => void
  // loadingUserStatus: boolean
  muxPlayerRef: React.RefObject<MuxPlayerRefAttributes>
  // handleContinue: (options: {
  //   router: NextRouter
  //   handlePlay: () => void
  //   path: string
  // }) => Promise<any>
  // handlePlayFromBeginning: (options: {
  //   router: NextRouter
  //   path: string
  //   handlePlay: () => void
  // }) => Promise<any>
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
    router: any
    handlePlay: () => void
    path: string
  }) => Promise<any>
  handlePlayFromBeginning?: (options: {
    router: any
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
  exerciseSlug,
}) => {
  const router = useRouter()
  const pathname = usePathname() || ''

  useGlobalPlayerShortcuts(muxPlayerRef)

  const {setPlayerPrefs} = usePlayerPrefs()

  const [displayOverlay, setDisplayOverlay] = React.useState(false)

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

  // const handleNext = React.useCallback(async () => {

  // }, [lesson._type, router])

  // const onPlay = React.useCallback(() => {
  //   setDisplayOverlay(false)
  //   // track('started lesson video', {
  //   //   module: module.slug.current,
  //   //   lesson: lesson.slug,
  //   //   moduleType: module.moduleType,
  //   //   lessonType: lesson._type,
  //   // })
  // }, [lesson._type, lesson.slug, module.moduleType, module.slug])

  const onEndedCallback = React.useCallback(async () => {
    exitFullscreen()
    // handleNext()
    // track('completed lesson video', {
    //   module: module.slug.current,
    //   lesson: lesson.slug,
    //   moduleType: module.moduleType,
    //   lessonType: lesson._type,
    // })

    return onEnded()
  }, [onEnded, onModuleEnded])

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

  const handleUserPreferences = React.useCallback(() => {
    setPreferredPlaybackRate(muxPlayerRef)
    setPreferredTextTrack(muxPlayerRef)
    handleTextTrackChange(muxPlayerRef, setPlayerPrefs)
  }, [muxPlayerRef, setPlayerPrefs])

  const context = {
    muxPlayerProps: {
      id: 'mux-player',
      onPause: () => {},
      onEnded: onEndedCallback,
      onRateChange,
      defaultHiddenCaptions: true,
      streamType: 'on-demand',
      onLoadedData: handleUserPreferences,
      playbackRates: [0.75, 1, 1.25, 1.5, 1.75, 2],
    } as MuxPlayerProps,
    setPlayerPrefs,
    setDisplayOverlay: setDisplayOverlayCallback,
    handlePlay,
    displayOverlay,
    path,
    muxPlayerRef,
    // handleContinue,
    // handlePlayFromBeginning
  }
  return (
    <VideoContext.Provider value={context}>{children}</VideoContext.Provider>
  )
}

export const useMuxPlayer = () => {
  const muxVideoContext = React.useContext(VideoContext)

  return muxVideoContext
}
