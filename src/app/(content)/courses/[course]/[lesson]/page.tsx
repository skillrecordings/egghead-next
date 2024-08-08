import {loadLesson} from '@/lib/lessons'
import {loadCourse} from '@/lib/courses'
import {PlayerTwo} from '@/app/(content)/courses/[course]/[lesson]/Player'
import {Suspense} from 'react'
import {ACCESS_TOKEN_KEY} from '@/utils/auth'
import {getAbilityFromToken} from '@/server/ability'
import {redirect} from 'next/navigation'
import {cookies} from 'next/headers'
import LessonHeader from './LessonHeader'

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
  // const ability = await getAbilityFromToken(userToken)

  // if (!ability.can('create', 'Content')) {
  //   redirect('/')
  // }

  const lessonLoader = loadLesson(params.lesson)
  const courseLoader = loadCourse(params.course)

  return (
    <Suspense>
      <div className="bg-black w-full lg:grid lg:grid-cols-12 lg:space-y-0 relative">
        <div className="relative before:float-left after:clear-both after:table col-span-9">
          <PlayerTwo lessonLoader={lessonLoader} courseLoader={courseLoader} />
        </div>
      </div>
      <LessonHeader
        lessonLoader={lessonLoader}
        courseLoader={courseLoader}
        userToken={userToken}
      />
    </Suspense>
  )
}
