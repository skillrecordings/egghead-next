import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('no Stripe secret key found')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

import {NextApiRequest, NextApiResponse} from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      await stripe.paymentMethods.attach(req.body.paymentMethodId, {
        customer: req.body.customerId,
      })
    } catch (error) {
      res.status(402).json({error: {message: error.message}})
    }

    await stripe.customers.update(req.body.customerId, {
      invoice_settings: {
        default_payment_method: req.body.paymentMethodId,
      },
    })

    const subscription = await stripe.subscriptions.create({
      customer: req.body.customerId,
      items: [{price: req.body.priceId, quantity: req.body.quantity}],
      expand: ['latest_invoice.payment_intent', 'plan.product'],
    })

    res.json(subscription)
  } else {
    res.statusCode = 404
    res.end()
  }
}
