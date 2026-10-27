// Workshops are sold through Stripe Payment Links, so the product lives on
// the checkout session's line items, not on charge metadata.

type ProductRef = string | {id: string; name?: string | null} | null

export type WorkshopLineItem = {
  description?: string | null
  price?: {product?: ProductRef} | null
}

export type WorkshopSession = {
  payment_status?: string | null
  payment_intent?: string | {id: string} | null
  amount_total?: number | null
  customer_details?: {email?: string | null} | null
  line_items?: {data?: WorkshopLineItem[]} | null
}

export type WorkshopCharge = {
  id: string
  amount?: number | null
  created: number
  description?: string | null
  billing_details?: {email?: string | null} | null
  metadata?: Record<string, string> | null
}

export type WorkshopTransaction = {
  id: string
  charge_id: string
  amount: number
  created_at: string
  customer_email: string
  product_name: string
  workshop_type: string
}

const productIdOf = (product: ProductRef | undefined) =>
  typeof product === 'string' ? product : product?.id

export const findPastWorkshopLineItem = (
  session: WorkshopSession,
  productIds: string[],
) =>
  session.line_items?.data?.find((item) => {
    const productId = productIdOf(item.price?.product)
    return Boolean(productId) && productIds.includes(productId as string)
  })

export const isPastWorkshopSession = (
  session: WorkshopSession,
  productIds: string[],
) =>
  session.payment_status === 'paid' &&
  Boolean(findPastWorkshopLineItem(session, productIds))

export const sessionPaymentIntentId = (session: WorkshopSession) =>
  typeof session.payment_intent === 'string'
    ? session.payment_intent
    : session.payment_intent?.id

export const toWorkshopTransaction = (
  session: WorkshopSession,
  charge: WorkshopCharge,
  productIds: string[],
  fallbackEmail: string,
): WorkshopTransaction => {
  const lineItem = findPastWorkshopLineItem(session, productIds)
  const product = lineItem?.price?.product
  const productName =
    lineItem?.description ||
    (product && typeof product === 'object' ? product.name : undefined) ||
    charge.description ||
    'Workshop'

  // Determine workshop type for routing to invoice pages
  const workshopType =
    charge.metadata?.workshop_type ||
    (productName.toLowerCase().includes('cursor') ? 'cursor' : 'claude-code')

  return {
    id: charge.id,
    charge_id: charge.id,
    amount: charge.amount || session.amount_total || 0,
    created_at: new Date(charge.created * 1000).toISOString(),
    customer_email:
      charge.billing_details?.email ||
      session.customer_details?.email ||
      fallbackEmail,
    product_name: productName,
    workshop_type: workshopType,
  }
}
