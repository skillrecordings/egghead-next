import {SEND_SLACK_MESSAGE_EVENT} from '@/inngest/events/send-slack-message'
import {inngest} from '@/inngest/inngest.server'

export async function reportCioApiError(error: any) {
  console.error('CIO API error:', error)

  const cioId = error.response.config.url.split('/').pop()
  await inngest.send({
    name: SEND_SLACK_MESSAGE_EVENT,
    data: {
      messageType: 'error',
      message: `CustomerIO responded with a ${error.response.status} / ${error.response.statusText} on ${error.response.request.path}`,
      attachments: [
        {
          color: '#d42115',
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `${process.env.CUSTOMER_IO_WORKSPACE_URL}/${cioId}`,
              },
            },
          ],
        },
      ],
    },
  })
}
