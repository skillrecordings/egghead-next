import {router, baseProcedure} from '../trpc.server'
import {z} from 'zod'
import {ACCESS_TOKEN_KEY} from '../../utils/auth'
import {loadLessonProgress, loadPlaylistProgress} from '../../lib/progress'
import {loadUserCompletedCourses} from 'lib/users'

export const progressRouter = router({
  completedCourses: baseProcedure.query(async ({ctx}) => {
    const token = ctx.req?.cookies[ACCESS_TOKEN_KEY]
    if (!token) return []

    const {completeCourses} = await loadUserCompletedCourses(token)
    return completeCourses
  }),
  forPlaylist: baseProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({input, ctx}) => {
      const token = ctx.req?.cookies[ACCESS_TOKEN_KEY]

      if (!token) return null

      return await loadPlaylistProgress({token, slug: input.slug})
    }),
  forLesson: baseProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({input, ctx}) => {
      const token = ctx.req?.cookies[ACCESS_TOKEN_KEY]

      if (!token) return null

      return await loadLessonProgress({token, slug: input.slug})
    }),
  markLessonComplete: baseProcedure
    .input(
      z.object({
        lessonId: z.number(),
        collectionId: z.number(),
      }),
    )
    .mutation(async ({input, ctx}) => {
      const token = ctx.req?.cookies[ACCESS_TOKEN_KEY]

      if (!token) return null
      const {lessonId, collectionId} = input

      let res = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/watch/manual_complete`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'X-SITE-CLIENT': process.env.NEXT_PUBLIC_CLIENT_ID as string,
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            lesson_view: {
              lesson_id: lessonId,
              collection_id: collectionId,
              collection_type: 'playlist',
            },
          }),
        },
      ).then((res) => res.json())

      return res
    }),
})
