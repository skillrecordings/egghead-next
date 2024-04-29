import {inngest} from '@/inngest/inngest.server'
import {
  muxVideoAssetCreated,
  muxVideoAssetReady,
} from '@/inngest/functions/mux/mux-webhooks-handlers'
import {transcriptReady} from '@/inngest/functions/transcript-ready'
import {videoUploaded} from '@/inngest/functions/video-uploaded'
import {tipVideoUploaded} from '@/inngest/functions/tip-video-uploaded'
import {addSrtToMuxAsset} from '@/inngest/functions/mux/add-srt-to-mux-asset'
import {indexLessonsForever} from '@/inngest/functions/index-lessons'
import {sendSlackMessage} from '@/inngest/functions/send-slack-message'
import {sendFeedbackEmail} from '@/inngest/functions/send-feedback-email'
import {createLesson} from '@/inngest/functions/create-lesson'
import {handleTransloaditNotification} from '@/inngest/functions/handle-transloadit-notification'
import {createCourse} from '@/inngest/functions/create-course'
import {stripeWebhookCheckoutSessionCompleted} from './functions/stripe-webhook-handlers'
import {lifetimePurchase} from '@/inngest/functions/lifetime-purchase'

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
    muxVideoAssetReady,
    transcriptReady,
    videoUploaded,
    tipVideoUploaded,
    addSrtToMuxAsset,
    indexLessonsForever,
    sendSlackMessage,
    sendFeedbackEmail,
    createLesson,
    handleTransloaditNotification,
    createCourse,
    test,
    ...stripeWebhookFunctions,
    lifetimePurchase,
  ],
}
