import {NextRequest} from 'next/server'
import {SEND_SLACK_MESSAGE_EVENT} from '@/inngest/events/send-slack-message'
import {SEND_FEEDBACK_EMAIL_EVENT} from '@/inngest/events/send-feedback-email'
import {inngest} from '@/inngest/inngest.server'

export async function POST(req: NextRequest) {
  const {feedback} = await req.json()

  await inngest.send({
    name: SEND_SLACK_MESSAGE_EVENT,
    data: {
      messageType: 'feedback',
      message: `*[${feedback?.site}] ${feedback?.emotion} ${feedback?.category} feedback was sent by ${feedback?.user?.email}*`,
      attachments: [
        {
          color: '#2EB67D',
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: feedback?.url,
              },
            },

            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: feedback?.comment,
              },
            },
          ],
        },
      ],
    },
  })

  const fromMessage = feedback?.user?.name
    ? `from ${feedback?.user?.email}`
    : ''

  await inngest.send({
    name: SEND_FEEDBACK_EMAIL_EVENT,
    data: {
      body: `site: ${feedback?.site} \n\n ${feedback?.emotion} ${feedback?.comment}\n\n${feedback?.url}`,
      subject: `Feedback about ${feedback?.site} ${fromMessage}`,
      type: 'transactional',
      to: 'support@egghead.io',
      replyTo: feedback?.user?.email,
    },
  })

  return new Response('feedback sent', {
    status: 200,
  })
}
