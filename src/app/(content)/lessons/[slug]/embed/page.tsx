import * as React from 'react'
import {loadLesson} from '@/lib/lessons'
import {getCourseBuilderLesson} from '@/lib/get-course-builder-metadata'
import Embed from './_components/embed-lesson'
import type {EmbedLessonResource} from './_components/embed-player'

export const revalidate = 3600

export async function generateStaticParams() {
  return []
}

type Props = {
  params: Promise<{slug: string}>
}

export default async function LessonEmbedPage({params}: Props) {
  const {slug} = await params

  const courseBuilderLesson = await getCourseBuilderLesson(slug)

  const initialLesson = courseBuilderLesson?.muxPlaybackId
    ? ({
        slug,
        title: courseBuilderLesson.title ?? slug,
        muxPlaybackId: courseBuilderLesson.muxPlaybackId,
      } satisfies EmbedLessonResource)
    : await loadLesson(
        slug,
        undefined,
        false,
        {},
        {
          includeComments: false,
          allowRuntimeCaches: false,
        },
      )

  if (!initialLesson) {
    return <div>Lesson not found</div>
  }

  return (
    <div className="h-full w-full">
      <Embed initialLesson={initialLesson as EmbedLessonResource} />
    </div>
  )
}
