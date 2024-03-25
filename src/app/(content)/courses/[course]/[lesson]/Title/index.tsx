import React, {Suspense} from 'react'
import {LessonResource} from '@/types'
import LessonCompleted from './LessonCompleted'
import {loadLessonProgress} from '@/lib/progress'

export default async function Title({
  lesson,
  userToken,
  courseLoader,
}: {
  lesson: LessonResource
  courseLoader: Promise<any>
  userToken?: string
}) {
  const {title, slug} = lesson

  const lessonProgressLoader = loadLessonProgress({
    token: userToken,
    slug: slug,
  })

  return title && userToken ? (
    <div className="flex space-x-2 -ml-7">
      <Suspense>
        <LessonCompleted
          userToken={userToken}
          courseLoader={courseLoader}
          lessonProgressLoader={lessonProgressLoader}
          lessonId={lesson.id}
        />
      </Suspense>
      <h1 className="text-xl font-extrabold leading-tight lg:text-3xl">
        {title}
      </h1>
    </div>
  ) : (
    <h1 className="text-xl font-extrabold leading-tight lg:text-3xl">
      {title}
    </h1>
  )
}
