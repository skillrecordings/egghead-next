import {router, baseProcedure} from '../trpc'
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
  postCheckoutDetails: baseProcedure
    .input(
      z.object({
        checkoutSessionId: z.string(),
      }),
    )
    .query(async ({input, ctx}) => {
      const session = await stripe.checkout.sessions.retrieve(
        input.checkoutSessionId,
        {expand: ['payment_intent', 'invoice']},
      )

      if (!session)
        throw new Error(`no session loaded for ${input.checkoutSessionId}`)

      const customer = (await stripe.customers.retrieve(
        session.customer as string,
      )) as Stripe.Customer

      if (session.mode === 'payment') {
        // this is a one-time payment, we expect a Payment Intent
        const paymentIntent = session.payment_intent as Stripe.PaymentIntent

        if (!paymentIntent)
          throw new Error('no payment intent found for one-time purchase')

        const chargeId = paymentIntent.charges.data[0].id

        const charge = await stripe.charges.retrieve(chargeId)

        if (!charge) throw new Error(`no session loaded for ${chargeId}`)

        return {
          customer,
          session,
          charge,
        }
      }

      if (session.mode === 'subscription') {
        // this is a subscription, we expect an Invoice
        if (!('invoice' in session))
          throw new Error('no invoice found for subscription')

        const invoice = session.invoice as Stripe.Invoice

        const chargeId = invoice.charge as string

        const charge = await stripe.charges.retrieve(chargeId)

        if (!charge) throw new Error(`no session loaded for ${chargeId}`)

        return {
          customer,
          session,
          charge,
        }
      }

      return {
        customer,
        session,
        charge: null,
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
