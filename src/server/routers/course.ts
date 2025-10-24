import {router, baseProcedure} from '../trpc'
import {z} from 'zod'
import {loadRatings} from '@/lib/ratings'
import {loadCourse} from '@/lib/courses'

export const courseRouter = router({
  getRatings: baseProcedure
    .input(z.object({slug: z.string(), type: z.string()}))
    .query(async ({input}) => {
      return loadRatings(input.slug, input.type)
    }),
  getCourse: baseProcedure
    .input(z.object({slug: z.string()}))
    .query(async ({input, ctx}) => {
      return loadCourse(input.slug, ctx.userToken)
    }),
})
