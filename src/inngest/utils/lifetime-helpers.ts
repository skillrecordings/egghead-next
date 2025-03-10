import Stripe from 'stripe'

const LIFETIME_PRICE_ID = process.env.STRIPE_LIFETIME_MEMBERSHIP_PRICE_ID
const PRICE_ID_ALLOW_LIST = [LIFETIME_PRICE_ID]

/**
 * Determines if we should process a checkout session based on the price ID.
 * @param checkoutSession The checkout session to process.
 * @returns {Object} An object with the following properties:
 * @property {boolean} shouldProcess - Whether the checkout session should be processed.
 * @property {string} [message] - An optional message detailing why the session should or should not be processed.
 */
export function shouldProcessCheckoutSession(checkoutSession: {
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
 * Checks if the checkout session contains a lifetime membership purchase
 * @param checkoutSession The checkout session to check
 * @returns {boolean} Whether the checkout session contains a lifetime membership
 */
export function isLifetimePurchase(
  checkoutSession: Stripe.Checkout.Session,
): boolean {
  const stripePriceId = checkoutSession.line_items?.data[0]?.price?.id
  return stripePriceId === LIFETIME_PRICE_ID
}
