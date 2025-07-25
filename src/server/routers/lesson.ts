import {router, baseProcedure} from '../trpc'
import {z} from 'zod'
import {loadAssociatedLessonsByTag, loadLesson} from '@/lib/lessons'

export const lessonRouter = router({
  getAssociatedLessonsByTag: baseProcedure
    .input(
      z.object({
        tag: z.string(),
        currentLessonSlug: z.string().optional(),
      }),
    )
    .query(async ({input, ctx}) => {
      const {tag, currentLessonSlug} = input

      let data = await loadAssociatedLessonsByTag(tag)
      const filteredData = currentLessonSlug
        ? data.filter(
            (lesson: {slug: string}) => lesson.slug !== currentLessonSlug,
          )
        : data

      return filteredData
    }),
  getLessonbySlug: baseProcedure
    .input(z.object({slug: z.string()}))
    .query(async ({input, ctx}) => {
      const {slug} = input
      const lesson = await loadLesson(slug, ctx?.userToken)
      return lesson
    }),
})
