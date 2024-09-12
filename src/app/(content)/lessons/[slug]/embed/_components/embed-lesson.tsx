'use client'
import React from 'react'
import {useViewer} from '@/context/viewer-context'
import {type VideoResource} from '@/types'
import {VideoProvider} from '@skillrecordings/player'
import {
  VideoEvent,
  VideoStateContext,
} from '@skillrecordings/player/dist/machines/video-machine'
import get from 'lodash/get'
import EmbedPlayer from './embed-player'

export default function Embed({initialLesson}: {initialLesson: VideoResource}) {
  const {viewer} = useViewer()

  return (
    <VideoProvider
      services={{
        loadViewer:
          (_context: VideoStateContext, _event: VideoEvent) => async () => {
            return await viewer
          },
        loadResource:
          (_context: VideoStateContext, event: VideoEvent) => async () => {
            const loadedLesson = get(event, 'resource') as any
            return {
              ...initialLesson,
              ...loadedLesson,
            }
          },
      }}
    >
      <EmbedPlayer initialLesson={initialLesson} />
    </VideoProvider>
  )
}
