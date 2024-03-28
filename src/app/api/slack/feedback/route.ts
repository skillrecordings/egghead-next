import {NextRequest} from 'next/server'

export async function POST(req: NextRequest) {
  const {feedback} = await req.json()

  let response = await fetch(process.env.SLACK_FEEDBACK_URL ?? '', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      attachments: [
        {
          color: '#2EB67D',
          blocks: [
            {
              type: 'divider',
            },
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
                text: `*[${feedback?.site}] ${feedback?.emotion} ${feedback?.category} feedback was sent by ${feedback?.user?.email}* \n\n ${feedback?.comment}`,
              },
            },
          ],
        },
      ],
    }),
  })

  if (response?.status !== 200) {
    throw new Error('error occured, feedback not sent')
  }

  return new Response('feedback sent', {
    status: 200,
  })
}
