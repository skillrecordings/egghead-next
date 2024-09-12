'use client'
import React from 'react'
import {type VideoResource} from '@/types'
import {HLSSource, Player} from '@skillrecordings/player'
import {MinimalEmbedPlayer} from './minimal-embed-player'

import './embed-lesson.css'
import {GenericErrorBoundary} from '@/components/generic-error-boundary'

export default function EmbedPlayer({
  initialLesson,
}: {
  initialLesson: VideoResource
}) {
  const fullscreenWrapperRef = React.useRef<HTMLDivElement>(null)

  return (
    <div className=" relative flex aspect-video h-full w-full items-center justify-center ">
      <div className="w-full h-full" ref={fullscreenWrapperRef}>
        <GenericErrorBoundary>
          <React.Suspense fallback={<div>Loading minimal player...</div>}>
            <MinimalEmbedPlayer>
              <HLSSource
                key={initialLesson?.hls_url}
                src={initialLesson?.hls_url}
              />
              {initialLesson?.subtitles_url && (
                <track
                  key={initialLesson?.subtitles_url ?? ''}
                  src={initialLesson?.subtitles_url ?? ''}
                  kind="subtitles"
                  srcLang="en"
                  label="English"
                />
              )}
            </MinimalEmbedPlayer>
          </React.Suspense>
        </GenericErrorBoundary>
      </div>
    </div>
  )
}
