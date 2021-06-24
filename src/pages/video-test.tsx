import * as React from 'react'
import {GetServerSideProps} from 'next'
import VideoResourcePlayer from 'components/player'
import {PlayerProvider} from 'cueplayer-react'
import {VideoResource} from 'types'
import {loadBasicLesson} from 'lib/lessons'

const VideoTest: React.FC<{
  videoResource: VideoResource
}> = ({videoResource}) => {
  return (
    <PlayerProvider>
      <div className="video-test -mx-5">
        {videoResource.hls_url && (
          <VideoResourcePlayer videoResource={videoResource} />
        )}
      </div>
    </PlayerProvider>
  )
}

export default VideoTest

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  res,
  params,
}) {
  const lesson = 'react-a-beginners-guide-to-react-introduction'
  const videoResource: VideoResource = (await loadBasicLesson(
    lesson,
  )) as VideoResource

  return {
    props: {
      videoResource,
    },
  }
}
