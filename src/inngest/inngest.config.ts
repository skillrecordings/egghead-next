import {inngest} from '@/inngest/inngest.server'
import {muxVideoAssetCreated} from '@/inngest/functions/mux/mux-webhooks-handlers'
import {indexLessonsForever} from '@/inngest/functions/index-lessons'
import {sendSlackMessage} from '@/inngest/functions/send-slack-message'
import {sendFeedbackEmail} from '@/inngest/functions/send-feedback-email'
import {handleTransloaditNotification} from '@/inngest/functions/handle-transloadit-notification'
import {stripeWebhookCheckoutSessionCompleted} from './functions/stripe-webhook-handlers'
import {lifetimePurchase} from '@/inngest/functions/lifetime-purchase'
import {identifyCustomerIo} from '@/inngest/functions/identify-customer-io'
import {sendSpecificProductEmail} from '@/inngest/functions/send-specific-product-email'
import {sendWorkshopQuoteEmail} from '@/inngest/functions/send-workshop-quote-email'
import {upsertGuideToTypesense} from '@/inngest/functions/typesense/upsert-guide-to-typesense'
const test = inngest.createFunction(
  {id: `test`, name: 'Test'},
  {event: 'test'},
  async ({event, step}) => {
    await step.run('test', async () => {
      //test stuff here
    })
    return 'test'
  },
)

const stripeWebhookFunctions = [stripeWebhookCheckoutSessionCompleted]

export const inngestConfig = {
  client: inngest,
  functions: [
    muxVideoAssetCreated,
    indexLessonsForever,
    sendSlackMessage,
    sendFeedbackEmail,
    handleTransloaditNotification,
    test,
    ...stripeWebhookFunctions,
    lifetimePurchase,
    identifyCustomerIo,
    sendSpecificProductEmail,
    sendWorkshopQuoteEmail,
    upsertGuideToTypesense,
  ],
}
