import {loadLesson} from '@/lib/lessons'
import {loadCourse} from '@/lib/courses'
import {LessonResource} from '@/types'
import {notFound} from 'next/navigation'
import {PlayerTwo} from '@/app/(content)/courses/[course]/[lesson]/Player'
import {Suspense} from 'react'

export default async function LessonPage({
  searchParams,
  params,
}: {
  searchParams: URLSearchParams
  params: {
    lesson: string
    course: string
  }
}) {
  console.log('searchParams', searchParams)
  console.log('params', params)
  const lessonLoader = loadLesson(params.lesson)
  const courseLoader = loadCourse(params.course)

  return (
    <div>
      <LessonHeader lessonLoader={lessonLoader} />
      <Suspense>
        <PlayerTwo lessonLoader={lessonLoader} />
      </Suspense>
    </div>
  )
}

const LessonHeader = async ({
  lessonLoader,
}: {
  lessonLoader: Promise<LessonResource>
}) => {
  const lesson = await lessonLoader

  if (!lesson) {
    return notFound()
  }

  return (
    <div>
      <h1>{lesson.title}</h1>
      <p>{lesson.description}</p>
    </div>
  )
}
