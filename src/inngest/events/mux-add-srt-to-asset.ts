import {z} from 'zod'

export const MUX_SRT_READY_EVENT = 'mux/srt-ready'

export type MuxSrtReady = {
  name: typeof MUX_SRT_READY_EVENT
  data: MuxSrtReadyEvent
}

export const MuxSrtReadyEventSchema = z.object({
  videoResourceId: z.string(),
  srt: z.string(),
})

export type MuxSrtReadyEvent = z.infer<typeof MuxSrtReadyEventSchema>
