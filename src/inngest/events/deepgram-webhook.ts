import {z} from 'zod'

export const DEEPGRAM_WEBHOOK_EVENT = 'deepgram/web-hook-event'

export type DeepgramWebhook = {
  name: typeof DEEPGRAM_WEBHOOK_EVENT
  data: DeepgramWebhookEvent
}

export const DeepgramWebhookEventSchema = z.object({
  videoResourceId: z.string().nullable(),
  moduleSlug: z.string().nullable(),
  results: z.any(),
})

export type DeepgramWebhookEvent = z.infer<typeof DeepgramWebhookEventSchema>
