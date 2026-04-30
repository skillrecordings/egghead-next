import {baseProcedure, router} from '../trpc'
import {z} from 'zod'
import {loadLessonProgress, loadPlaylistProgress} from '../../lib/progress'
import {loadUserCompletedCourses} from '@/lib/users'
import {timeEvent, logEvent} from '@/utils/structured-log'

function isGraphQL403(e: unknown): boolean {
  return e instanceof Error && e.message.includes('Code: 403')
}

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
    ).map((progress: {id: bigint | number | string}) => {
      return Number(progress.id)
    })
    return completedCourseIds
  }),
  completedCourses: baseProcedure.query(async ({ctx}) => {
    const token = ctx?.userToken
    if (!token) return []

    try {
      const {completeCourses} = await timeEvent(
        'progress.completedCourses.graphql',
        {has_token: !!token},
        async () => loadUserCompletedCourses(token),
      )
      return completeCourses
    } catch (e) {
      if (isGraphQL403(e)) {
        logEvent('warn', 'progress.completedCourses.403_stale_token', {
          user_id: ctx.userId ?? null,
        })
        return []
      }
      throw e
    }
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

      try {
        return await timeEvent(
          'progress.forPlaylist.graphql',
          {slug: input.slug, has_token: !!token},
          async () => loadPlaylistProgress({token, slug: input.slug}),
        )
      } catch (e) {
        if (isGraphQL403(e)) {
          logEvent('warn', 'progress.forPlaylist.403_stale_token', {
            slug: input.slug,
            user_id: ctx.userId ?? null,
          })
          return null
        }
        throw e
      }
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

      try {
        return await timeEvent(
          'progress.forLesson.graphql',
          {slug: input.slug, has_token: !!token},
          async () => loadLessonProgress({token, slug: input.slug}),
        )
      } catch (e) {
        if (isGraphQL403(e)) {
          logEvent('warn', 'progress.forLesson.403_stale_token', {
            slug: input.slug,
            user_id: ctx.userId ?? null,
          })
          return null
        }
        throw e
      }
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
