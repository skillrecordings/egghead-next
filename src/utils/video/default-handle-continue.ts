import {type Module} from '@/schemas/module'
import {type Section} from '@/schemas/section'
import {type Exercise} from '@/schemas/exercise'
import {type Lesson} from '@/schemas/lesson'
import {type NextRouter} from 'next/router'

export const defaultHandleContinue = async ({
  router,
  module,
  section,
  nextExercise,
  handlePlay,
  path,
}: {
  router: NextRouter
  module: Module
  section?: Section | null
  nextExercise?: Lesson | null
  handlePlay: () => void
  path: string
}) => {
  if (nextExercise?._type === 'solution') {
    if (section) {
      const exercise =
        section.lessons &&
        section.lessons.find((exercise: Exercise) => {
          const solution = exercise.solution
          return solution?._key === nextExercise._key
        })

      return (
        exercise &&
        // needs to be updated to new router
        (await router
          .push({
            query: {
              module: module.slug.current,
              section: section.slug,
              lesson: exercise.slug,
            },

            pathname: `${path}/[module]/[section]/[lesson]/solution`,
          })
          .then(() => handlePlay()))
      )
    } else {
      const exercise =
        module.lessons &&
        module.lessons.find((exercise: Exercise) => {
          const solution = exercise.solution
          return solution?._key === nextExercise._key
        })

      return (
        exercise &&
        (await router
          .push({
            query: {
              module: module.slug.current,
              lesson: exercise.slug,
            },

            pathname: `${path}/[module]/[lesson]/solution`,
          })
          .then(() => handlePlay()))
      )
    }
  }
  if (section) {
    return await router
      .push({
        query: {
          module: module.slug.current,
          section: section.slug,
          lesson: nextExercise?.slug,
        },
        pathname: `${path}/[module]/[section]/[lesson]`,
      })
      .then(() => handlePlay())
  } else {
    return await router
      .push({
        query: {module: module.slug.current, lesson: nextExercise?.slug},
        pathname: `${path}/[module]/[lesson]`,
      })
      .then(() => handlePlay())
  }
}
