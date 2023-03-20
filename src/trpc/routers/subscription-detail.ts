import {router, baseProcedure} from '../trpc.server'
import {z} from 'zod'
import {stripe} from '../../utils/stripe'
import {Stripe} from 'stripe'
import isEmpty from 'lodash/isEmpty'

export const subscriptionDetailsRouter = router({
  forStripeCustomerId: baseProcedure
    .input(
      z.object({
        stripeCustomerId: z.string().optional(),
      }),
    )
    .query(async ({input, ctx}) => {
      const {stripeCustomerId} = input

      if (!stripeCustomerId) throw new Error('no stripeCustomerId provided')

      const session = (await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/user/membership`,
      })) as Stripe.BillingPortal.Session

      if (!session) throw new Error(`no session loaded for ${stripeCustomerId}`)

      const customer = (await stripe.customers.retrieve(stripeCustomerId, {
        expand: ['default_source', 'subscriptions.data.latest_invoice'],
      })) as Stripe.Customer

      const balance = customer?.balance

      const subscriptions = await stripe.subscriptions.list({
        customer: stripeCustomerId,
      })

      const subscription = subscriptions.data[0]

      if (subscription) {
        const price = subscription.items.data[0]?.price
        const latestInvoice =
          typeof subscription.latest_invoice === 'string'
            ? await stripe.invoices.retrieve(subscription.latest_invoice)
            : subscription.latest_invoice
        const billingScheme = price?.billing_scheme || 'per_unit'

        const product =
          typeof price?.product === 'string'
            ? await stripe.products.retrieve(price.product)
            : (price?.product as Stripe.Product)

        // Try fetching the upcoming invoice
        let upcomingInvoice: Stripe.Invoice | null = null
        if (!isEmpty(subscription.canceled_at)) {
          // Only retrieve it if the subscription hasn't been cancelled,
          // otherwise it will result in a StripeInvalidRequestError.
          upcomingInvoice = await stripe.invoices.retrieveUpcoming({
            customer: stripeCustomerId,
          })
        }
        console.log({session, customer, subscriptions})

        return {
          portalUrl: session.url,
          billingScheme,
          subscription,
          price,
          product,
          latestInvoice,
          upcomingInvoice,
          accountBalance: balance,
        }
      } else {
        return {
          portalUrl: session.url,
          customer,
        }
      }
    }),
})
