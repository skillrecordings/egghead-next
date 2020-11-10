import Stripe from 'stripe'
import axios from 'axios'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('no Stripe secret key found')
}

if (!process.env.EGGHEAD_SUPPORT_BOT_TOKEN) {
  throw new Error('no egghead support+bot token found')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

import {NextApiRequest, NextApiResponse} from 'next'
import emailIsValid from 'utils/email-is-valid'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const {email} = req.body

    if (!emailIsValid(email)) {
      res.status(400).end()
    } else {
      const userUrl = `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/users/${email}?by_email=true`

      console.log('LOADING')

      const eggheadUser = await axios
        .get(userUrl, {
          headers: {
            Authorization: `Bearer ${process.env.EGGHEAD_SUPPORT_BOT_TOKEN}`,
          },
        })
        .then(({data}) => data)
      console.log('LOADED USER FROM EGGHEAD')
      console.log(eggheadUser)

      let customer

      if (eggheadUser.subscription) {
        customer = await stripe.customers.retrieve(
          eggheadUser.subscription.stripe_id,
          {
            expand: ['subscriptions'],
          },
        )
      } else {
        // Create a new Stripe customer object
        // This doesn't do anything on the egghead side. We **probably** want to capture
        // this at the contact level and associate it with an existing contact
        // if possible
        customer = await stripe.customers.create({
          email: req.body.email,
        })
      }

      // const eggheadContact = axios
      //   .get(
      //     `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/stripe/customer?email=${email}`,
      //   )
      //   .then(({data}) => data)

      // console.log(eggheadContact)

      // update/create a Contact as required with appropriate StripeID
      // Should this be a StripeCustomer so a given Contact can have
      // multiple StripeCustomers based on client_id/site?

      res.status(200).json({customer, eggheadUser})
    }
  } else {
    res.statusCode = 404
    res.end()
  }
}
