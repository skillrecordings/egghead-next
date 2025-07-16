import Stripe from 'stripe'
import {stripe} from '@/utils/stripe'
import {getFeatureFlag} from '@/lib/feature-flags'
import {LiveWorkshopSchema} from '@/types'

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
export async function containsSpecificProduct(
  checkoutSession: Stripe.Checkout.Session,
): Promise<boolean> {
  try {
    const cursorWorkshop = await getFeatureFlag(
      'featureFlagCursorWorkshopSale',
      'workshop',
    )
    const claudeWorkshop = await getFeatureFlag(
      'featureFlagClaudeCodeWorkshopSale',
      'workshop',
    )

    const parsedCursorWorkshop = LiveWorkshopSchema.safeParse(cursorWorkshop)
    const parsedClaudeWorkshop = LiveWorkshopSchema.safeParse(claudeWorkshop)

    const possibleProductIds: string[] = []

    if (parsedCursorWorkshop.success) {
      possibleProductIds.push(parsedCursorWorkshop.data.productId)
    }
    if (parsedClaudeWorkshop.success) {
      possibleProductIds.push(parsedClaudeWorkshop.data.productId)
    }

    if (possibleProductIds.length === 0) {
      console.warn('No workshop found')
      return false
    }

    // Create a local variable to store the session data
    let sessionData = checkoutSession

    // If line_items is not expanded, we need to retrieve it
    if (!sessionData.line_items) {
      try {
        sessionData = await stripe.checkout.sessions.retrieve(sessionData.id, {
          expand: ['line_items.data.price.product'],
        })
      } catch (error) {
        console.error(
          `Failed to retrieve expanded checkout session: ${
            error instanceof Error ? error.message : String(error)
          }`,
        )
        return false
      }
    }

    // Check if any line item contains one of our specific products
    const lineItems = sessionData.line_items?.data || []

    for (const item of lineItems) {
      const product = item.price?.product

      if (!product) continue

      try {
        let productId: string

        // If product is just an ID string
        if (typeof product === 'string') {
          const productDetails = await stripe.products.retrieve(product)
          productId = productDetails.id
        }
        // If product is expanded object
        else if (typeof product === 'object' && 'id' in product) {
          productId = product.id as string
        } else {
          continue
        }

        if (possibleProductIds.includes(productId)) {
          return true
        }
      } catch (error) {
        console.error(
          `Error retrieving product details: ${
            error instanceof Error ? error.message : String(error)
          }`,
        )
        // Continue checking other line items even if one fails
        continue
      }
    }

    return false
  } catch (error) {
    console.error(
      `Error checking for specific product: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
    return false
  }
}

/**
 * Gets the product name for the specific product
 * @returns {Promise<string>} The name of the specific product
 */
export async function getSpecificProductName(): Promise<string> {
  try {
    const workshop = await getFeatureFlag(
      'featureFlagCursorWorkshopSale',
      'workshop',
    )
    const parsedWorkshop = LiveWorkshopSchema.parse(workshop)

    if (!parsedWorkshop) {
      console.warn('No workshop found')
      return ''
    }

    const product = await stripe.products.retrieve(parsedWorkshop.productId)
    return product.name || ''
  } catch (error) {
    console.error(`Error retrieving specific product name: ${error}`)
    return ''
  }
}
