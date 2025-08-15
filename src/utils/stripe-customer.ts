import Stripe from 'stripe'
import {stripe} from './stripe'

export interface StripeCustomerLookupResult {
  customer: Stripe.Customer | null
  reason: 'found_via_search' | 'found_via_list' | 'not_found' | 'error'
}

export async function findStripeCustomerByEmail(
  email: string,
): Promise<StripeCustomerLookupResult> {
  if (!email) return {customer: null, reason: 'not_found'}

  try {
    // Prefer the Search API (most reliable and scalable)
    // Query syntax: email:'exact@domain.com'
    const result = await stripe.customers.search({
      query: `email:'${email.replace(/'/g, "\\'")}'`,
      limit: 5,
    })

    const exactMatch = result.data.find((c) => c.email === email)
    const customer = exactMatch ?? result.data[0] ?? null

    if (customer) return {customer, reason: 'found_via_search'}
  } catch (error) {
    // Fall back to list when Search API is not available on the account
    console.warn('Stripe customer search failed; falling back to list', error)
  }

  try {
    // Fallback: list can be filtered by email on Stripe API
    const list = await stripe.customers.list({email, limit: 100})
    // Prefer exact email, newest first
    const sorted = list.data
      .filter((c) => c.email === email)
      .sort((a, b) => (b.created || 0) - (a.created || 0))
    const customer = sorted[0] ?? null
    if (customer) return {customer, reason: 'found_via_list'}
    return {customer: null, reason: 'not_found'}
  } catch (error) {
    console.error('Stripe customer list by email failed', error)
    return {customer: null, reason: 'error'}
  }
}

export async function findStripeCustomerIdByEmail(
  email: string,
): Promise<string | null> {
  const {customer} = await findStripeCustomerByEmail(email)
  return customer?.id ?? null
}
