import React, {useRef, useState, useEffect, useCallback} from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

export const useVideoJS = (videoJsOptions: any) => {
  const videoNode = useRef(null)
  const [ready, setReady] = useState(false)
  const changedKey = JSON.stringify(videoJsOptions)
  const player = useRef<any>(null)
  useEffect(() => {
    player.current = videojs(videoNode.current, videoJsOptions)
    player.current.ready(() => {
      setReady(true)
    })
    return () => {
      player.current.dispose()
    }
  }, [changedKey])

  const Video = useCallback(
    ({children}) => (
      <div data-vjs-player key={changedKey}>
        <video ref={videoNode} className="video-js" playsInline>
          {children}
        </video>
      </div>
    ),
    [changedKey],
  )
  return {Video, ready, player: player.current}
}
