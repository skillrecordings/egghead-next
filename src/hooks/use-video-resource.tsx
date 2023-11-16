import {useQuery} from '@tanstack/react-query'
import {getVideoResource} from '@/lib/video-resources'
import * as React from 'react'
import {type VideoResource} from '@/schemas/video-resource'
import {trpc} from '@/app/_trpc/client'

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

const useVideoResourceData = (id: string) => {
  return useQuery(['video-resource'], async () => {
    if (id) {
      return await getVideoResource(id)
    }
  })
}

export const VideoResourceProvider: React.FC<VideoResourceProviderProps> = ({
  videoResourceId,
  children,
}) => {
  const {data: videoResource, status} = useVideoResourceData(videoResourceId)
  // trpc with app router is in a huge flux right now, opting for react-query
  // const {data: videoResource, status} =
  //   trpc.videoResource.byId.useQuery(
  //     {id: videoResourceId},
  //     {
  //       refetchOnWindowFocus: false,
  //     },
  //   )

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
