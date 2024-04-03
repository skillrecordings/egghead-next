import BasicEmail from '@/emails/basic-email'
import {SEND_FEEDBACK_EMAIL_EVENT} from '@/inngest/events/send-feedback-email'
import {inngest} from '@/inngest/inngest.server'
import {sendAnEmail} from '@/utils/send-an-email'
import {Liquid} from 'liquidjs'

export const sendFeedbackEmail = inngest.createFunction(
  {id: `send-feedback-email`, name: 'Send Feedback Email'},
  {event: SEND_FEEDBACK_EMAIL_EVENT},
  async ({event, step}) => {
    const {body, subject, type, to, replyTo, user} = event.data

    const parsedEmailBody: string = await step.run(
      `parse email body`,
      async () => {
        try {
          const engine = new Liquid()
          return engine.parseAndRender(body, {user})
        } catch (e: any) {
          console.error(e.message)
          return body
        }
      },
    )

    const parsedEmailSubject: string = await step.run(
      `parse email subject`,
      async () => {
        try {
          const engine = new Liquid()
          return engine.parseAndRender(subject, {user})
        } catch (e) {
          return subject
        }
      },
    )

    const sendEmail = await step.run('send the email', async () => {
      return await sendAnEmail({
        Component: BasicEmail,
        componentProps: {
          body: parsedEmailBody,
          messageType: 'transactional',
        },
        Subject: parsedEmailSubject,
        To: to,
        ReplyTo: replyTo,
        type,
        From: 'egghead Feedback <support@egghead.io>',
      })
    })

    return {sendEmail}
  },
)
