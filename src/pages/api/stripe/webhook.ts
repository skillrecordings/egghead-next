import axios from 'axios'
import {buffer} from 'micro'
import Mixpanel from 'mixpanel'
import type {NextApiRequest, NextApiResponse} from 'next'
import {stripe} from '../../../utils/stripe'

function stripeToMixpanelDataConverter(stripeDate: number) {
  const date = new Date(stripeDate * 1000)
  return date.toISOString()
}

// const CIO_BASE_URL = `https://beta-api.customer.io/v1/api/`
const CIO_BASE_URL = 'https://api.customer.io/v1/'

const cioAxios = axios.create({
  baseURL: CIO_BASE_URL,
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

const mixpanel = Mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || '')

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

      // Also handle:
      // - 'customer.subscription.updated'
      // - 'customer.subscription.deleted'
      if (event.type === 'customer.subscription.created') {
        // this types it as a Stripe.Subscription instead of any
        const stripeSubscription = await stripe.subscriptions.retrieve(
          event.data.object.id,
        )
        const stripeCustomer = await stripe.customers.retrieve(
          event.data.object.customer,
        )

        if (!('email' in stripeCustomer)) {
          // solves a typescript error 🤡
          throw new Error('No email found for customer')
        }

        const stripeEmail = stripeCustomer.email

        // we want to get the `co_************` id from CustomerIO which we can
        // cross-reference with MixPanel to uniquely identify the user.
        // This correlates to the contact_id of the user in egghead.io
        let cioCustomer = await cioAxios
          .get(`/customers`, {
            params: {email: stripeEmail},
            headers: {
              Authorization: `Bearer ${process.env.CUSTOMER_IO_APPLICATION_API_KEY}`,
            },
          })
          .then(({data}: {data: any}) => data.results[0])
          .catch((error: any) => {
            console.error(error)
            return {}
          })

        // if running sale we would want to check for that but the regular case it's pro or PPP
        // TODO: need to differentiate between other types of discounts (e.g. sales)
        let subscriptionType = !stripeSubscription.discount ? 'pro' : 'ppp'

        // stripe puts the plan at the top level of the subscription object
        // but it isn't on the type so had to do this
        let subscriptionInterval =
          stripeSubscription.items.data[0].plan.interval

        mixpanel.track('Subscription Created', {
          distinct_id: cioCustomer.id,
          subscriptionType,
          subscriptionInterval,
          currentPeriodStart: stripeToMixpanelDataConverter(
            event.data.object.current_period_start,
          ),
          currentPeriodEnd: stripeToMixpanelDataConverter(
            event.data.object.current_period_end,
          ),
        })

        mixpanel.people.set(cioCustomer.id, {
          subscriptionStatus: stripeSubscription.status,
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
