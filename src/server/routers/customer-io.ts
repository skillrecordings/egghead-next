import {router, baseProcedure} from '../trpc'
import {z} from 'zod'
import {inngest} from '@/inngest/inngest.server'
import {CUSTOMER_IO_IDENTIFY_EVENT} from '@/inngest/events/identify-customer-io'
import emailIsValid from '@/utils/email-is-valid'

export const customerIORouter = router({
  identify: baseProcedure
    .input(
      z.object({
        email: z.string().optional(),
        id: z.string().optional(),
        selectedInterests: z.record(z.number().optional()),
      }),
    )
    .mutation(async ({input, ctx}) => {
      const {email, selectedInterests} = input
      if (!email || (email && !emailIsValid(email)))
        return new Error('Invalid email')

      const token = ctx?.userToken || process.env.EGGHEAD_SUPPORT_BOT_TOKEN
      if (!token) return new Error('No token found')

      await inngest.send({
        name: CUSTOMER_IO_IDENTIFY_EVENT,
        data: {
          email,
          selectedInterests,
          userToken: token,
        },
      })

      return {
        email,
        selectedInterests,
      }
    }),
})
