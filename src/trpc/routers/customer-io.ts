import {router, baseProcedure} from '../trpc.server'
import {z} from 'zod'
import {identifyMutation} from 'lib/customer-io'

export const customerIORouter = router({
  identify: baseProcedure
    .input(
      z.object({
        email: z.string().optional(),
        id: z.string().optional(),
        selectedInterests: z.object({
          article_cta_portfolio: z.number().optional(),
        }),
      }),
    )
    .mutation(async ({input, ctx}) => {
      await identifyMutation({input, ctx})
    }),
})
