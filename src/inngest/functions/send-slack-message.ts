import {inngest} from '@/inngest/inngest.server'
import {SEND_SLACK_MESSAGE_EVENT} from '@/inngest/events/send-slack-message'
import {getGraphQLClient} from '@/utils/configured-graphql-client'

const railsToken = process.env.EGGHEAD_ADMIN_TOKEN || ''

export const sendSlackMessage = inngest.createFunction(
  {id: `send-slack-message`, name: 'Send Slack Message'},
  {event: SEND_SLACK_MESSAGE_EVENT},
  async ({event, step}) => {
    const {instructorId, message} = event.data

    const query = `query getInstructor($slug: String!){
      instructor(slug: $slug){
        id
        full_name
        avatar_url
        slug
        bio_short
        twitter
        website
        slack_group_id
      }
    }`
    const graphQLClient = getGraphQLClient(railsToken)

    const {instructor} = await step.run(
      'Get Rails Instructor object',
      async () => {
        try {
          return await graphQLClient.request(query, {slug: instructorId})
        } catch (error) {
          console.error('Error fetching instructor', error)
        }
      },
    )

    if (!instructor?.slack_group_id) return 'no slack channel id found'

    await step.run('send slack message', async () => {
      try {
        await fetch(
          `${process.env.SLACK_EGGHEAD_DOMAIN ?? ''}/api/chat.postMessage`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.SLACK_ADMIN_API_KEY}`,
            },
            body: JSON.stringify({
              channel: instructor.slack_group_id,
              text: message,
              username: 'Eggo',
              icon_url:
                'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1569292667/eggo/eggo_flair.png',
              blocks: [
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: message,
                  },
                },
                {
                  type: 'context',
                  elements: [
                    {
                      type: 'image',
                      image_url: instructor.avatar_url,
                      alt_text: 'profile picture',
                    },
                    {
                      type: 'plain_text',
                      text: instructor.full_name,
                      emoji: true,
                    },
                  ],
                },
              ],
            }),
          },
        ).then((res) => {
          if (!res.ok) {
            throw new Error(`Server error ${res.status}`)
          }
          return res.json()
        })
      } catch (error) {
        console.error('Error sending slack message', error)
      }
    })
    return 'slack message sent'
  },
)
