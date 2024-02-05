import {router, baseProcedure} from '../trpc'
import {z} from 'zod'
import {loadLessonProgress, loadPlaylistProgress} from '../../lib/progress'
import {loadUserCompletedCourses} from '@/lib/users'

export const progressRouter = router({
  completedCourseIds: baseProcedure.query(async ({ctx}): Promise<number[]> => {
    const {userId, userToken} = ctx
    if (!userToken || !userId) return []

    // select id from playlists join series_progresses on series_progresses.progressable_id = playlists.id where series_progresses.user_id = 71775 and series_progresses.last_lesson_watched_at is not null and series_progresses.is_complete = true;
    const completedCourseIds = (
      await ctx.prisma.playlist.findMany({
        select: {
          id: true,
        },
        where: {
          series_progresses: {
            some: {
              progressable_type: 'Playlist',
              user_id: userId,
              last_lesson_watched_at: {
                not: null,
              },
              is_complete: true,
            },
          },
        },
      })
    ).map((progress) => {
      return Number(progress.id)
    })
    return completedCourseIds
  }),
  completedCourses: baseProcedure.query(async ({ctx}) => {
    const token = ctx?.userToken
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
      const token = ctx?.userToken

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
      const token = ctx?.userToken

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
      const token = ctx?.userToken

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
