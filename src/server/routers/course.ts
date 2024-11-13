import {router, baseProcedure} from '../trpc'
import {z} from 'zod'
import {loadRatings} from '@/lib/ratings'

export const courseRouter = router({
  getRatings: baseProcedure
    .input(z.object({slug: z.string(), type: z.string()}))
    .query(async ({input}) => {
      return loadRatings(input.slug, input.type)
    }),
})
