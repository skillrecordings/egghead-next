import {inngest} from '@/inngest/inngest.server'
import {STRIPE_WEBHOOK_EVENT} from '@/inngest/events/stripe-webhook'
import {LIFETIME_PURCHASE_EVENT} from '@/inngest/events/lifetime-purchase'
import {SPECIFIC_PRODUCT_PURCHASE_EVENT} from '@/inngest/events/specific-product-purchase'
import {stripe} from '@/utils/stripe'
import Stripe from 'stripe'
import {NonRetriableError} from 'inngest'

const LIFETIME_PRICE_ID = process.env.STRIPE_LIFETIME_MEMBERSHIP_PRICE_ID
// Add our specific product ID
// const SPECIFIC_PRODUCT_ID = 'prod_RslNCWxcHnoCvi'
const SPECIFIC_PRODUCT_ID = 'prod_RsOlSrf1TSqRdy'
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
  // Safely check if we have line items with price data
  if (!checkoutSession.line_items?.data?.length) {
    return {shouldProcess: false, message: 'No line items found'}
  }

  // Find the first valid price ID
  const stripePriceId = checkoutSession.line_items.data
    .map((item) => item.price?.id)
    .find((id) => id !== null && id !== undefined)

  if (!stripePriceId) {
    return {shouldProcess: false, message: 'No price ID found'}
  }

  if (!PRICE_ID_ALLOW_LIST.includes(stripePriceId)) {
    return {shouldProcess: false, message: 'Price ID not in allow list'}
  }

  return {shouldProcess: true}
}

/**
 * Helper function to get the customer ID from a checkout session.
 */
function getCustomerId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null,
  checkoutSession?: Stripe.Checkout.Session,
): string {
  // First try to get customer ID from the customer parameter
  if (customer) {
    if (typeof customer === 'string') {
      return customer
    }

    // Handle both regular and deleted customers
    if ('id' in customer) {
      return customer.id
    }
  }

  // If customer is null, try to get customer information from customer_details
  if (checkoutSession?.customer_details?.email) {
    // Use email as a unique identifier when customer ID is not available
    return `email:${checkoutSession.customer_details.email}`
  }

  throw new NonRetriableError(
    'No customer information found in checkout session',
  )
}

/**
 * Type guard to verify if an object is a valid Stripe Customer
 *
 * Stripe's API can return customer objects in different formats:
 * 1. String ID (handled elsewhere)
 * 2. Full Customer object with email, name, etc.
 * 3. Deleted Customer object with the 'deleted' property
 * 4. Empty object or malformed response
 *
 * This guard ensures we only access properties on valid customer objects.
 *
 * @param customer - The potential customer object to check
 * @returns Boolean indicating if this is a valid Stripe Customer
 */
function isValidStripeCustomer(customer: any): customer is Stripe.Customer {
  return (
    customer &&
    typeof customer === 'object' &&
    !('deleted' in customer) &&
    'object' in customer &&
    customer.object === 'customer'
  )
}

/**
 * Helper function to extract customer email and name from customer object and checkout session
 */
function getCustomerDetails(
  customer: any,
  checkoutSession: Stripe.Checkout.Session,
): {customerEmail: string; customerName: string | undefined} {
  let customerEmail = ''
  let customerName: string | undefined = undefined

  if (isValidStripeCustomer(customer)) {
    customerEmail = customer.email || ''
    customerName = customer.name || undefined
  }

  // If customerEmail is still empty, try to get it from customer_details
  if (!customerEmail && checkoutSession.customer_details?.email) {
    customerEmail = checkoutSession.customer_details.email
  }

  return {customerEmail, customerName}
}

/**
 * Checks if a checkout session contains our specific product.
 *
 * Stripe's API can return products in different formats:
 * 1. As a string ID that needs to be retrieved separately
 * 2. As an expanded object with full product details
 * 3. As null/undefined if the price doesn't have a product
 *
 * This function handles all these cases and performs the necessary API calls
 * to determine if the specific product is part of the checkout session.
 *
 * @param checkoutSession The checkout session to check
 * @returns {Promise<boolean>} Whether the checkout session contains our specific product
 */
