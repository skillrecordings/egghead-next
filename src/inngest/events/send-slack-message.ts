import {z} from 'zod'
import type {MessageAttachment} from '@slack/web-api'

export const SEND_SLACK_MESSAGE_EVENT = 'slack/message'

export type SlackMessage = {
  name: typeof SEND_SLACK_MESSAGE_EVENT
  data: SlackMessageEvent
}

const Attachments: z.ZodType<MessageAttachment> = z.any()

export const SlackMessage = z.object({
  instructorId: z.string().optional(),
  messageType: z.enum(['instructor-comms', 'feedback', 'error']),
  message: z.string(),
  attachments: z.array(Attachments),
})

export type SlackMessageEvent = z.infer<typeof SlackMessage>
