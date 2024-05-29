import {inngest} from '@/inngest/inngest.server'
import {SEND_SLACK_MESSAGE_EVENT} from '@/inngest/events/send-slack-message'
import {getGraphQLClient} from '@/utils/configured-graphql-client'
import {postToSlack, postFeedbackToSlack} from '@/lib/slack'

const railsToken = process.env.EGGHEAD_ADMIN_TOKEN || ''

export const sendSlackMessage = inngest.createFunction(
  {id: `send-slack-message`, name: 'Send Slack Message'},
  {event: SEND_SLACK_MESSAGE_EVENT},
  async ({event, step}) => {
    const {messageType, instructorId, message, attachments} = event.data

    let channel = ''

    if (messageType === 'instructor-comms') {
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

      if (!instructor?.slack_group_id)
        throw new Error('no slack channel id found')

      channel = instructor.slack_group_id

      let res = await step.run('send slack message', async () => {
        try {
          await postToSlack({
            channel,
            username: 'Eggo',
            text: message,
            attachments,
          })
        } catch (error) {
          console.error('Error sending slack message', error)
        }
      })
    } else if (messageType === 'feedback') {
      channel = process.env.SLACK_EGGHEAD_FEEDBACK_CHANNEL_WEBHOOK ?? ''

      try {
        await postFeedbackToSlack({
          webhookUrl: channel,
          username: 'Eggo',
          text: message,
          attachments,
        })
      } catch (error) {
        console.error('Error sending slack message', error)
      }
    } else if (messageType === 'error') {
      channel = process.env.SLACK_EGGHEAD_MONITORING_CHANNEL_WEBHOOK ?? ''

      try {
        await postFeedbackToSlack({
          webhookUrl: channel,
          username: 'Eggo',
          text: message,
          attachments,
        })
      } catch (error) {
        console.error('Error sending slack message', error)
      }
    } else {
      throw new Error('invalid message type')
    }

    return new Response('slack message sent', {status: 200})
  },
)
