import {router, baseProcedure} from '../trpc'
import {z} from 'zod'
import {loadAssociatedLessonsByTag, loadLesson} from '@/lib/lessons'
import {logEvent} from '@/utils/structured-log'

function isGraphQL403(e: unknown): boolean {
  return e instanceof Error && e.message.includes('Code: 403')
}

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

      try {
        let data = await loadAssociatedLessonsByTag(tag)
        const filteredData = currentLessonSlug
          ? data.filter(
              (lesson: {slug: string}) => lesson.slug !== currentLessonSlug,
            )
          : data

        return filteredData
      } catch (e) {
        if (isGraphQL403(e)) {
          logEvent('warn', 'lesson.getAssociatedLessonsByTag.403_fallback', {
            tag,
          })
          return []
        }
        throw e
      }
    }),
  getLessonbySlug: baseProcedure
    .input(z.object({slug: z.string()}))
    .query(async ({input, ctx}) => {
      const {slug} = input
      try {
        const lesson = await loadLesson(slug, ctx?.userToken, false, {
          request_id:
            ctx?.req?.headers?.get('x-egghead-request-id') ?? undefined,
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
      } catch (e) {
        if (isGraphQL403(e) && ctx?.userToken) {
          logEvent('warn', 'lesson.getLessonbySlug.403_fallback', {
            slug,
            user_id: ctx.userId ?? null,
          })
          // Retry without auth — lesson data is public
          const lesson = await loadLesson(slug, undefined, false, {
            request_id:
              ctx?.req?.headers?.get('x-egghead-request-id') ?? undefined,
            route: '/api/trpc',
            page: 'lesson',
            lesson_slug: slug,
          })
          logEvent('info', 'lesson.trpc.getLessonbySlug.result', {
            lesson_slug: slug,
            has_hls: Boolean((lesson as any)?.hls_url),
            has_dash: Boolean((lesson as any)?.dash_url),
            has_token: false,
            retried_without_auth: true,
          })
          return lesson
        }
        throw e
      }
    }),
})
