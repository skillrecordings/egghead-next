import {router, baseProcedure} from '../trpc'
import {z} from 'zod'
import {
  loadAssociatedLessonsByTag,
  loadLesson,
  loadLessonViewUrl,
  isGraphQL403,
} from '@/lib/lessons'
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
  // Per-viewer view-tracking URL. Kept separate from getLessonbySlug so the
  // lesson payload itself stays shareable.
  //
  // This answer is per user, so it is a *mutation* on purpose: tRPC's
  // httpBatchLink sends mutations as POST in their own batch (it keeps one
  // loader per operation type), so it can never be batched into a GET query
  // response, and POST responses are not stored by the CDN or the browser.
  // The slug is echoed back so the client only attaches a URL to the lesson
  // it was issued for.
  getLessonViewUrl: baseProcedure
    .input(z.object({slug: z.string()}))
    .mutation(async ({input, ctx}) => {
      const lesson_view_url = await loadLessonViewUrl(
        input.slug,
        ctx?.userToken,
        {
          request_id:
            ctx?.req?.headers?.get('x-egghead-request-id') ?? undefined,
          route: '/api/trpc',
          page: 'lesson',
          lesson_slug: input.slug,
        },
      )
      return {slug: input.slug, lesson_view_url}
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
