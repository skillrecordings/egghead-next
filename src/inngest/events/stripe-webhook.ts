import {z} from 'zod'

export const STRIPE_WEBHOOK_EVENT = 'stripe/webhook-event'

export type StripeWebhook = {
  name: typeof STRIPE_WEBHOOK_EVENT
  data: {
    event: StripeWebhookEvent
  }
}

// Define a schema for customer_details to ensure it's properly typed
const CustomerDetailsSchema = z
  .object({
    email: z.string().email().optional(),
    name: z.string().optional(),
    address: z.any().optional(),
    phone: z.string().nullable().optional(),
    tax_exempt: z.string().optional(),
    tax_ids: z.array(z.any()).optional(),
  })
  .passthrough()

export const StripeWebhookEventSchema = z
  .object({
    id: z.string(),
    object: z.string(),
    api_version: z.string(),
    created: z.number(),
    type: z.string(),
    data: z.object({
      object: z
        .object({
          id: z.string(),
          plan: z.any().optional(),
          customer: z.string().nullable(),
          customer_details: CustomerDetailsSchema.optional(),
          current_period_start: z.number().optional(),
          current_period_end: z.number().optional(),
          // Add other common fields that might be needed
          line_items: z.any().optional(),
          amount_total: z.number().optional(),
          payment_intent: z.any().optional(),
          mode: z.string().optional(),
          status: z.string().optional(),
        })
        .passthrough(), // Allow any other properties
      previous_attributes: z.any(),
    }),
  })
  .passthrough() // Allow any other properties at the top level

export type StripeWebhookEvent = z.infer<typeof StripeWebhookEventSchema>
