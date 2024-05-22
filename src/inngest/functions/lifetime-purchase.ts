import {inngest} from '@/inngest/inngest.server'
import {LIFETIME_PURCHASE_EVENT} from '@/inngest/events/lifetime-purchase'
import {stripe} from '@/utils/stripe'
import {NonRetriableError} from 'inngest'
import axios from 'axios'
import {z} from 'zod'

const LIFETIME_PRICE_ID = 'price_1P1Dip2nImeJXwdJCCqfTViv'

const railsToken = process.env.EGGHEAD_SUPPORT_BOT_TOKEN || ''
const EGGHEAD_AUTH_DOMAIN = process.env.NEXT_PUBLIC_AUTH_DOMAIN || ''

const eggAxios = axios.create({
  baseURL: EGGHEAD_AUTH_DOMAIN,
  headers: {
    Authorization: `Bearer ${railsToken}`,
  },
})

export const lifetimePurchase = inngest.createFunction(
  {
    id: `commerce-lifetime-purchase`,
    name: 'Commerce: Lifetime Purchase',
  },
  {
    event: LIFETIME_PURCHASE_EVENT,
  },
  async ({event, step}) => {
    console.log(event.data)

    // Look up the user
    const customer = await step.run('get stripe customer', async () => {
      const customer = await stripe.customers.retrieve(event.data.customerId)

      if (!customer) {
        throw new Error('Customer not found')
      }

      if ('deleted' in customer) {
        throw new NonRetriableError('Customer is deleted')
      }

      return customer
    })

    const email = customer.email

    // Find or create the user with Lifetime Subscription
    const {user, active_subscription_stripe_ids, is_new_user} = await step.run(
      'create user with lifetime subscription',
      async () => {
        // is this endpoint idempotent? Because inngest will run it multiple times.
        const response = await eggAxios.post('/api/v1/lifetime_subscriptions', {
          email,
          site: 'egghead.io',
          stripe_charge_id: event.data.stripeChargeIdentifier,
          stripe_customer_id: event.data.customerId,
        })

        const ResponseSchema = z.object({
          user: z.object({
            id: z.number(),
            email: z.string(),
          }),
          active_subscription_stripe_ids: z.array(z.string()),
          is_new_user: z.boolean(),
        })

        return ResponseSchema.parse(response.data)
      },
    )

    // Cancel any active subscriptions for the user
    const cancelledSubscriptions = await step.run(
      'cancel active subscriptions',
      async () => {
        const cancelledSubscriptions = []

        for (const subscriptionId of active_subscription_stripe_ids) {
          const subscription = await stripe.subscriptions.cancel(
            subscriptionId,
            {
              prorate: true,
            },
          )

          cancelledSubscriptions.push(subscription)
        }

        return cancelledSubscriptions
      },
    )

    return {user, isNewUser: is_new_user, cancelledSubscriptions}
  },
)
