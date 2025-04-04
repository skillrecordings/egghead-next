import BasicEmail from '@/emails/basic-email'
import SpecificProductEmail from '@/emails/specific-product-email'
import {
  WORKSHOP_QUOTE_REQUEST_EVENT,
  WorkshopQuoteRequestEventSchema,
} from '@/inngest/events/workshop-quote-request'
import {inngest} from '@/inngest/inngest.server'
import {sendAnEmail} from '@/utils/send-an-email'
import {format} from 'date-fns'
import {NonRetriableError} from 'inngest'

export const sendWorkshopQuoteEmail = inngest.createFunction(
  {
    id: `send-workshop-quote-email`,
    name: 'Send Workshop Quote Email',
  },
  {
    event: WORKSHOP_QUOTE_REQUEST_EVENT,
  },
  async ({event, step}) => {
    // Validate the event data against our schema
    const validatedData = await step.run('validate event data', async () => {
      try {
        return WorkshopQuoteRequestEventSchema.parse(event.data)
      } catch (error) {
        throw new NonRetriableError(`Invalid event data: ${error}`)
      }
    })

    const {email, seats, productTitle, additionalInfo} = validatedData

    if (!email) {
      throw new NonRetriableError(
        'Customer email is required to send the email',
      )
    }

    // Customize the email body based on your needs
    const emailBody = `${email} has requested a quote for ${seats} seats for ${productTitle}.

Additional info: ${additionalInfo}`

    const sendEmail = await step.run(
      'send the workshop quote email',
      async () => {
        return await sendAnEmail({
          Component: BasicEmail,
          componentProps: {
            body: emailBody,
            preview: `Workshop Quote Request from ${email} for ${productTitle}`,
            messageType: 'transactional',
          },
          Subject: `Workshop Quote Request from ${email} for ${productTitle}`,
          To: 'support@egghead.io',
          ReplyTo: email,
          type: 'transactional',
          From: 'egghead Support <support@egghead.io>',
        })
      },
    )

    // Log the email sending result for monitoring
    console.log(
      `Email sent to support@egghead.io for workshop quote request from ${email}`,
      sendEmail,
    )

    return {
      success: true,
      emailSent: sendEmail,
      email,
    }
  },
)
