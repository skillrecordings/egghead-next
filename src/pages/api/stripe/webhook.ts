import axios from 'axios'
import {buffer} from 'micro'
import Mixpanel from 'mixpanel'
import type {NextApiRequest, NextApiResponse} from 'next'
import {stripe} from '../../../utils/stripe'
import Stripe from 'stripe'
import {z} from 'zod'

function stripeToMixpanelDataConverter(stripeDate: number) {
  const date = new Date(stripeDate * 1000)
  return date.toISOString()
}

const UPGRADE = 'Upgrade'
const DOWNGRADE = 'Downgrade'

const intervalOptions = z.union([
  z.literal('month'),
  z.literal('quarter'),
  z.literal('year'),
])

type Interval = z.infer<typeof intervalOptions>
type IntervalChange = typeof UPGRADE | typeof DOWNGRADE

function checkForUpgrade(
  previousPlanInterval: Interval,
  newPlanInterval: Interval,
): IntervalChange {
  const isAnUpgrade = {
    month: true,
    year: false,
    quarter: newPlanInterval === 'year',
  }[previousPlanInterval]

  return isAnUpgrade ? UPGRADE : DOWNGRADE
}

async function getCIO(email: string) {
  return await cioAxios
    .get(`/customers`, {
      params: {email},
      headers: {
        Authorization: `Bearer ${process.env.CUSTOMER_IO_APPLICATION_API_KEY}`,
      },
    })
    .then(({data}: {data: any}) => data.results[0])
    .catch((error: any) => {
      console.error(error)
      return {}
    })
}

function getCustomerEmail(
  stripeCustomer: Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>,
) {
  // use Zod for type-safe extraction of email from Stripe Customer object
  const result = z.object({email: z.string().email()}).safeParse(stripeCustomer)

  if (result.success) {
    return result.data.email
  }

  throw new Error('No email found for customer')
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

      const stripeSubscription = await stripe.subscriptions.retrieve(
        event.data.object.id,
      )
      const stripeCustomer = await stripe.customers.retrieve(
        event.data.object.customer,
      )

      const subscriptionInterval =
        stripeSubscription.items.data[0].plan?.interval || ''

      // Also handle:
      // - 'customer.subscription.updated'
      // - 'customer.subscription.deleted'
      if (event.type === 'customer.subscription.updated') {
        const previousSubscription = event.data.previous_attributes
        // if the previous attributes have a plan it's an upgrade/downgrade
        if (previousSubscription.plan) {
          const previousPlanInterval = previousSubscription.plan?.interval || ''

          const intervalTuple = z.tuple([intervalOptions, intervalOptions])
          const result = intervalTuple.safeParse([
            previousPlanInterval,
            subscriptionInterval,
          ])

          if (!result.success) {
            const errorMessage = `
            Invalid interval types ahead of checkForUpgrade
            - previousPlanInterval: ${previousPlanInterval}
            - newSubscriptionInterval: ${subscriptionInterval}
          
            Detailed ZodError: ${result.error}
            `

            // OR, if we don't want to throw an error, we could send the message to something
            // like Honeybadger and then early return from the webhook handler.
            throw new Error(errorMessage)
          }

          // because of the `intervalTupe.safeParse(...)` above, we know we are passing in
          // valid inputs to the checkForUpgrade
          const stripeUpgradeState = checkForUpgrade(...result.data)

          let subscriptionType = !stripeSubscription.discount ? 'pro' : 'ppp'

          let cioCustomer = await getCIO(getCustomerEmail(stripeCustomer))

          const mixpanelEventData = {
            distinct_id: cioCustomer.id,
            subscriptionType,
            subscriptionInterval,
            currentPeriodStart: stripeToMixpanelDataConverter(
              event.data.object.current_period_start,
            ),
            currentPeriodEnd: stripeToMixpanelDataConverter(
              event.data.object.current_period_end,
            ),
          }

          if (stripeUpgradeState === UPGRADE) {
            mixpanel.track('Subscription Upgrade', mixpanelEventData)
          } else {
            mixpanel.track('Subscription Downgrade', mixpanelEventData)
          }

          mixpanel.people.set(cioCustomer.id, {
            subscriptionStatus: stripeSubscription.status,
          })
        }

        res.status(200).send(`This works!`)
      } else if (event.type === 'customer.subscription.deleted') {
        const stripeCustomer = await stripe.customers.retrieve(
          event.data.object.customer,
        )
        const cioCustomer = await getCIO(getCustomerEmail(stripeCustomer))

        mixpanel.track('Subscription Canceled', {
          distinct_id: cioCustomer.id,
        })

        mixpanel.people.set(cioCustomer.id, {
          subscriptionStatus: 'canceled',
        })

        res.status(200).send(`This works!`)
      } else if (event.type === 'customer.subscription.created') {
        // this types it as a Stripe.Subscription instead of any
        const stripeSubscription = await stripe.subscriptions.retrieve(
          event.data.object.id,
        )
        const stripeCustomer = await stripe.customers.retrieve(
          event.data.object.customer,
        )

        // we want to get the `co_************` id from CustomerIO which we can
        // cross-reference with MixPanel to uniquely identify the user.
        // This correlates to the contact_id of the user in egghead.io
        let cioCustomer = await getCIO(getCustomerEmail(stripeCustomer))

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
