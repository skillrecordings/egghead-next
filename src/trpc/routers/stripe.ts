import {router, baseProcedure} from '../trpc.server'
import {z} from 'zod'
import {stripe} from '../../utils/stripe'
import {Stripe} from 'stripe'

export const stripeRouter = router({
  checkoutSessionById: baseProcedure
    .input(
      z.object({
        checkoutSessionId: z.string(),
      }),
    )
    .query(async ({input, ctx}) => {
      const session = await stripe.checkout.sessions.retrieve(
        input.checkoutSessionId,
      )

      if (!session)
        throw new Error(`no session loaded for ${input.checkoutSessionId}`)

      const customer = (await stripe.customers.retrieve(
        session.customer as string,
      )) as Stripe.Customer

      return {
        customer,
        session,
      }
    }),
  chargeById: baseProcedure
    .input(
      z.object({
        chargeId: z.string(),
      }),
    )
    .query(async ({input, ctx}) => {
      const charge = await stripe.charges.retrieve(input.chargeId)

      if (!charge) throw new Error(`no session loaded for ${input.chargeId}`)

      return charge
    }),
})
