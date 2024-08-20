'use client'
import React from 'react'
import {type VideoResource} from '@/types'
import {HLSSource, Player} from '@skillrecordings/player'
import './embed-lesson.css'

export default function EmbedPlayer({
  initialLesson,
}: {
  initialLesson: VideoResource
}) {
  const fullscreenWrapperRef = React.useRef<HTMLDivElement>(null)
  return (
    <div className=" relative flex aspect-video h-full w-full items-center justify-center ">
      <div className="w-full h-full" ref={fullscreenWrapperRef}>
        <React.Suspense fallback={<div>Loading player...</div>}>
          <Player className="font-sans">
            <HLSSource
              key={initialLesson.hls_url}
              src={initialLesson.hls_url}
            />
            {initialLesson.subtitles_url && (
              <track
                key={initialLesson.subtitles_url}
                src={initialLesson.subtitles_url}
                kind="subtitles"
                srcLang="en"
                label="English"
              />
            )}
          </Player>
        </React.Suspense>
      </div>
    </div>
  )
}
