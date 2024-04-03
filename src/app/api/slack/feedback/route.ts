import {NextRequest} from 'next/server'
import {SEND_SLACK_MESSAGE_EVENT} from '@/inngest/events/send-slack-message'
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

  return new Response('feedback sent', {
    status: 200,
  })
}
