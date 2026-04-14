'use client'
import React from 'react'
import MuxPlayer, {type MuxPlayerProps} from '@mux/mux-player-react'
import {GenericErrorBoundary} from '@/components/generic-error-boundary'
import './embed-lesson.css'

export type EmbedLessonResource = {
  slug: string
  title?: string
  hls_url?: string
  muxPlaybackId?: string
}

const getPlaybackId = (lesson: EmbedLessonResource) => {
  if (lesson?.muxPlaybackId) return lesson.muxPlaybackId

  const match = lesson?.hls_url?.match(/stream\.mux\.com\/([^/.]+)\.m3u8/i)
  return match?.[1]
}

export default function EmbedPlayer({
  initialLesson,
}: {
  initialLesson: EmbedLessonResource
}) {
  const playbackId = getPlaybackId(initialLesson)
  const playerProps = {
    id: 'mux-player',
    streamType: 'on-demand',
    defaultHiddenCaptions: true,
    thumbnailTime: 0,
  } as MuxPlayerProps

  if (!playbackId) {
    return null
  }

  return (
    <div className="relative flex aspect-video h-full w-full items-center justify-center">
      <div className="h-full w-full">
        <GenericErrorBoundary>
          <MuxPlayer
            playbackId={playbackId}
            metadata={{
              video_title: initialLesson?.title,
              video_id: initialLesson?.slug,
            }}
            accentColor="#3b82f6"
            className="h-full w-full"
            {...playerProps}
          />
        </GenericErrorBoundary>
      </div>
    </div>
  )
}
