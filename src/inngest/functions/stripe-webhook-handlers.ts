import {inngest} from '@/inngest/inngest.server'
import {STRIPE_WEBHOOK_EVENT} from '@/inngest/events/stripe-webhook'
import {LIFETIME_PURCHASE_EVENT} from '@/inngest/events/lifetime-purchase'
import {stripe} from '@/utils/stripe'
import Stripe from 'stripe'
import {NonRetriableError} from 'inngest'

const LIFETIME_PRICE_ID = process.env.STRIPE_LIFETIME_MEMBERSHIP_PRICE_ID
const PRICE_ID_ALLOW_LIST = [LIFETIME_PRICE_ID]

/**
 * Determines if we should process a checkout session based on the price ID.
 * @param checkoutSession The checkout session to process.
 * @returns {Object} An object with the following properties:
 * @property {boolean} shouldProcess - Whether the checkout session should be processed.
 * @property {string} [message] - An optional message detailing why the session should or should not be processed.
 */
function shouldProcessCheckoutSession(checkoutSession: {
  line_items?: {data: {price: {id: string} | null}[]}
}) {
  const stripePriceId = checkoutSession.line_items?.data[0]?.price?.id

  if (!stripePriceId) {
    return {shouldProcess: false, message: 'No price ID found'}
  }

  if (!PRICE_ID_ALLOW_LIST.includes(stripePriceId)) {
    return {shouldProcess: false, message: 'Price ID not in allow list'}
  }

  return {shouldProcess: true}
}

const getCustomerId = (customer: string | {id: string} | null) => {
  if (!customer) {
    throw new NonRetriableError('No customer ID found')
  }

  // if checkoutSession.customer is a string, then it's the customer ID
  if (typeof customer === 'string') {
    return customer
  }

  // if checkoutSession.customer is an object, then grab id off the object
  if (customer) {
    return customer.id
  }

  return customer
}

export const stripeWebhookCheckoutSessionCompleted = inngest.createFunction(
  {
    id: `stripe-webhook-checkout.session.completed`,
    name: 'Stripe Webhook checkout.session.completed',
  },
  {
    event: STRIPE_WEBHOOK_EVENT,
    if: 'event.data.event.type == "checkout.session.completed"',
  },
  async ({event, step}) => {
    if (LIFETIME_PRICE_ID === undefined) {
      throw new NonRetriableError(
        'process.env.STRIPE_LIFETIME_MEMBERSHIP_PRICE_ID is not set',
      )
    }

    const checkoutSessionEvent = event.data.event
    const checkoutSessionId = checkoutSessionEvent.data.object.id

    const checkoutSession = await step.run(
      'retrieve checkout session',
      async () => {
        const checkoutSession = await stripe.checkout.sessions.retrieve(
          checkoutSessionId,
          {
            expand: ['line_items', 'payment_intent'],
          },
        )

        return checkoutSession
      },
    )

    const result = shouldProcessCheckoutSession(checkoutSession)

    if (!result.shouldProcess) {
      return {message: result.message, checkoutSessionEvent}
    }

    const stripePriceId = checkoutSession.line_items?.data[0]?.price?.id
    const paymentIntent = checkoutSession.payment_intent

    const chargeId = await step.run('retrieve charge id', async () => {
      if (!paymentIntent) {
        throw new NonRetriableError('No payment intent found')
      }

      if (typeof paymentIntent === 'string') {
        const retrievedPaymentIntent = await stripe.paymentIntents.retrieve(
          paymentIntent,
        )
        return retrievedPaymentIntent.charges.data[0].id
      }

      return paymentIntent.charges.data[0].id
    })

    // if this is the lifetime price ID, then trigger a separate inngest event to handle that purchase
    if (stripePriceId === LIFETIME_PRICE_ID) {
      const customerId = getCustomerId(checkoutSession.customer)

      const data = {
        provider: 'stripe' as const,
        checkoutSessionId,
        priceId: stripePriceId,
        customerId,
        stripeChargeIdentifier: chargeId,
      }

      await step.sendEvent('trigger lifetime purchase event', {
        name: LIFETIME_PURCHASE_EVENT,
        data,
      })
    }

    return event.data.event.data
  },
)
