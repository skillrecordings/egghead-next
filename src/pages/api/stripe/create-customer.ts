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
    // Create a new Stripe customer object
    // This doesn't do anything on the egghead side. We **probably** want to capture
    // this at the contact level and associate it with an existing contact
    // if possible
    const customer = await stripe.customers.create({
      email: req.body.email,
    })

    // update/create a Contact as required with appropriate StripeID
    // Should this be a StripeCustomer so a given Contact can have
    // multiple StripeCustomers based on client_id/site?

    res.status(200).json(customer)
  } else {
    res.statusCode = 404
    res.end()
  }
}
