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
    // Create a new customer object
    const customer = await stripe.customers.create({
      email: req.body.email,
    })

    // save the customer.id as stripeCustomerId
    // in your database.

    res.status(200).json(customer)
  } else {
    res.statusCode = 404
    res.end()
  }
}
