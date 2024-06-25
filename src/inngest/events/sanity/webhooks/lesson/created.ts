import {z} from 'zod'

export const SANITY_WEBHOOK_LESSON_CREATED = 'sanity/webhooks/lesson/created'

export type SanityWebhookLessonCreated = {
  name: typeof SANITY_WEBHOOK_LESSON_CREATED
  data: SanityWebhookLessonCreatedEvent
}

export const SanityWebhookLessonCreatedEventSchema = z.object({
  body: z.any(),
})

export type SanityWebhookLessonCreatedEvent = z.infer<
  typeof SanityWebhookLessonCreatedEventSchema
>
