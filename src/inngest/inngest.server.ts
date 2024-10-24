import {Inngest, EventSchemas} from 'inngest'
import {NewTipVideo, TIP_VIDEO_UPLOADED_EVENT} from './events/tips'
import {MUX_WEBHOOK_EVENT, MuxWebhook} from './events/mux-webhook'
import {
  DEEPGRAM_WEBHOOK_EVENT,
  DeepgramWebhook,
} from './events/deepgram-webhook'
import {
  TRANSCRIPT_READY_EVENT,
  TranscriptReady,
} from './events/transcript-requested'
import {VIDEO_UPLOADED_EVENT, VideoUploaded} from './events/video-uploaded'
import {MUX_SRT_READY_EVENT, MuxSrtReady} from './events/mux-add-srt-to-asset'
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
  SANITY_WEBHOOK_LESSON_CREATED,
  SanityWebhookLessonCreated,
} from './events/sanity/webhooks/lesson/created'
import {
  RECEIVED_TRANSLOADIT_NOTIFICATION_EVENT,
  ReceivedTransloaditNotification,
} from './events/received-transloadit-notification'
import {
  VERIFIED_TRANSLOADIT_NOTIFICATION_EVENT,
  VerifiedTransloaditNotification,
} from './events/verified-transloadit-notification'
import {
  SANITY_COURSE_DOCUMENT_CREATED,
  SanityCourseDocumentCreated,
} from '@/inngest/events/sanity-course-document-created'
import {STRIPE_WEBHOOK_EVENT, StripeWebhook} from './events/stripe-webhook'
import {
  LIFETIME_PURCHASE_EVENT,
  LifetimePurchase,
} from './events/lifetime-purchase'
import {
  COURSE_UNPUBLISHED_EVENT,
  CourseUnpublished,
} from './events/course-unpublished-event'

type Events = {
  [MUX_WEBHOOK_EVENT]: MuxWebhook
  [STRIPE_WEBHOOK_EVENT]: StripeWebhook
  [LIFETIME_PURCHASE_EVENT]: LifetimePurchase
  [DEEPGRAM_WEBHOOK_EVENT]: DeepgramWebhook
  [TRANSCRIPT_READY_EVENT]: TranscriptReady
  [VIDEO_UPLOADED_EVENT]: VideoUploaded
  [MUX_SRT_READY_EVENT]: MuxSrtReady
  [TIP_VIDEO_UPLOADED_EVENT]: NewTipVideo
  [INDEX_LESSONS_FOREVER]: IndexLessonsForever
  [SEND_SLACK_MESSAGE_EVENT]: SlackMessage
  [SEND_FEEDBACK_EMAIL_EVENT]: FeedbackEmail
  [SANITY_WEBHOOK_LESSON_CREATED]: SanityWebhookLessonCreated
  [RECEIVED_TRANSLOADIT_NOTIFICATION_EVENT]: ReceivedTransloaditNotification
  [VERIFIED_TRANSLOADIT_NOTIFICATION_EVENT]: VerifiedTransloaditNotification
  [SANITY_COURSE_DOCUMENT_CREATED]: SanityCourseDocumentCreated
  [COURSE_UNPUBLISHED_EVENT]: CourseUnpublished
  test: {
    name: 'test'
    data: {}
  }
}

export const inngest = new Inngest({
  id: 'egghead.io',
  schemas: new EventSchemas().fromRecord<Events>(),
})
