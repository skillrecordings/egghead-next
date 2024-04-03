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

type Events = {
  [MUX_WEBHOOK_EVENT]: MuxWebhook
  [DEEPGRAM_WEBHOOK_EVENT]: DeepgramWebhook
  [TRANSCRIPT_READY_EVENT]: TranscriptReady
  [VIDEO_UPLOADED_EVENT]: VideoUploaded
  [MUX_SRT_READY_EVENT]: MuxSrtReady
  [TIP_VIDEO_UPLOADED_EVENT]: NewTipVideo
  [INDEX_LESSONS_FOREVER]: IndexLessonsForever
  [SEND_SLACK_MESSAGE_EVENT]: SlackMessage
  [SEND_FEEDBACK_EMAIL_EVENT]: FeedbackEmail
  test: {
    name: 'test'
    data: {}
  }
}

export const inngest = new Inngest({
  id: 'egghead.io',
  schemas: new EventSchemas().fromRecord<Events>(),
})
