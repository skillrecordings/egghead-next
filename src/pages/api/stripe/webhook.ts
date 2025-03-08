import axios from 'axios'
import {buffer} from 'micro'
import type {NextApiRequest, NextApiResponse} from 'next'
import {stripe} from '../../../utils/stripe'
import Stripe from 'stripe'
import {z} from 'zod'
import Mixpanel from 'mixpanel'
import {inngest} from '@/inngest/inngest.server'
import {
  STRIPE_WEBHOOK_EVENT,
  StripeWebhookEventSchema,
} from '@/inngest/events/stripe-webhook'
import invariant from 'tiny-invariant'

const mixpanel = Mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || '')

type MixpanelData = {
  distinct_id: string
  subscriptionType: string
  subscriptionInterval: string
  currentPeriodStart: string
  currentPeriodEnd: string
}

/*
When a user subscribes to pro en egghead, with any interval 

It captures when someone subscribes and pay a pro membership for the first time
*/
export const purchaseSubscriptionCreated = ({
  distinct_id,
  subscriptionType,
  subscriptionInterval,
  currentPeriodStart,
  currentPeriodEnd,
}: MixpanelData) =>
  mixpanel.track('Subscription Created', {
    distinct_id,
    subscriptionType,
    subscriptionInterval,
    currentPeriodStart,
    currentPeriodEnd,
  })

/*
Recieve stripe event that the subscription has been canceled 

The user no longer finds our service of value at the current time
*/
export const purchaseSubscriptionCanceled = (
  distinct_id: string,
  subscriptionInterval: string,
) =>
  mixpanel.track('Subscription Canceled', {
    distinct_id,
    subscriptionInterval,
  })

/*
Recieve stripe event and plan amount is more than before

When people change their plans. There are three possible downgrades: 
- from yearly to quarter
- from yearly to monthly 
- from quarter to monthly 
*/
export const purchaseSubscriptionDowngraded = ({
  distinct_id,
  subscriptionType,
  subscriptionInterval,
  currentPeriodStart,
  currentPeriodEnd,
}: MixpanelData) =>
  mixpanel.track('Subscription Downgrade', {
    distinct_id,
    subscriptionType,
    subscriptionInterval,
    currentPeriodStart,
    currentPeriodEnd,
  })

/*
Recieve stripe event and plan amount is more than before

"When people change their plans. There are three possible upgrades: 
- from montly to quarter 
- from month to year 
- from quarter to year "
*/
export const purchaseSubscriptionUpgraded = ({
  distinct_id,
  subscriptionType,
  subscriptionInterval,
  currentPeriodStart,
  currentPeriodEnd,
}: MixpanelData) =>
  mixpanel.track('Subscription Upgrade', {
    distinct_id,
    subscriptionType,
    subscriptionInterval,
    currentPeriodStart,
    currentPeriodEnd,
  })

/*
Set's a property on the mixpanel user that reflects their current subscription status
*/
export const purchaseSetSubscriptionStatus = (
  distinct_id: string,
  subscriptionStatus: string,
) =>
  mixpanel.people.set(distinct_id, {
    subscriptionStatus,
  })

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
  if (!email) {
    console.warn('No email provided to getCIO')
    return {id: 'unknown-user'}
  }

  try {
    const response = await cioAxios.get(`/customers`, {
      params: {email},
      headers: {
        Authorization: `Bearer ${process.env.CUSTOMER_IO_APPLICATION_API_KEY}`,
      },
    })

    const {data} = response

    if (data.results && data.results.length > 0) {
      return data.results[0]
    } else {
      console.warn(`No customer found in CustomerIO for email: ${email}`)
      return {id: 'unknown-user'}
    }
  } catch (error: any) {
    console.error(`Error fetching customer from CustomerIO: ${error.message}`)
    return {id: 'unknown-user'}
  }
}

