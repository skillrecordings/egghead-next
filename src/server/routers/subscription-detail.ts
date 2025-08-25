import {router, baseProcedure} from '../trpc'
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
        const originalPrice = subscription.items.data[0]?.price
        const latestInvoice =
          typeof subscription.latest_invoice === 'string'
            ? await stripe.invoices.retrieve(subscription.latest_invoice)
            : subscription.latest_invoice
        const billingScheme = originalPrice?.billing_scheme || 'per_unit'

        const product =
          typeof originalPrice?.product === 'string'
            ? await stripe.products.retrieve(originalPrice.product)
            : (originalPrice?.product as Stripe.Product)

        // Try fetching the upcoming invoice
        let upcomingInvoice: Stripe.Invoice | null = null
        if (isEmpty(subscription.canceled_at)) {
          // Only retrieve it if the subscription hasn't been cancelled,
          // otherwise it will result in a StripeInvalidRequestError.
          try {
            upcomingInvoice = await stripe.invoices.retrieveUpcoming({
              customer: stripeCustomerId,
              subscription: subscription.id,
            })
          } catch (error) {
            console.error('Error fetching upcoming invoice:', error)
          }
        }
        // Get the actual subscription recurring amount from upcoming invoice line items
        let recurringSubscriptionAmount: number | null = null
        if (upcomingInvoice?.lines?.data) {
          // Filter for subscription line items only (exclude one-time charges)
          const subscriptionLineItems = upcomingInvoice.lines.data.filter(
            (line) =>
              line.type === 'subscription' &&
              line.subscription === subscription.id,
          )
          if (subscriptionLineItems.length > 0) {
            recurringSubscriptionAmount = subscriptionLineItems.reduce(
              (total, item) => total + (item.amount || 0),
              0,
            )
          }
        }
        // Priority: Use recurring amount from upcoming invoice lines, then original
        const accuratePrice = recurringSubscriptionAmount
          ? {...originalPrice, unit_amount: recurringSubscriptionAmount}
          : originalPrice

        return {
          portalUrl: session.url,
          billingScheme,
          subscription,
          price: accuratePrice,
          product,
          latestInvoice,
          upcomingInvoice,
          accountBalance: balance,
          recurringSubscriptionAmount,
        }
      } else {
        return {
          portalUrl: session.url,
          customer,
        }
      }
    }),
})
