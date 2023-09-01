'use client'
import React from 'react'
import MuxPlayer, {
  MuxPlayerProps,
  MuxPlayerRefAttributes,
} from '@mux/mux-player-react'
import {useMuxPlayer} from 'hooks/mux/use-mux-player'

const TipPlayer: React.FC<{tip: any}> = ({tip}) => {
  const muxPlayerRef = React.useRef<MuxPlayerRefAttributes>(null)
  const {muxPlayerProps, displayOverlay} = useMuxPlayer()

  return (
    <div className="w-full min-h-[50vh]">
      <MuxPlayer playbackId={tip.muxPlaybackId} />
    </div>
  )
}

export default TipPlayer
