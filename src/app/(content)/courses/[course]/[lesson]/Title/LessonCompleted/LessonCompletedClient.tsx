'use client'
import React, {use} from 'react'
import {CheckCircleIcon} from '@heroicons/react/solid'
import {CheckCircleIcon as CheckCircleIconOutline} from '@heroicons/react/outline'

export default function LessonCompletedClient({
  lessonProgressLoader,
  markLessonComplete,
}: {
  lessonProgressLoader: Promise<any>
  markLessonComplete: () => Promise<void>
}) {
  const [lessonCompleted, setLessonCompleted] = React.useState<boolean>(false)
  const lessonProgress = use(lessonProgressLoader)
  const {completed} = lessonProgress.lessonProgress

  React.useEffect(() => {
    if (completed) {
      setLessonCompleted(completed)
    }
  }, [completed])

  return lessonCompleted ? (
    <span className="self-center">
      <CheckCircleIcon className="h-5 w-5 text-green-500  rounded-full" />
    </span>
  ) : (
    <span
      className="self-center"
      onClick={() => {
        markLessonComplete()
        setLessonCompleted(true)
      }}
    >
      <CheckCircleIconOutline className="h-5 w-5 text-gray-300 hover:text-green-500 hover:cursor-pointer " />
    </span>
  )
}
