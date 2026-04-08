'use client'

import * as React from 'react'
import {getPlayerPrefs} from '@/components/EggheadPlayer/use-egghead-player'

export type VideoState = {
  video: any
  viewer: any
  resource: any
  withSidePanel: boolean
  metadataTracks: TextTrack[]
  isPaused: boolean
  isWaiting: boolean
  hasEnded: boolean
  isFullscreen: boolean
  shortcutsEnabled: boolean
  isActive: boolean
}

type VideoEvent =
  | {type: 'SET_VIDEO'; video: any}
  | {type: 'LOAD_RESOURCE'; resource?: any}
  | {type: 'ACTIVITY'}
  | {type: 'PLAY'; source?: string}
  | {type: 'PAUSE'; source?: string}
  | {type: 'WAITING'}
  | {type: 'DONE_WAITING'}
  | {type: 'END'}
  | {type: 'EXIT_FULLSCREEN'; element?: HTMLElement}
  | {type: 'TOGGLE_SHORTCUTS_ENABLED'; source?: string}
  | {type: 'SET_VIEWER'; viewer: any}
  | {type: 'SET_METADATA_TRACKS'; metadataTracks: TextTrack[]}

export type VideoService = {
  state: VideoState
  send: (event: VideoEvent | string) => void
  setState: React.Dispatch<React.SetStateAction<VideoState>>
}

type ServiceLoader = (_context: any, _event: any) => () => Promise<any>

type VideoProviderProps = {
  services?: {
    loadViewer?: ServiceLoader
    loadResource?: ServiceLoader
  }
}

const initialState: VideoState = {
  video: null,
  viewer: null,
  resource: null,
  withSidePanel: true,
  metadataTracks: [],
  isPaused: true,
  isWaiting: true,
  hasEnded: false,
  isFullscreen: false,
  shortcutsEnabled: true,
  isActive: false,
}

const VideoContext = React.createContext<VideoService | null>(null)

export const VideoProvider: React.FC<
  React.PropsWithChildren<VideoProviderProps>
> = ({children, services}) => {
  const [state, setState] = React.useState<VideoState>(initialState)
  const loadResourceRequestIdRef = React.useRef(0)
  const loadViewer = services?.loadViewer

  React.useEffect(() => {
    if (!loadViewer) return

    loadViewer({}, {type: 'LOAD_VIEWER'})()
      .then((viewer) => {
        setState((prev) => ({...prev, viewer}))
      })
      .catch(() => {})
  }, [loadViewer])

  const send = React.useCallback(
    (rawEvent: VideoEvent | string) => {
      const event =
        typeof rawEvent === 'string'
          ? ({type: rawEvent} as VideoEvent)
          : rawEvent

      switch (event.type) {
        case 'SET_VIDEO': {
          setState((prev) => ({...prev, video: event.video}))
          return
        }
        case 'SET_VIEWER': {
          setState((prev) => ({...prev, viewer: event.viewer}))
          return
        }
        case 'SET_METADATA_TRACKS': {
          setState((prev) => ({...prev, metadataTracks: event.metadataTracks}))
          return
        }
        case 'LOAD_RESOURCE': {
          const loadResource = services?.loadResource
          if (loadResource) {
            const requestId = ++loadResourceRequestIdRef.current

            loadResource(
              {resource: state.resource, viewer: state.viewer},
              event,
            )()
              .then((resource) => {
                if (requestId !== loadResourceRequestIdRef.current) return

                setState((prev) => ({
                  ...prev,
                  resource: resource ?? event.resource ?? prev.resource,
                }))
              })
              .catch(() => {
                if (requestId !== loadResourceRequestIdRef.current) return

                setState((prev) => ({
                  ...prev,
                  resource: event.resource ?? prev.resource,
                }))
              })
          } else {
            setState((prev) => ({
              ...prev,
              resource: event.resource ?? prev.resource,
            }))
          }
          return
        }
        case 'ACTIVITY': {
          setState((prev) => ({...prev, isActive: true}))
          return
        }
        case 'PLAY': {
          setState((prev) => ({...prev, isPaused: false, hasEnded: false}))
          if (state.video?.paused) {
            state.video?.play?.().catch?.(() => {})
          }
          return
        }
        case 'PAUSE': {
          setState((prev) => ({...prev, isPaused: true}))
          if (!state.video?.paused) {
            state.video?.pause?.()
          }
          return
        }
        case 'WAITING': {
          setState((prev) => ({...prev, isWaiting: true}))
          return
        }
        case 'DONE_WAITING': {
          setState((prev) => ({...prev, isWaiting: false}))
          return
        }
        case 'END': {
          setState((prev) => ({...prev, hasEnded: true, isPaused: true}))
          return
        }
        case 'EXIT_FULLSCREEN': {
          if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {})
          }
          setState((prev) => ({
            ...prev,
            isFullscreen: false,
            withSidePanel: true,
          }))
          return
        }
        case 'TOGGLE_SHORTCUTS_ENABLED': {
          setState((prev) => ({
            ...prev,
            shortcutsEnabled: !prev.shortcutsEnabled,
          }))
          return
        }
        default: {
          return
        }
      }
    },
    [services, state.resource, state.video, state.viewer],
  )

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setState((prev) => ({
        ...prev,
        isFullscreen: Boolean(document.fullscreenElement),
        withSidePanel: !document.fullscreenElement,
      }))
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  React.useEffect(() => {
    const theater = getPlayerPrefs().theater
    setState((prev) => ({
      ...prev,
      withSidePanel: document.fullscreenElement
        ? false
        : typeof theater === 'boolean'
        ? !theater
        : prev.withSidePanel,
    }))
  }, [])

  return (
    <VideoContext.Provider value={{state, send, setState}}>
      {children}
    </VideoContext.Provider>
  )
}

export const useVideo = () => {
  const context = React.useContext(VideoContext)

  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider')
  }

  return context
}

export const usePlayerSelector = <T,>(
  service: VideoService,
  selector: (state: VideoState) => T,
) => {
  return selector(service.state)
}