function getCustomerEmail(
  stripeCustomer:
    | Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>
    | any,
) {
  // Check if this is a checkout session with customer_details
  if (stripeCustomer.customer_details?.email) {
    return stripeCustomer.customer_details.email
  }

  // Check if customer is deleted
  if (stripeCustomer.deleted) {
    throw new Error('Customer has been deleted')
  }

  // use Zod for type-safe extraction of email from Stripe Customer object
  const result = z
    .object({email: z.string().email().optional()})
    .safeParse(stripeCustomer)

  if (result.success && result.data.email) {
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

const handledEvents = {
  CHECKOUT_SESSION_COMPLETED: 'checkout.session.completed',
  CUSTOMER_SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  CUSTOMER_SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
  CUSTOMER_SUBSCRIPTION_CREATED: 'customer.subscription.created',
}

const stripeWebhookHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method === 'POST') {
    const buf = await buffer(req)
    const sig = req.headers['stripe-signature']

    try {
      let event = stripe.webhooks.constructEvent(
        buf,
        sig as string,
        webhookSecret,
      )

      console.info(`Received from Stripe: ${event.type} [${event.id}]`)

      if (Object.values(handledEvents).includes(event.type)) {
        try {
          // This is where the Stripe handling happens for this app.
          // Only known events are processed.
          const message = await processAcceptedEvent(event)
          res.status(200).send(message)
        } catch (processError: any) {
          console.error(
            `Error processing Stripe event ${event.type} [${event.id}]:`,
            processError,
          )
          // Still return 200 to Stripe so they don't retry
          res
            .status(200)
            .send(`Error processing event: ${processError.message}`)
        }
      } else {
        // Make sure Stripe gets a 200 response for anything we are
        // opting out of processing here
        console.info(`Ignoring unhandled event type: ${event.type}`)
        res.status(200).send(`not-handled: ${event.type}`)
      }
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`)
      res.status(400).send(`Webhook Error: ${err.message}`)
      return
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

const processAcceptedEvent = async (unparsedEvent: Stripe.Event) => {
  let event = StripeWebhookEventSchema.parse(unparsedEvent)

  if (event.type === handledEvents.CHECKOUT_SESSION_COMPLETED) {
    // For checkout.session.completed events, we'll let Inngest handle the processing
    // since it has more comprehensive logic for these events
    console.info(
      `Sending checkout.session.completed event to Inngest: ${event.id}`,
    )

    const result = await inngest.send({
      name: STRIPE_WEBHOOK_EVENT,
      data: {
        event,
      },
    })

    return 'Handled by inngest'
  } else if (event.type === handledEvents.CUSTOMER_SUBSCRIPTION_UPDATED) {
    const stripeSubscription = await stripe.subscriptions.retrieve(
      event.data.object.id,
    )

    // Check if customer exists before proceeding
    if (!event.data.object.customer) {
      console.warn(`No customer found for subscription ${event.data.object.id}`)
      return 'No customer found, skipping processing'
    }

    const stripeCustomer = await stripe.customers.retrieve(
      event.data.object.customer,
    )

    const subscriptionInterval =
      stripeSubscription.items.data[0].plan?.interval || ''

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

      const {current_period_start, current_period_end} = event.data.object

      invariant(current_period_start, 'current_period_start is required')
      invariant(current_period_end, 'current_period_end is required')

      const mixpanelEventData = {
        distinct_id: cioCustomer.id,
        subscriptionType,
        subscriptionInterval,
        currentPeriodStart: stripeToMixpanelDataConverter(current_period_start),
        currentPeriodEnd: stripeToMixpanelDataConverter(current_period_end),
      }

      if (stripeUpgradeState === UPGRADE) {
        purchaseSubscriptionUpgraded(mixpanelEventData)
      } else {
        purchaseSubscriptionDowngraded(mixpanelEventData)
      }

      purchaseSetSubscriptionStatus(cioCustomer.id, stripeSubscription.status)
    }

    return 'This works!'
  } else if (event.type === handledEvents.CUSTOMER_SUBSCRIPTION_DELETED) {
    const stripeSubscription = await stripe.subscriptions.retrieve(
      event.data.object.id,
    )

    const subscriptionInterval =
      stripeSubscription.items.data[0].plan?.interval || ''

    // Check if customer exists before proceeding
    if (!event.data.object.customer) {
      console.warn(`No customer found for subscription ${event.data.object.id}`)
      return 'No customer found, skipping processing'
    }

    const stripeCustomer = await stripe.customers.retrieve(
      event.data.object.customer,
    )
    const cioCustomer = await getCIO(getCustomerEmail(stripeCustomer))

    purchaseSubscriptionCanceled(cioCustomer.id, subscriptionInterval)
    purchaseSetSubscriptionStatus(cioCustomer.id, 'canceled')

    return 'This works!'
  } else if (event.type === handledEvents.CUSTOMER_SUBSCRIPTION_CREATED) {
    // this types it as a Stripe.Subscription instead of any
    const stripeSubscription = await stripe.subscriptions.retrieve(
      event.data.object.id,
    )

    // Check if customer exists before proceeding
    if (!event.data.object.customer) {
      console.warn(`No customer found for subscription ${event.data.object.id}`)
      return 'No customer found, skipping processing'
    }

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
    let subscriptionInterval = stripeSubscription.items.data[0].plan.interval

    const {current_period_start, current_period_end} = event.data.object

    invariant(current_period_start, 'current_period_start is required')
    invariant(current_period_end, 'current_period_end is required')

    purchaseSubscriptionCreated({
      distinct_id: cioCustomer.id,
      subscriptionType,
      subscriptionInterval,
      currentPeriodStart: stripeToMixpanelDataConverter(current_period_start),
      currentPeriodEnd: stripeToMixpanelDataConverter(current_period_end),
    })

    purchaseSetSubscriptionStatus(cioCustomer.id, stripeSubscription.status)

    return 'This works!'
  }
}

export default stripeWebhookHandler

export const config = {
  api: {
    bodyParser: false,
  },
}