async function containsSpecificProduct(
  checkoutSession: Stripe.Checkout.Session,
): Promise<boolean> {
  try {
    // If line_items is not expanded, we need to retrieve it
    if (!checkoutSession.line_items) {
      try {
        const expandedSession = await stripe.checkout.sessions.retrieve(
          checkoutSession.id,
          {
            expand: ['line_items.data.price.product'],
          },
        )
        checkoutSession = expandedSession
      } catch (error) {
        console.error(`Failed to retrieve expanded checkout session: ${error}`)
        return false
      }
    }

    // Check if any line item contains our specific product
    const lineItems = checkoutSession.line_items?.data || []

    for (const item of lineItems) {
      const product = item.price?.product

      if (!product) continue

      try {
        // If product is just an ID string
        if (typeof product === 'string') {
          const productDetails = await stripe.products.retrieve(product)
          if (productDetails.id === SPECIFIC_PRODUCT_ID) {
            return true
          }
        }
        // If product is expanded object
        else if (typeof product === 'object' && 'id' in product) {
          if (product.id === SPECIFIC_PRODUCT_ID) {
            return true
          }
        }
      } catch (error) {
        console.error(`Error retrieving product details: ${error}`)
        // Continue checking other line items even if one fails
        continue
      }
    }

    return false
  } catch (error) {
    console.error(`Error checking for specific product: ${error}`)
    return false
  }
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
            expand: [
              'line_items',
              'payment_intent',
              'line_items.data.price.product',
              'customer',
            ],
          },
        )

        return checkoutSession
      },
    )

    const result = shouldProcessCheckoutSession(checkoutSession)

    // Check for specific product purchase regardless of the allow list
    const hasSpecificProduct = await step.run(
      'check for specific product',
      async () => {
        return await containsSpecificProduct(checkoutSession)
      },
    )

    if (hasSpecificProduct) {
      const customerId = getCustomerId(
        checkoutSession.customer,
        checkoutSession,
      )
      const paymentIntent = checkoutSession.payment_intent

      const chargeId = await step.run(
        'retrieve charge id for specific product',
        async () => {
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
        },
      )

      // Get customer details
      const customer = await step.run('get customer details', async () => {
        if (typeof checkoutSession.customer === 'string') {
          return await stripe.customers.retrieve(checkoutSession.customer)
        }
        return checkoutSession.customer
      })

      // Get the price ID from the line items
      const priceId = checkoutSession.line_items?.data[0]?.price?.id || ''

      // Extract customer email and name
      const {customerEmail, customerName} = getCustomerDetails(
        customer,
        checkoutSession,
      )

      const productName = await step.run('get product name', async () => {
        const product = await stripe.products.retrieve(SPECIFIC_PRODUCT_ID)
        return product.name || ''
      })

      // Send the specific product purchase event
      await step.sendEvent('trigger specific product purchase event', {
        name: SPECIFIC_PRODUCT_PURCHASE_EVENT,
        data: {
          provider: 'stripe' as const,
          checkoutSessionId,
          productId: SPECIFIC_PRODUCT_ID,
          productName,
          priceId,
          customerId,
          stripeChargeIdentifier: chargeId,
          customerEmail,
          customerName,
        },
      })
    }

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
      const customerId = getCustomerId(
        checkoutSession.customer,
        checkoutSession,
      )

      // Get customer details
      const customer = await step.run(
        'get customer details for lifetime',
        async () => {
          if (typeof checkoutSession.customer === 'string') {
            return await stripe.customers.retrieve(checkoutSession.customer)
          }
          return checkoutSession.customer
        },
      )

      // Extract customer email and name
      const {customerEmail, customerName} = getCustomerDetails(
        customer,
        checkoutSession,
      )

      const data = {
        provider: 'stripe' as const,
        checkoutSessionId,
        priceId: stripePriceId,
        customerId,
        stripeChargeIdentifier: chargeId,
        customerEmail,
        customerName,
      }

      await step.sendEvent('trigger lifetime purchase event', {
        name: LIFETIME_PURCHASE_EVENT,
        data,
      })
    }

    return event.data.event.data
  },
)
