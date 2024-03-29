import {z} from 'zod'

export const SEND_SLACK_MESSAGE_EVENT = 'slack/message'

export type SlackMessage = {
  name: typeof SEND_SLACK_MESSAGE_EVENT
  data: SlackMessageEvent
}

const FieldSchema = z.object({
  title: z.string().optional(),
  value: z.string().optional(),
  short: z.boolean().optional(),
})

export const SlackMessage = z.object({
  instructorId: z.string(),
  message: z.string(),
  attachments: z
    .array(
      z.object({
        mrkdwn_in: z.array(z.string()).optional(),
        color: z.string().optional(),
        pretext: z.string().optional(),
        author_name: z.string().optional(),
        author_link: z.string().optional(),
        author_icon: z.string().optional(),
        title: z.string().optional(),
        title_link: z.string().optional(),
        text: z.string().optional(),
        fields: z.array(FieldSchema).optional(),
        thumb_url: z.string().optional(),
        footer: z.string().optional(),
        footer_icon: z.string().optional(),
        ts: z.number().optional(),
      }),
    )
    .optional(),
})

export type SlackMessageEvent = z.infer<typeof SlackMessage>
