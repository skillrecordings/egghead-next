'use client'
import React from 'react'
import EmbedPlayer, {type EmbedLessonResource} from './embed-player'

export default function Embed({
  initialLesson,
}: {
  initialLesson: EmbedLessonResource
}) {
  return <EmbedPlayer initialLesson={initialLesson} />
}
