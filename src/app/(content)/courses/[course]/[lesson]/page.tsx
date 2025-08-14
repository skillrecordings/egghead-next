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
import {CopyAsPromptButton} from '@/components/copy-as-prompt-button'

export default async function LessonPage({
  params,
}: {
  params: Promise<{
    lesson: string
    course: string
  }>
}) {
  const {lesson, course} = await params
  const cookieStore = await cookies()
  const userToken = cookieStore?.get(ACCESS_TOKEN_KEY ?? '')?.value
  const ability = await getAbilityFromToken(userToken)

  if (!ability.can('create', 'Content')) {
    redirect('/')
  }

  const lessonLoader = loadLesson(lesson)
  const courseLoader = loadCourse(course)

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
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
        {lesson.description && (
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {lesson.description}
          </p>
        )}

        <div className="flex gap-3 items-center">
          <CopyAsPromptButton
            title={lesson.title}
            description={lesson.description}
            transcript={lesson?.transcript}
            contentType="lesson"
            contentId={lesson.id}
          />
        </div>
      </div>
    </div>
  )
}
