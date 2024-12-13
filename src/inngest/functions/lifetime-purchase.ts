import {inngest} from '@/inngest/inngest.server'
import {LIFETIME_PURCHASE_EVENT} from '@/inngest/events/lifetime-purchase'
import {stripe} from '@/utils/stripe'
import {NonRetriableError} from 'inngest'
import axios from 'axios'
import * as z from 'zod'
import {TrackClient, RegionUS} from 'customerio-node'
import {getContactByEmail} from '@/lib/contact-query'

const siteId = process.env.NEXT_PUBLIC_CUSTOMER_IO_SITE_ID || ''
const apiKey = process.env.CUSTOMER_IO_TRACK_API_BASIC || ''

const cio = new TrackClient(siteId, apiKey, {region: RegionUS})

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

    await step.run(
      'update customer.io with lifetime purchase date',
      async () => {
        const email = 'cree+test@egghead.io'
        const now = Math.floor(Date.now() / 1000) // Convert to seconds

        if (!email) {
          throw new Error('Customer email not found')
        }

        const contact = await getContactByEmail(email)

        if (!contact.guid) {
          throw new Error('contact_id not found')
        }

        return await cio.identify(contact.guid, {
          purchased_lifetime_at: now,
        })
      },
    )

    return {user, isNewUser: is_new_user, cancelledSubscriptions}
  },
)
