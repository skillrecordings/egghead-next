import {z} from 'zod'

export const LIFETIME_PURCHASE_EVENT = 'commerce/lifetime-purchase'

export type LifetimePurchase = {
  name: typeof LIFETIME_PURCHASE_EVENT
  data: LifetimePurchaseEvent
}

export const LifetimePurchaseEventSchema = z.object({
  provider: z.literal('stripe'),
  checkoutSessionId: z.string(),
  priceId: z.string(),
  customerId: z.string(),
  stripeChargeIdentifier: z.string(),
})

export type LifetimePurchaseEvent = z.infer<typeof LifetimePurchaseEventSchema>
