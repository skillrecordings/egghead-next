import {NextApiRequest, NextApiResponse} from 'next'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const StripeCheckoutSession = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method === 'GET') {
    try {
      const customer_id = req.query.customer_id

      if (!customer_id) throw new Error('no customer id')

      const account_slug = req.query.account_slug

      const session = await stripe.billingPortal.sessions.create({
        customer: customer_id,
        return_url: account_slug
          ? `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/accounts/${account_slug}`
          : process.env.NEXT_PUBLIC_DEPLOYMENT_URL,
      })
      if (!session)
        throw new Error(`no session loaded for ${req.query.session_id}`)

      const customer = await stripe.customers.retrieve(customer_id, {
        expand: ['default_source'],
      })

      const subscription = customer.subscriptions?.data[0]

      if (subscription) {
        const {price} = subscription.items.data[0]

        const {product: product_id} = price

        const product = await stripe.products.retrieve(product_id)

        res.status(200).json({url: session.url, subscription, price, product})
      } else {
        res.status(200).json({url: session.url, customer})
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
