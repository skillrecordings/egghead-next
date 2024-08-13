import * as React from 'react'
import {loadLesson} from '@/lib/lessons'
import {VideoResource} from '@/types'
import Embed from './_components/embed-lesson'

type Props = {
  params: {slug: string}
}

export default async function LessonEmbedPage({params}: Props) {
  const initialLesson = await loadLesson(params.slug)

  if (!initialLesson) {
    return <div>Lesson not found</div>
  }

  return (
    <div className="h-full w-full">
      <Embed initialLesson={initialLesson as VideoResource} />
    </div>
  )
}
