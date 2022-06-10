import axios from 'axios'
import {buffer} from 'micro'
import mixpanel from 'mixpanel-browser'
import type {NextApiRequest, NextApiResponse} from 'next'
import {track} from 'utils/analytics'
import {stripe} from '../../../utils/stripe'

const CIO_BASE_URL = `https://beta-api.customer.io/v1/api/`

const cioAxios = axios.create({
  baseURL: CIO_BASE_URL,
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

const stripeWebhookHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method === 'POST') {
    const buf = await buffer(req)
    const sig = req.headers['stripe-signature']

    let event: any

    try {
      event = stripe.webhooks.constructEvent(buf, sig as string, webhookSecret)

      let stripeCustomerId = event.data.object.customer

      let stripeCustomer = await stripe.customers.retrieve(stripeCustomerId)

      // if(typeof stripeCustomer === Customer)
      let stripeEmail = stripeCustomer

      await cioAxios
        .get(`/customers/${stripeEmail}`, {
          headers: {
            Authorization: `Bearer ${process.env.CUSTOMER_IO_APPLICATION_API_KEY}`,
          },
        })
        .then(({data}: {data: any}) => data.customer)
        .catch((error: any) => {
          console.error(error)
        })

      if (event.type === 'customer.subscription.created') {
        // if running sale we would want to check for that but the regular case it's pro or PPP
        let type = !event.data.object.discount ? 'pro' : 'PPP'

        // how should we grab the current user? is there a pattern for this
        let mixpanelCustomer = mixpanel.identify()

        mixpanel.people.set({
          type: type,
          interval: event.data.object.plan.interval,
        })

        res.status(200).send(`This works!`)
      } else {
        res.status(200).send(`not-handled`)
      }
    } catch (err: any) {
      console.error(err)
      res.status(400).send(`Webhook Error: ${err.message}`)
      return
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default stripeWebhookHandler

export const config = {
  api: {
    bodyParser: false,
  },
}
