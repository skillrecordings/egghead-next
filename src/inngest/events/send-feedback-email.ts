import {z} from 'zod'
import {Viewer} from '@/types'

export const SEND_FEEDBACK_EMAIL_EVENT = 'email/feedback'

export type FeedbackEmail = {
  name: typeof SEND_FEEDBACK_EMAIL_EVENT
  data: FeedbackEmailEvent
}

const ZodViewer: z.ZodType<Viewer> = z.any()

export const Email = z.object({
  body: z.string(),
  subject: z.string(),
  type: z.enum(['transactional', 'broadcast']),
  to: z.string(),
  replyTo: z.string(),
  user: z.object({ZodViewer}).optional(),
})

export type FeedbackEmailEvent = z.infer<typeof Email>
