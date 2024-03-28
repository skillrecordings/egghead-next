import {inngest} from '@/inngest/inngest.server'
import {WebClient} from '@slack/web-api'
import {SEND_SLACK_MESSAGE_EVENT} from '@/inngest/events/send-slack-message'
import {loadInstructor} from '@/lib/instructors'
import {getGraphQLClient} from '@/utils/configured-graphql-client'

const railsToken = process.env.EGGHEAD_ADMIN_TOKEN || ''

export const sendSlackMessage = inngest.createFunction(
  {id: `send-slack-message`, name: 'Send Slack Message'},
  {event: SEND_SLACK_MESSAGE_EVENT},
  async ({event, step}) => {
    const slack = new WebClient(process.env.SLACK_EGGO_APP_TOKEN)
    const {instructorId, messageType, message} = event.data

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

    console.log('Instructor ID', instructorId)
    const instructor = await step.run(
      'Get Rails Instructor object',
      async () => {
        try {
          return await graphQLClient.request(query, {slug: instructorId})
        } catch (error) {
          console.error('Error getting instructor', error)
        }
      },
    )

    const slackChannelId = instructor?.slack_group_id

    await step.run('send slack message', async () => {
      try {
        //   await fetch("https://slack.com/api/chat.postMessage",{
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${process.env.SLACK_EGGO_APP_TOKEN}`
        //   },
        //   body: JSON.stringify({
        //     channel: slackChannelId,
        //     text: message,
        //   })
        // })
        await slack.chat.postMessage({
          channel: slackChannelId,
          text: message,
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
        })
      } catch (error) {
        console.error('Error sending slack message', error)
      }
    })
    return 'slack message sent'
  },
)
