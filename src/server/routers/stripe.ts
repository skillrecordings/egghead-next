import {router, baseProcedure} from '../trpc'
import {z} from 'zod'
import {stripe} from '../../utils/stripe'
import {Stripe} from 'stripe'

import {getFeatureFlag} from '@/lib/feature-flags'

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
      // Build a charges.search query using the user's email and past workshop product IDs in metadata
      const productIds: string[] = Array.isArray(pastWorkshopIds)
        ? (pastWorkshopIds as string[])
        : []

      if (productIds.length === 0) {
        // No configured past workshops
        return []
      }

      const escapeSingleQuotes = (value: string) => value.replace(/'/g, "\\'")

      const productClause = `(${productIds
        .map((id) => `metadata['productId']:'${escapeSingleQuotes(id)}'`)
        .join(' OR ')})`

      const identityClause = `billing_details.email:'${escapeSingleQuotes(
        user.email,
      )}'`

      const finalQuery = `${identityClause} AND ${productClause} AND status:'succeeded'`

      // Page through all results to collect every relevant charge
      let page: string | undefined = undefined
      const allCharges: Stripe.Charge[] = []

      do {
        const result = (await stripe.charges.search({
          query: finalQuery,
          limit: 100,
          ...(page ? {page} : {}),
        })) as Stripe.ApiSearchResult<Stripe.Charge>

        allCharges.push(...result.data)
        page = result.next_page || undefined
      } while (page)

      // Resolve unique product names with minimal API calls
      const uniqueProductIds = Array.from(
        new Set(
          allCharges
            .map((c) => c.metadata?.productId || c.metadata?.product_id)
            .filter((id): id is string => Boolean(id)),
        ),
      )

      const productNameCache = new Map<string, string>()
      await Promise.all(
        uniqueProductIds.map(async (productId) => {
          try {
            const product = await stripe.products.retrieve(productId)
            productNameCache.set(productId, product.name || 'Workshop')
          } catch {
            productNameCache.set(productId, 'Workshop')
          }
        }),
      )

      const transactions = allCharges.map((charge) => {
        const productId =
          (charge.metadata?.productId as string | undefined) ||
          (charge.metadata?.product_id as string | undefined)

        const productName =
          (charge.metadata?.product_name as string | undefined) ||
          (productId ? productNameCache.get(productId) : undefined) ||
          charge.description ||
          'Workshop'

        // Determine workshop type for routing to invoice pages
        const workshopType =
          (charge.metadata?.workshop_type as string | undefined) ||
          (productName.toLowerCase().includes('cursor')
            ? 'cursor'
            : 'claude-code')

        return {
          id: charge.id,
          charge_id: charge.id,
          amount: charge.amount || 0,
          created_at: new Date(charge.created * 1000).toISOString(),
          customer_email: charge.billing_details?.email || user.email,
          product_name: productName,
          workshop_type: workshopType,
        }
      })

      // Sort newest first for display consistency
      transactions.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )

      return transactions
    } catch (error) {
      console.error('Error fetching workshop transactions:', error)
      return []
    }
  }),
})
