import {z} from 'zod'

export const TRANSCRIPT_READY_EVENT = 'transcript/transcript-ready'

export type TranscriptReady = {
  name: typeof TRANSCRIPT_READY_EVENT
  data: TranscriptReadyEvent
}

export const TranscriptReadyEventSchema = z.object({
  videoResourceId: z.string().nullable(),
  srt: z.string(),
  transcript: z.string(),
  moduleSlug: z.string().nullable(),
  eggheadLessonId: z.string().nullable(),
})

export type TranscriptReadyEvent = z.infer<typeof TranscriptReadyEventSchema>
