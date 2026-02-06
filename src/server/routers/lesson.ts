import {router, baseProcedure} from '../trpc'
import {z} from 'zod'
import {loadAssociatedLessonsByTag, loadLesson} from '@/lib/lessons'
import {logEvent} from '@/utils/structured-log'

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
      const lesson = await loadLesson(slug, ctx?.userToken, false, {
        request_id: ctx?.req?.headers?.get('x-egghead-request-id') ?? undefined,
        route: '/api/trpc',
        page: 'lesson',
        lesson_slug: slug,
      })
      logEvent('info', 'lesson.trpc.getLessonbySlug.result', {
        lesson_slug: slug,
        has_hls: Boolean((lesson as any)?.hls_url),
        has_dash: Boolean((lesson as any)?.dash_url),
        has_token: Boolean(ctx?.userToken),
      })
      return lesson
    }),
})
