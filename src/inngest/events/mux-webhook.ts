import {z} from 'zod'

export const MUX_WEBHOOK_EVENT = 'mux/web-hook-event'

export type MuxWebhook = {
  name: typeof MUX_WEBHOOK_EVENT
  data: {
    muxWebhookEvent: MuxWebhookEvent
  }
}

export const MuxWebhookEventSchema = z.object({
  type: z.string(),
  request_id: z.string().nullable(),
  object: z.object({
    type: z.string(),
    id: z.string(),
  }),
  id: z.string(),
  environment: z.object({
    name: z.string(),
    id: z.string(),
  }),
  data: z.any(),
  created_at: z.string(),
  attempts: z.array(z.any()),
  accessor_source: z.string().nullable(),
  accessor: z.string().nullable(),
})

export type MuxWebhookEvent = z.infer<typeof MuxWebhookEventSchema>
