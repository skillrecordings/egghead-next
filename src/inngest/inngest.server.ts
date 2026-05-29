import {Inngest, EventSchemas} from 'inngest'
import {MUX_WEBHOOK_EVENT, MuxWebhook} from './events/mux-webhook'
import {
  DEEPGRAM_WEBHOOK_EVENT,
  DeepgramWebhook,
} from './events/deepgram-webhook'
import {
  INDEX_LESSONS_FOREVER,
  IndexLessonsForever,
} from '@/inngest/events/index-lessons-forever-event'
import {
  SEND_SLACK_MESSAGE_EVENT,
  SlackMessage,
} from './events/send-slack-message'
import {
  SEND_FEEDBACK_EMAIL_EVENT,
  FeedbackEmail,
} from './events/send-feedback-email'
import {
  RECEIVED_TRANSLOADIT_NOTIFICATION_EVENT,
  ReceivedTransloaditNotification,
} from './events/received-transloadit-notification'
import {
  VERIFIED_TRANSLOADIT_NOTIFICATION_EVENT,
  VerifiedTransloaditNotification,
} from './events/verified-transloadit-notification'
import {STRIPE_WEBHOOK_EVENT, StripeWebhook} from './events/stripe-webhook'
import {
  LIFETIME_PURCHASE_EVENT,
  LifetimePurchase,
} from './events/lifetime-purchase'
import {
  COURSE_UNPUBLISHED_EVENT,
  CourseUnpublished,
} from './events/course-unpublished-event'
import {
  CUSTOMER_IO_IDENTIFY_EVENT,
  CustomerIoIdentify,
} from './events/identify-customer-io'
import {
  SPECIFIC_PRODUCT_PURCHASE_EVENT,
  SpecificProductPurchase,
} from './events/specific-product-purchase'
import {
  WORKSHOP_QUOTE_REQUEST_EVENT,
  WorkshopQuoteRequest,
} from './events/workshop-quote-request'
import {
  GUIDE_PUBLISHED_EVENT,
  GuidePublished,
} from '@/inngest/events/guide-published'

type Events = {
  [MUX_WEBHOOK_EVENT]: MuxWebhook
  [STRIPE_WEBHOOK_EVENT]: StripeWebhook
  [LIFETIME_PURCHASE_EVENT]: LifetimePurchase
  [SPECIFIC_PRODUCT_PURCHASE_EVENT]: SpecificProductPurchase
  [DEEPGRAM_WEBHOOK_EVENT]: DeepgramWebhook
  [INDEX_LESSONS_FOREVER]: IndexLessonsForever
  [SEND_SLACK_MESSAGE_EVENT]: SlackMessage
  [SEND_FEEDBACK_EMAIL_EVENT]: FeedbackEmail
  [RECEIVED_TRANSLOADIT_NOTIFICATION_EVENT]: ReceivedTransloaditNotification
  [VERIFIED_TRANSLOADIT_NOTIFICATION_EVENT]: VerifiedTransloaditNotification
  [COURSE_UNPUBLISHED_EVENT]: CourseUnpublished
  [CUSTOMER_IO_IDENTIFY_EVENT]: CustomerIoIdentify
  [WORKSHOP_QUOTE_REQUEST_EVENT]: WorkshopQuoteRequest
  [GUIDE_PUBLISHED_EVENT]: GuidePublished
  test: {
    name: 'test'
    data: {}
  }
}

export const inngest = new Inngest({
  id: 'egghead.io',
  schemas: new EventSchemas().fromRecord<Events>(),
})
