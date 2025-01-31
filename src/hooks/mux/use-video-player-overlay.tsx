'use client'

import React, {createContext, Reducer, useContext, useReducer} from 'react'
import type {MuxPlayerRefAttributes} from '@mux/mux-player-react'

type VideoPlayerOverlayState = {
  action: VideoPlayerOverlayAction | null
}

export type CompletedAction = {
  type: 'COMPLETED'
  playerRef: React.RefObject<MuxPlayerRefAttributes | null>
  cta?: string
}

export type VideoPlayerOverlayAction =
  | CompletedAction
  | {type: 'BLOCKED'}
  | {type: 'HIDDEN'}
  | {type: 'LOADING'}

const initialState: VideoPlayerOverlayState = {
  action: {
    type: 'HIDDEN',
  },
}

const reducer: Reducer<VideoPlayerOverlayState, VideoPlayerOverlayAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case 'COMPLETED':
      // TODO: Track video completion
      return {
        ...state,
        action,
      }
    case 'LOADING':
      console.log('loading')
      return {
        ...state,
        action,
      }
    case 'BLOCKED':
      return {
        ...state,
        action,
      }
    case 'HIDDEN': {
      return {
        ...state,
        action,
      }
    }
    default:
      return state
  }
}

type VideoPlayerOverlayContextType = {
  state: VideoPlayerOverlayState
  dispatch: React.Dispatch<VideoPlayerOverlayAction>
}

export const VideoPlayerOverlayProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const value = React.useMemo(() => ({state, dispatch}), [state, dispatch])

  return (
    <VideoPlayerOverlayContext.Provider value={value}>
      {children}
    </VideoPlayerOverlayContext.Provider>
  )
}

const VideoPlayerOverlayContext = createContext<
  VideoPlayerOverlayContextType | undefined
>(undefined)

export const useVideoPlayerOverlay = () => {
  const context = useContext(VideoPlayerOverlayContext)
  if (!context) {
    throw new Error(
      'useVideoPlayerContext must be used within a VideoPlayerProvider',
    )
  }
  return {
    state: context.state,
    dispatch: context.dispatch,
  }
}
