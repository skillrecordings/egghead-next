import {
  SPECIFIC_PRODUCT_PURCHASE_EVENT,
  SpecificProductPurchaseEventSchema,
} from '@/inngest/events/specific-product-purchase'
import {inngest} from '@/inngest/inngest.server'
import {postToSlack} from '@/lib/slack'
import {stripe} from '@/utils/stripe'
import {logEvent} from '@/utils/structured-log'
import {NonRetriableError} from 'inngest'

export const sendWorkshopPurchaseSlackNotification = inngest.createFunction(
  {
    id: `send-workshop-purchase-slack-notification`,
    name: 'Send Workshop Purchase Slack Notification',
  },
  {
    event: SPECIFIC_PRODUCT_PURCHASE_EVENT,
  },
  async ({event, step}) => {
    const channel = process.env.SLACK_JOHN_SALES_CHANNEL_ID

    if (!channel) {
      logEvent('warn', 'workshop_purchase_slack_notification_skipped', {
        reason: 'SLACK_JOHN_SALES_CHANNEL_ID is not set',
      })
      return {success: false, skipped: true}
    }

    const validatedData = await step.run('validate event data', async () => {
      try {
        return SpecificProductPurchaseEventSchema.parse(event.data)
      } catch (error) {
        throw new NonRetriableError(`Invalid event data: ${error}`)
      }
    })

    const {customerEmail, productName, stripeChargeIdentifier} = validatedData

    const amountPaid = await step.run('retrieve amount paid', async () => {
      try {
        const charge = await stripe.charges.retrieve(stripeChargeIdentifier)
        return charge.amount / 100
      } catch (error) {
        logEvent('error', 'workshop_purchase_charge_retrieval_failed', {
          stripe_charge_id: stripeChargeIdentifier,
          error_message: error instanceof Error ? error.message : String(error),
        })
        return null
      }
    })

    const slackResponse = await step.run(
      'post purchase notification to slack',
      async () => {
        return await postToSlack({
          channel,
          text: `Someone purchased ${productName}`,
          attachments: [
            {
              fallback: `Sold ${productName}`,
              title: `Sold ${productName}`,
              text: `Somebody (${customerEmail}) bought ${productName}${
                amountPaid !== null ? ` for $${amountPaid}` : ''
              }`,
              color: '#eba234',
            },
          ],
        })
      },
    )

    return {
      success: true,
      slackMessageSent: slackResponse.ok,
      channel,
      productName,
    }
  },
)
