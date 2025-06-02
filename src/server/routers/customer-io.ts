import {router, baseProcedure} from '../trpc'
import {z} from 'zod'
import {inngest} from '@/inngest/inngest.server'
import {CUSTOMER_IO_IDENTIFY_EVENT} from '@/inngest/events/identify-customer-io'

export const customerIORouter = router({
  identify: baseProcedure
    .input(
      z.object({
        email: z.string().email('Invalid email format'),
        id: z.string().optional(),
        selectedInterests: z.record(z.number().optional()),
      }),
    )
    .mutation(async ({input, ctx}) => {
      const {email, selectedInterests} = input

      // Filter out undefined values
      const filteredSelectedInterests = Object.fromEntries(
        Object.entries(selectedInterests).filter(([, v]) => v !== undefined),
      )

      const token = ctx?.userToken || process.env.EGGHEAD_SUPPORT_BOT_TOKEN
      if (!token) {
        throw new Error('Authentication required')
      }

      await inngest.send({
        name: CUSTOMER_IO_IDENTIFY_EVENT,
        data: {
          email,
          selectedInterests: filteredSelectedInterests as {[k: string]: number},
          userToken: token,
        },
      })

      return {
        email,
        selectedInterests: filteredSelectedInterests,
      }
    }),
})
