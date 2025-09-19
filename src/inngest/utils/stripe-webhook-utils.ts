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
import {getFeatureFlag} from '@/lib/feature-flags'
import {LiveWorkshopSchema} from '@/types'
import {z} from 'zod'
const LIFETIME_PRICE_ID = process.env.STRIPE_LIFETIME_MEMBERSHIP_PRICE_ID

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

  // 1. Define all workshop flag keys in an array for scalability.
  const workshopFlagKeys = [
    'featureFlagCursorWorkshopSale',
    'featureFlagClaudeCodeWorkshopSale',
    // ✨ To add another workshop, just add its feature flag key here!
  ]

  // Get the purchased product ID from the checkout session.
  const purchasedProduct = checkoutSession.line_items?.data[0]?.price?.product
  let purchasedProductId: string | undefined
  if (typeof purchasedProduct === 'string') {
    purchasedProductId = purchasedProduct
  } else if (purchasedProduct && 'id' in purchasedProduct) {
    purchasedProductId = purchasedProduct.id
  }

  if (!purchasedProductId) {
    console.warn('No product ID found in checkout session')
    return
  }

  // 2. Fetch all feature flags concurrently.
  const workshopFlags = await Promise.all(
    workshopFlagKeys.map((key) => getFeatureFlag(key, 'workshop')),
  )

  let selectedWorkshop: z.infer<typeof LiveWorkshopSchema> | null = null

  // 3. Iterate to find the first valid and matching workshop.
  for (const flagData of workshopFlags) {
    const parsedWorkshop = LiveWorkshopSchema.safeParse(flagData)
    // Check if the workshop data is valid AND its product ID matches the purchased one.
    if (
      parsedWorkshop.success &&
      parsedWorkshop.data?.productId === purchasedProductId
    ) {
      selectedWorkshop = parsedWorkshop.data
      break // Found our match, no need to check the others.
    }
  }

  if (!selectedWorkshop) {
    console.warn(
      'No matching and valid workshop found for the purchased product.',
    )
    return
  }

  const productId = selectedWorkshop.productId

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
  const productName = await step.run('get product name', async () => {
    const product = await stripe.products.retrieve(productId)
    return product.name || ''
  })

  // Step 5: Send the specific product purchase event
  await step.sendEvent('trigger specific product purchase event', {
    name: SPECIFIC_PRODUCT_PURCHASE_EVENT,
    data: {
      provider: 'stripe' as const,
      checkoutSessionId,
      productId,
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
      {
        expand: ['latest_charge'],
      },
    )
    return typeof retrievedPaymentIntent.latest_charge === 'string'
      ? retrievedPaymentIntent.latest_charge
      : retrievedPaymentIntent.latest_charge?.id || ''
  }

  return typeof paymentIntent.latest_charge === 'string'
    ? paymentIntent.latest_charge
    : paymentIntent.latest_charge?.id || ''
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
