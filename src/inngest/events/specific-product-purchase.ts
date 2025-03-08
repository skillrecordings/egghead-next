import {z} from 'zod'

export const SPECIFIC_PRODUCT_PURCHASE_EVENT =
  'commerce/specific-product-purchase'

export type SpecificProductPurchase = {
  name: typeof SPECIFIC_PRODUCT_PURCHASE_EVENT
  data: SpecificProductPurchaseEvent
}

export const SpecificProductPurchaseEventSchema = z.object({
  provider: z.literal('stripe'),
  checkoutSessionId: z.string(),
  productId: z.string(),
  productName: z.string(),
  priceId: z.string(),
  customerId: z.string(),
  stripeChargeIdentifier: z.string(),
  customerEmail: z.string().email({
    message: 'Invalid email address format',
  }),
  customerName: z.string().optional(),
})

export type SpecificProductPurchaseEvent = z.infer<
  typeof SpecificProductPurchaseEventSchema
>
