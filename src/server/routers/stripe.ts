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
  getSubscription: baseProcedure
    .input(
      z.object({
        subscriptionId: z.string().optional(),
      }),
    )
    .query(async ({input, ctx}) => {
      if (!input.subscriptionId) return null
      const subscription = await stripe.subscriptions.retrieve(
        input.subscriptionId,
      )
      return subscription
    }),
  workshopTransactionsForCurrent: baseProcedure.query(async ({ctx}) => {
    const token = ctx?.userToken

    if (!token) return []

    try {
      // Get current user to fetch email
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/users/current`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-SITE-CLIENT': process.env.NEXT_PUBLIC_CLIENT_ID as string,
          },
        },
      )

      if (!userResponse.ok) {
        return []
      }

      const user = await userResponse.json()

      if (!user?.email) {
        return []
      }

      // Search all recent sessions and filter by customer_details.email
      // This works for payment link purchases which don't have a customer ID
      const sessions = await stripe.checkout.sessions.list({
        limit: 100,
      })

      // Filter sessions by the user's email in customer_details
      const userSessions = sessions.data.filter((session) => {
        return session.customer_details?.email === user.email
      })

      console.log('userSessions----', userSessions)

      // Filter for completed workshop sessions (payment links or one-time payments)
      const workshopSessions = userSessions.filter((session) => {
        // Only include completed sessions
        if (session.status !== 'complete') return false

        // Check if this is a workshop purchase:
        // 1. Has a payment_link (payment links are used for workshops)
        const hasPaymentLink = !!session.payment_link

        // Include if it has a payment link
        return hasPaymentLink
      })

      // Transform to our expected format
      const workshopTransactions = await Promise.all(
        workshopSessions.map(async (session) => {
          // Get the charge details for invoice link
          let chargeId = null
          if (
            session.payment_intent &&
            typeof session.payment_intent === 'string'
          ) {
            try {
              const paymentIntent = await stripe.paymentIntents.retrieve(
                session.payment_intent,
              )
              chargeId = paymentIntent.charges.data[0]?.id
            } catch (error) {
              console.error('Error retrieving payment intent:', error)
            }
          }

          // Determine product name based on amount or metadata
          let productName = 'Workshop'
          if (session.metadata?.product_name) {
            productName = session.metadata.product_name
          } else if (session.amount_total === 35000) {
            productName = 'Live Claude Code Workshop'
          } else if (session.amount_total === 29700) {
            productName = 'Live Cursor Workshop'
          }

          return {
            id: session.id,
            charge_id: chargeId,
            amount: session.amount_total || 0,
            created_at: new Date((session as any).created * 1000).toISOString(),
            customer_email: session.customer_details?.email || user.email,
            product_name: productName,
            workshop_type: session.metadata?.workshop_type || 'claude-code',
          }
        }),
      )

      return workshopTransactions.filter((t) => t.charge_id)
    } catch (error) {
      console.error('Error fetching workshop transactions:', error)
      return []
    }
  }),
})
