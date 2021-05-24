import {first, get} from 'lodash'
import {NextApiRequest, NextApiResponse} from 'next'
import isEmpty from 'lodash/isEmpty'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const StripeCheckoutSession = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method === 'GET') {
    try {
      const customer_id = req.query.customer_id

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

      const subscription = customer.subscriptions?.data[0]

      if (subscription) {
        const price = get(first(subscription.items.data), 'price')
        const latestInvoice = get(subscription, 'latest_invoice')
        const billingScheme = get(subscription, 'plan.billing_scheme')

        const {product: product_id} = price

        const product = await stripe.products.retrieve(product_id)

        // Try fetching the upcoming invoice
        let upcomingInvoice = {}
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
