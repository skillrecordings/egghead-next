import {router, baseProcedure} from '../trpc.server'
import {z} from 'zod'
import {ACCESS_TOKEN_KEY} from '../../utils/auth'
import {loadPlaylistProgress} from '../../lib/progress'

export const progressRouter = router({
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
})
