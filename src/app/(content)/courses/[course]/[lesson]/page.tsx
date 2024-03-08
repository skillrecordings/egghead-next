import {loadLesson} from '@/lib/lessons'
import {loadCourse} from '@/lib/courses'
import {LessonResource} from '@/types'
import {notFound} from 'next/navigation'
import {PlayerTwo} from '@/app/(content)/courses/[course]/[lesson]/Player'
import {Suspense} from 'react'
import {ACCESS_TOKEN_KEY} from '@/utils/auth'
import {getAbilityFromToken} from '@/server/ability'
import {redirect} from 'next/navigation'
import {cookies} from 'next/headers'

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
  const cookieStore = cookies()
  const userToken = cookieStore?.get(ACCESS_TOKEN_KEY ?? '')?.value
  const ability = await getAbilityFromToken(userToken)

  if (!ability.can('create', 'Content')) {
    redirect('/')
  }

  const lessonLoader = loadLesson(params.lesson)
  const courseLoader = loadCourse(params.course)

  return (
    <div>
      <Suspense>
        <div className="bg-black w-full lg:grid lg:grid-cols-12 lg:space-y-0 relative">
          <div className="relative before:float-left after:clear-both after:table col-span-9">
            <PlayerTwo
              lessonLoader={lessonLoader}
              courseLoader={courseLoader}
            />
          </div>
        </div>
      </Suspense>
      <LessonHeader lessonLoader={lessonLoader} />
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
