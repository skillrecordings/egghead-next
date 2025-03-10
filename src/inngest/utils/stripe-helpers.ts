import Stripe from 'stripe'
import {NonRetriableError} from 'inngest'

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
export function isValidStripeCustomer(
  customer: any,
): customer is Stripe.Customer {
  return (
    customer &&
    typeof customer === 'object' &&
    !('deleted' in customer) &&
    'object' in customer &&
    customer.object === 'customer'
  )
}

/**
 * Helper function to get the customer ID from a checkout session.
 */
export function getCustomerId(
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
 * Helper function to extract customer email and name from customer object and checkout session
 */
export function getCustomerDetails(
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
