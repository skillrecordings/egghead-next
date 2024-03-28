import {z} from 'zod'

export const SEND_SLACK_MESSAGE_EVENT = 'slack/message'

export type SlackMessage = {
  name: typeof SEND_SLACK_MESSAGE_EVENT
  data: SlackMessageEvent
}

export const SlackMessage = z.object({
  instructorId: z.string(),
  messageType: z.string(),
  message: z.string(),
})

export type SlackMessageEvent = z.infer<typeof SlackMessage>
