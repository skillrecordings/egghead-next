import * as React from 'react'
import {GetServerSideProps} from 'next'
import VideoResourcePlayer from 'components/player'
import {PlayerProvider} from 'cueplayer-react'
import {VideoResource} from 'types'
import {loadLesson} from 'lib/lessons'
import PlayerSidebar from 'components/player/player-sidebar'
import PlayerContainer from 'components/player/player-container'

const VideoTest: React.FC<{
  videoResource: VideoResource
}> = ({videoResource}) => {
  const playerContainer = React.useRef(null)
  return (
    <div className="-mx-5">
      <PlayerProvider>
        {videoResource.hls_url && (
          <PlayerContainer
            ref={playerContainer}
            className="relative grid grid-cols-1 lg:grid-cols-12 font-sans text-base"
          >
            <VideoResourcePlayer
              containerRef={playerContainer}
              videoResource={videoResource}
            />
            <PlayerSidebar videoResource={videoResource} />
          </PlayerContainer>
        )}
      </PlayerProvider>
    </div>
  )
}

export default VideoTest

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  res,
  params,
  query,
}) {
  const lessonSlug =
    (query?.lesson as string) || 'react-a-beginners-guide-to-react-introduction'
  const videoResource: VideoResource = (await loadLesson(
    lessonSlug,
  )) as VideoResource

  return {
    props: {
      videoResource,
    },
  }
}
