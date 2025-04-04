import SpecificProductEmail from '@/emails/specific-product-email'
import {
  SPECIFIC_PRODUCT_PURCHASE_EVENT,
  SpecificProductPurchaseEventSchema,
} from '@/inngest/events/specific-product-purchase'
import {inngest} from '@/inngest/inngest.server'
import {sendAnEmail} from '@/utils/send-an-email'
import {format} from 'date-fns'
import {NonRetriableError} from 'inngest'

export const sendSpecificProductEmail = inngest.createFunction(
  {
    id: `send-specific-product-email`,
    name: 'Send Specific Product Email',
  },
  {
    event: SPECIFIC_PRODUCT_PURCHASE_EVENT,
  },
  async ({event, step}) => {
    // Validate the event data against our schema
    const validatedData = await step.run('validate event data', async () => {
      try {
        return SpecificProductPurchaseEventSchema.parse(event.data)
      } catch (error) {
        throw new NonRetriableError(`Invalid event data: ${error}`)
      }
    })

    const {
      customerEmail,
      customerName,
      productId,
      productName,
      stripeChargeIdentifier,
    } = validatedData

    if (!customerEmail) {
      throw new NonRetriableError(
        'Customer email is required to send the email',
      )
    }

    // Format the current date for the email
    const purchaseDate = format(new Date(), 'MMMM dd, yyyy')

    // Customize the email body based on your needs
    const emailBody = `
You will get an invite to the calendar event shortly. 

We won't be sharing the recording. But we will be handing out all the materials and follow up with a summary of all the steps/questions/answers from the transcript.
`

    const sendEmail = await step.run(
      'send the specific product email',
      async () => {
        return await sendAnEmail({
          Component: SpecificProductEmail,
          componentProps: {
            customerName,
            customerEmail,
            productId,
            productName,
            purchaseDate,
            stripeChargeIdentifier,
            body: emailBody,
            preview: 'Thank you for your purchase!',
            messageType: 'transactional',
          },
          Subject: 'Thank you for your purchase!',
          To: customerEmail,
          ReplyTo: 'support@egghead.io',
          type: 'transactional',
          From: 'egghead Support <support@egghead.io>',
        })
      },
    )

    // Log the email sending result for monitoring
    console.log(
      `Email sent to ${customerEmail} for product ${productId}`,
      sendEmail,
    )

    return {
      success: true,
      emailSent: sendEmail,
      customerEmail,
      productId,
    }
  },
)
