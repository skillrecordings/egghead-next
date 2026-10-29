import {router, baseProcedure} from '../trpc'
import {z} from 'zod'
import {stripe} from '../../utils/stripe'
import {Stripe} from 'stripe'
import {findStripeCustomerIdByEmail} from '../../utils/stripe-customer'

import {getFeatureFlag} from '@/lib/feature-flags'
import {logEvent} from '@/utils/structured-log'
import {
  isPastWorkshopSession,
  sessionPaymentIntentId,
  toWorkshopTransaction,
  WorkshopTransaction,
} from './workshop-transactions'

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

    const pastWorkshopIds = await getFeatureFlag(
      'featureFlagPastWorkshops',
      'workshop',
    )

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
      // List checkout sessions by email, then filter past workshop products locally
      const productIds: string[] = Array.isArray(pastWorkshopIds)
        ? (pastWorkshopIds as string[])
        : []

      if (productIds.length === 0) {
        // No configured past workshops
        return []
      }

      // Page through all sessions to collect every paid workshop purchase
      let startingAfter: string | undefined = undefined
      const workshopSessions: Stripe.Checkout.Session[] = []

      do {
        const result: Stripe.ApiList<Stripe.Checkout.Session> =
          await stripe.checkout.sessions.list({
            customer_details: {email: user.email},
            limit: 100,
            expand: ['data.line_items'],
            ...(startingAfter ? {starting_after: startingAfter} : {}),
          })

        workshopSessions.push(
          ...result.data.filter((session) =>
            isPastWorkshopSession(session, productIds),
          ),
        )
        startingAfter = result.has_more
          ? result.data[result.data.length - 1]?.id
          : undefined
      } while (startingAfter)

      // Resolve each session's charge for the receipt and invoice link
      const resolved = await Promise.all(
        workshopSessions.map(async (session) => {
          const paymentIntent = sessionPaymentIntentId(session)
          if (!paymentIntent) return null
          const charges = await stripe.charges.list({
            payment_intent: paymentIntent,
            limit: 1,
          })
          const charge = charges.data[0]
          if (!charge) return null
          return toWorkshopTransaction(session, charge, productIds, user.email)
        }),
      )

      const transactions = resolved.filter(
        (transaction): transaction is WorkshopTransaction =>
          Boolean(transaction),
      )

      // Sort newest first for display consistency
      transactions.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )

      return transactions
    } catch (error) {
      logEvent('error', 'workshop_transactions_fetch_failed', {
        error_message: error instanceof Error ? error.message : String(error),
      })
      return []
    }
  }),
})
