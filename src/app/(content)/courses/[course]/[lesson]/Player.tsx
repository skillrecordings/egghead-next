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
import PlayerSidebar from './PlayerSidebar'

export function PlayerTwo({
  lessonLoader,
  courseLoader,
}: {
  lessonLoader: Promise<LessonResource>
  courseLoader: Promise<any>
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
        <div className="flex flex-col col-span-3 dark:bg-gray-800 bg-gray-50">
          <PlayerSidebar lesson={lesson} courseLoader={courseLoader} />
        </div>
      </Player>
    </VideoProvider>
  )
}
