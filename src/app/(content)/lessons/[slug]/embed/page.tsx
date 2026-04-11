import * as React from 'react'
import {loadLesson} from '@/lib/lessons'
import {VideoResource} from '@/types'
import Embed from './_components/embed-lesson'

export const revalidate = 3600

export async function generateStaticParams() {
  return []
}

type Props = {
  params: Promise<{slug: string}>
}

export default async function LessonEmbedPage({params}: Props) {
  const {slug} = await params
  const initialLesson = await loadLesson(
    slug,
    undefined,
    false,
    {},
    {includeComments: false},
  )

  if (!initialLesson) {
    return <div>Lesson not found</div>
  }

  return (
    <div className="h-full w-full">
      <Embed initialLesson={initialLesson as VideoResource} />
    </div>
  )
}
