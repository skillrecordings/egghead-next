import React from 'react'
import LessonCompletedClient from './LessonCompletedClient'

export default async function LessonCompleted({
  lessonProgressLoader,
  courseLoader,
  userToken,
  lessonId,
}: {
  lessonProgressLoader: Promise<any>
  courseLoader: Promise<any>
  userToken?: string
  lessonId: string | number
}) {
  const course = await courseLoader
  const markLessonComplete = async () => {
    'use server'

    await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/watch/manual_complete`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userToken}`,
          'X-SITE-CLIENT': process.env.NEXT_PUBLIC_CLIENT_ID as string,
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          lesson_view: {
            lesson_id: lessonId,
            collection_id: course.id,
            collection_type: 'playlist',
          },
        }),
      },
    )
  }

  return (
    <LessonCompletedClient
      lessonProgressLoader={lessonProgressLoader}
      markLessonComplete={markLessonComplete}
    />
  )
}
