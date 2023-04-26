import {NextApiRequest, NextApiResponse} from 'next'
import isEmpty from 'lodash/isEmpty'
import {Stripe} from 'stripe'

const stripe: Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const StripeCheckoutSession = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method === 'GET') {
    try {
      const customer_id = req.query.customer_id as string

      if (!customer_id) throw new Error('no customer id')

      const session = await stripe.billingPortal.sessions.create({
        customer: customer_id,
        return_url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/user`,
      })

      if (!session)
        throw new Error(`no session loaded for ${req.query.session_id}`)

      const customer = await stripe.customers.retrieve(customer_id, {
        expand: ['default_source', 'subscriptions.data.latest_invoice'],
      })

      const subscriptions = await stripe.subscriptions.list({
        customer: customer_id,
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
            : price?.product

        // Try fetching the upcoming invoice
        let upcomingInvoice: Stripe.Invoice | null = null
        if (!isEmpty(subscription.canceled_at)) {
          // Only retrieve it if the subscription hasn't been cancelled,
          // otherwise it will result in a StripeInvalidRequestError.
          upcomingInvoice = await stripe.invoices.retrieveUpcoming({
            customer: customer_id,
          })
        }

        res.status(200).json({
          portalUrl: session.url,
          billingScheme,
          subscription,
          price,
          product,
          latestInvoice,
          upcomingInvoice,
        })
      } else {
        res.status(200).json({portalUrl: session.url, customer})
      }
    } catch (error) {
      console.error(JSON.stringify(error))
      res.end()
    }
  } else {
    res.statusCode = 404
    res.end()
  }
}

export default StripeCheckoutSession
