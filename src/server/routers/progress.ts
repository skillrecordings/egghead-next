import {baseProcedure, router} from '../trpc'
import {z} from 'zod'
import {loadLessonProgress, loadPlaylistProgress} from '../../lib/progress'
import {loadUserCompletedCourses} from '@/lib/users'

const createLessonView = async (
  lessonId: String | Number,
  token: string | null = null,
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/lessons/${lessonId}/views`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        lesson_view: {
          lessonId,
        },
      }),
    },
  )

  return res.ok ? res.json() : null
}

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
  addProgressToLesson: baseProcedure
    .input(
      z.object({
        lessonId: z.union([z.number(), z.string()]).nullish(),
        secondsWatched: z.number().nullish(),
      }),
    )
    .mutation(async ({input, ctx}) => {
      const token = ctx?.userToken

      if (!token || !input.secondsWatched || !input.lessonId) return null

      const roundedProgress = Math.ceil(input.secondsWatched)
      const isSegment = roundedProgress % 30 === 0

      if (!isSegment) {
        return
      }

      const incrementViewSegments = async (
        lessonView: {increment_url: string} | null,
      ) => {
        if (!lessonView) return null
        const res = await fetch(lessonView.increment_url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        })
        return res.ok ? res.json() : null
      }

      return await createLessonView(input.lessonId, token).then(
        incrementViewSegments,
      )
    }),
  markLessonComplete: baseProcedure
    .input(
      z.object({
        lessonId: z.number(),
        collectionId: z.number().optional(),
      }),
    )
    .mutation(async ({input, ctx}) => {
      const token = ctx?.userToken

      if (!token) return null
      const {lessonId, collectionId} = input

      return await fetch(
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
    }),
})
