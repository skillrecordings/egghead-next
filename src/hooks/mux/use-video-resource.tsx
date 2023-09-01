import * as React from 'react'
import {type VideoResource} from '../schemas/video-resource'
import {trpcSkillLessons} from '../utils/trpc-skill-lessons'

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
  const {data: videoResource, status} =
    trpcSkillLessons.videoResource.byId.useQuery(
      {id: videoResourceId},
      {
        refetchOnWindowFocus: false,
      },
    )

  const context = {
    videoResourceId,
    videoResource,
    loadingVideoResource: status === 'loading',
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
