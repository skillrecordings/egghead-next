import {useRouter, useSearchParams} from 'next/navigation'

import {type Lesson} from '@/schemas/lesson'

// import {trpcSkillLessons} from '@/utils/trpc-skill-lessons'
import {type Section} from '@/schemas/section'
import {type Module} from '@/schemas/module'

export const useNextLesson = (
  lesson: Lesson,
  module: Module,
  section?: Section,
) => {
  const router = useRouter()

  let slug = lesson.slug
  const searchParams = useSearchParams()
  const lessonParam = searchParams?.get('lesson') || ''

  if (lesson._type === 'solution') {
    slug = lessonParam as string
  }

  //! tips return undefined so mocking that here
  // const {data: nextExercise, status: nextExerciseStatus} =
  //   trpcSkillLessons.lessons.getNextLesson.useQuery({
  //     type: lesson._type,
  //     slug,
  //     module: module.slug.current,
  //     section: section?.slug,
  //   })

  const nextExercise = undefined
  const nextExerciseStatus = undefined

  return {nextExercise, nextExerciseStatus}
}
