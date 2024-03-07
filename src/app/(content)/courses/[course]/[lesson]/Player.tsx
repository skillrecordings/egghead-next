'use client'

import * as React from 'react'
import {HLSSource, Player, VideoProvider} from '@skillrecordings/player'
import {LessonResource} from '@/types'
import {use} from 'react'
import type {
  VideoEvent,
  VideoStateContext,
} from '@skillrecordings/player/dist/machines/video-machine'
import {get} from 'lodash'
import {useViewer} from '@/context/viewer-context'

export function PlayerTwo({
  lessonLoader,
}: {
  lessonLoader: Promise<LessonResource>
}) {
  const lesson = use(lessonLoader)
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
              ...lesson,
              ...loadedLesson,
            }
          },
      }}
    >
      <Player canAddNotes={false} className="font-sans">
        {lesson.hls_url && (
          <HLSSource key={lesson.hls_url} src={lesson.hls_url} />
        )}
      </Player>
    </VideoProvider>
  )
}
