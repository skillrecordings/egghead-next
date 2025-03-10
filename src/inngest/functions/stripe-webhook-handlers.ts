import {inngest} from '@/inngest/inngest.server'
import {STRIPE_WEBHOOK_EVENT} from '@/inngest/events/stripe-webhook'
import {
  validateEnvironment,
  retrieveCheckoutSession,
  processSpecificProductPurchase,
  processLifetimePurchase,
} from '@/inngest/utils/stripe-webhook-utils'

/**
 * Processes a checkout session and handles different purchase types
 */
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
    // Step 0: Validate environment configuration
    validateEnvironment()

    // Extract checkout session data
    const checkoutSessionEvent = event.data.event
    const checkoutSessionId = checkoutSessionEvent.data.object.id

    // Step 1: Retrieve the checkout session with all necessary details
    const checkoutSession = await step.run(
      'retrieve checkout session',
      async () => retrieveCheckoutSession(checkoutSessionId),
    )

    // Step 2: Process specific product purchases (if applicable)
    await processSpecificProductPurchase(checkoutSession, step)

    // Step 3: Process lifetime purchases (if applicable)
    await processLifetimePurchase(checkoutSession, step)

    // Return the event data
    return event.data.event.data
  },
)
