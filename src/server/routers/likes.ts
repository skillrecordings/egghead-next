import {z} from 'zod'
import {router, baseProcedure} from '../trpc'
import {
  addLikeToPostForUser,
  removeLikeFromPostForUser,
  getLikesForPost,
  hasUserLikedPost,
  getLikedPostIdsForUser,
  type LikeResponse,
} from '@/lib/likes'
import {loadUser} from '@/lib/current-user'

export const likesRouter = router({
  getLikesForPost: baseProcedure
    .input(z.object({postId: z.number()}))
    .query(async ({input}) => {
      return getLikesForPost({postId: input.postId})
    }),

  addLikeToPost: baseProcedure
    .input(z.object({postId: z.number()}))
    .mutation(async ({input, ctx}): Promise<LikeResponse> => {
      const token = ctx?.userToken
      if (!token) return {success: false, error: 'Unauthorized'}

      const user = await loadUser(token)

      return addLikeToPostForUser({
        postId: input.postId,
        userId: user.id,
      })
    }),

  removeLikeFromPost: baseProcedure
    .input(z.object({postId: z.number()}))
    .mutation(async ({input, ctx}): Promise<LikeResponse> => {
      const token = ctx?.userToken
      if (!token) return {success: false, error: 'Unauthorized'}

      const user = await loadUser(token)

      return removeLikeFromPostForUser({
        postId: input.postId,
        userId: user.id,
      })
    }),

  // Additional useful endpoints
  hasUserLikedPost: baseProcedure
    .input(z.object({postId: z.number()}))
    .query(async ({input, ctx}) => {
      const token = ctx?.userToken
      if (!token) return false

      const user = await loadUser(token)

      return hasUserLikedPost({
        postId: input.postId,
        userId: user.id,
      })
    }),

  getUserLikedPosts: baseProcedure.query(async ({ctx}) => {
    const token = ctx?.userToken
    if (!token) return []

    const user = await loadUser(token)

    return getLikedPostIdsForUser({
      userId: user.id,
    })
  }),

  toggleLike: baseProcedure
    .input(z.object({postId: z.number()}))
    .mutation(async ({input, ctx}): Promise<LikeResponse> => {
      const token = ctx?.userToken
      if (!token) return {success: false, error: 'Unauthorized'}

      const user = await loadUser(token)

      const isLiked = await hasUserLikedPost({
        postId: input.postId,
        userId: user.id,
      })

      if (isLiked) {
        return removeLikeFromPostForUser({
          postId: input.postId,
          userId: user.id,
        })
      } else {
        return addLikeToPostForUser({
          postId: input.postId,
          userId: user.id,
        })
      }
    }),
})
