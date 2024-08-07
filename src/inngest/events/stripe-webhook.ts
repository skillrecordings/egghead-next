import {z} from 'zod'

export const STRIPE_WEBHOOK_EVENT = 'stripe/webhook-event'

export type StripeWebhook = {
  name: typeof STRIPE_WEBHOOK_EVENT
  data: {
    event: StripeWebhookEvent
  }
}

export const StripeWebhookEventSchema = z.object({
  id: z.string(),
  object: z.string(),
  api_version: z.string(),
  created: z.number(),
  type: z.string(),
  data: z.object({
    object: z
      .object({
        id: z.string(),
        plan: z.any(),
        customer: z.string(),
        current_period_start: z.number().optional(),
        current_period_end: z.number().optional(),
      })
      .passthrough(),
    previous_attributes: z.any(),
  }),
})

export type StripeWebhookEvent = z.infer<typeof StripeWebhookEventSchema>
