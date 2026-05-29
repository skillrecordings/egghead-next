import * as React from 'react'
import {type VideoResource} from '@/schemas/video-resource'

type VideoResourceContextType = {
  videoResource?: VideoResource
  loadingVideoResource: boolean
  videoResourceId: string
}

export const VideoResourceContext = React.createContext(
  {} as VideoResourceContextType,
)

type VideoResourceProviderProps = {
  videoResourceId: string
  children: React.ReactNode
}

export const VideoResourceProvider: React.FC<VideoResourceProviderProps> = ({
  videoResourceId,
  children,
}) => {
  const context = {
    videoResourceId,
    videoResource: undefined,
    loadingVideoResource: false,
  }
  return (
    <VideoResourceContext.Provider value={context}>
      {children}
    </VideoResourceContext.Provider>
  )
}

export const useVideoResource = () => {
  return React.useContext(VideoResourceContext)
}
