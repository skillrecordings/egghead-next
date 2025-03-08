import {stripe} from '@/utils/stripe'
import Stripe from 'stripe'
import {NonRetriableError} from 'inngest'
import {getCustomerId, getCustomerDetails} from '@/inngest/utils/stripe-helpers'
import {
  shouldProcessCheckoutSession,
  isLifetimePurchase,
} from '@/inngest/utils/lifetime-helpers'
import {
  containsSpecificProduct,
  getSpecificProductName,
} from '@/inngest/utils/specific-product-helpers'
import {LIFETIME_PURCHASE_EVENT} from '@/inngest/events/lifetime-purchase'
import {SPECIFIC_PRODUCT_PURCHASE_EVENT} from '@/inngest/events/specific-product-purchase'

const LIFETIME_PRICE_ID = process.env.STRIPE_LIFETIME_MEMBERSHIP_PRICE_ID
const SPECIFIC_PRODUCT_ID = process.env.WORKSHOP_PRODUCT_ID || ''

/**
 * Retrieves customer details from a checkout session
 */
export const retrieveCustomer = async (
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null,
) => {
  if (typeof customer === 'string') {
    return await stripe.customers.retrieve(customer)
  }
  return customer
}

/**
 * Handles the processing of specific product purchases
 */
export const handleSpecificProductPurchase = async (
  checkoutSession: Stripe.Checkout.Session,
  step: any,
) => {
  const checkoutSessionId = checkoutSession.id
  const customerId = getCustomerId(checkoutSession.customer, checkoutSession)
  const priceId = checkoutSession.line_items?.data[0]?.price?.id || ''

  // Step 1: Retrieve charge ID
  const chargeId = await step.run(
    'retrieve charge id for specific product',
    async () => retrieveChargeId(checkoutSession.payment_intent),
  )

  // Step 2: Get customer details
  const customer = await step.run('get customer details', async () =>
    retrieveCustomer(checkoutSession.customer),
  )

  // Step 3: Extract customer email and name
  const {customerEmail, customerName} = getCustomerDetails(
    customer,
    checkoutSession,
  )

  // Step 4: Get product name
  const productName = await step.run('get product name', async () =>
    getSpecificProductName(),
  )

  // Step 5: Send the specific product purchase event
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

/**
 * Handles the processing of lifetime purchases
 */
export const handleLifetimePurchase = async (
  checkoutSession: Stripe.Checkout.Session,
  chargeId: string,
  step: any,
) => {
  const checkoutSessionId = checkoutSession.id
  const stripePriceId = checkoutSession.line_items?.data[0]?.price?.id
  const customerId = getCustomerId(checkoutSession.customer, checkoutSession)

  // Step 1: Get customer details
  const customer = await step.run(
    'get customer details for lifetime',
    async () => retrieveCustomer(checkoutSession.customer),
  )

  // Step 2: Extract customer email and name
  const {customerEmail, customerName} = getCustomerDetails(
    customer,
    checkoutSession,
  )

  // Step 3: Send lifetime purchase event
  await step.sendEvent('trigger lifetime purchase event', {
    name: LIFETIME_PURCHASE_EVENT,
    data: {
      provider: 'stripe' as const,
      checkoutSessionId,
      priceId: stripePriceId || '',
      customerId,
      stripeChargeIdentifier: chargeId,
      customerEmail,
      customerName,
    },
  })
}

/**
 * Retrieves a checkout session with expanded details
 */
export const retrieveCheckoutSession = async (checkoutSessionId: string) => {
  return await stripe.checkout.sessions.retrieve(checkoutSessionId, {
    expand: [
      'line_items',
      'payment_intent',
      'line_items.data.price.product',
      'customer',
    ],
  })
}

/**
 * Retrieves the charge ID from a payment intent
 */
export const retrieveChargeId = async (
  paymentIntent: string | Stripe.PaymentIntent | null,
) => {
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
}

/**
 * Validates environment configuration
 */
export const validateEnvironment = () => {
  if (LIFETIME_PRICE_ID === undefined) {
    throw new NonRetriableError(
      'process.env.STRIPE_LIFETIME_MEMBERSHIP_PRICE_ID is not set',
    )
  }
}

/**
 * Processes specific product purchases if applicable
 */
export const processSpecificProductPurchase = async (
  checkoutSession: Stripe.Checkout.Session,
  step: any,
) => {
  const hasSpecificProduct = await step.run(
    'check for specific product',
    async () => containsSpecificProduct(checkoutSession),
  )

  if (hasSpecificProduct) {
    await handleSpecificProductPurchase(checkoutSession, step)
  }
}

/**
 * Processes lifetime purchases if applicable
 */
export const processLifetimePurchase = async (
  checkoutSession: Stripe.Checkout.Session,
  step: any,
) => {
  // Validate if the checkout session should be processed
  const result = shouldProcessCheckoutSession(checkoutSession)

  if (!result.shouldProcess) {
    return {message: result.message}
  }

  // Retrieve charge ID for the transaction
  const chargeId = await step.run('retrieve charge id', async () =>
    retrieveChargeId(checkoutSession.payment_intent),
  )

  // Handle lifetime purchase if applicable
  if (isLifetimePurchase(checkoutSession)) {
    await handleLifetimePurchase(checkoutSession, chargeId, step)
  }
}
