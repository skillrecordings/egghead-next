import z from 'zod'
import {inngest} from '@/inngest/inngest.server'
import {TRANSCRIPT_READY_EVENT} from '@/inngest/events/transcript-requested'
import {MUX_SRT_READY_EVENT} from '@/inngest/events/mux-add-srt-to-asset'
import {sanityWriteClient} from '@/utils/sanity-server'
import axios from 'axios'

const railsToken = process.env.EGGHEAD_ADMIN_TOKEN || ''
const EGGHEAD_AUTH_DOMAIN = process.env.NEXT_PUBLIC_AUTH_DOMAIN || ''

export const VideoResourceSchema = z.object({
  _id: z.string(),
  muxAsset: z
    .object({
      muxPlaybackId: z.string().optional(),
      muxAssetId: z.string().optional(),
    })
    .nullish(),
  transcript: z
    .object({
      text: z.string().optional(),
      srt: z.string().optional(),
    })
    .optional(),
  state: z.enum(['new', 'processing', 'preparing', 'ready', 'errored']),
})

export type VideoResource = z.infer<typeof VideoResourceSchema>

export const transcriptReady = inngest.createFunction(
  {id: `transcript-ready`, name: 'Transcript Ready'},
  {event: TRANSCRIPT_READY_EVENT},
  async ({event, step}) => {
    const videoResource = await step.run(
      'get the video resource from Sanity',
      async () => {
        return await sanityWriteClient.fetch(
          `*[_type == "videoResource" && _id == "${event.data.videoResourceId}"][0]`,
        )
      },
    )

    if (videoResource) {
      await step.run('update the video resource in Sanity', async () => {
        return await sanityWriteClient
          .patch(videoResource._id)
          .set({
            transcript: {
              srt: event.data.srt,
              text: event.data.transcript,
            },
            state: `preparing`,
          })
          .commit()
      })

      let eggAxios = axios.create({
        baseURL: EGGHEAD_AUTH_DOMAIN,
        headers: {
          Authorization: `Bearer ${railsToken}`,
        },
      })

      if (event.data.eggheadLessonId) {
        await step.run(
          'add transcript and srt to lesson in egghead',
          async () => {
            let lessonParams = {
              'lesson[srt]': event.data.srt ?? '',
              'lesson[transcript]': event.data.transcript ?? '',
            }

            let body = new URLSearchParams(lessonParams)

            return await eggAxios.put(
              `/api/v1/lessons/${event.data.eggheadLessonId}`,
              body,
            )
          },
        )
      }
      if (videoResource?.muxAsset) {
        await step.sendEvent('announce that srt is ready', {
          name: MUX_SRT_READY_EVENT,
          data: {
            videoResourceId: videoResource._id as string,
            moduleSlug: event.data.moduleSlug,
            srt: event.data.srt,
          },
        })
      }
    }

    // TODO we can add partykit later
    // await step.run('send the transcript to the party', async () => {
    //   await fetch(
    //     `${process.env.NEXT_PUBLIC_PARTY_KIT_URL}/party/${process.env.NEXT_PUBLIC_PARTYKIT_ROOM_NAME}`,
    //     {
    //       method: 'POST',
    //       body: JSON.stringify({
    //         body: event.data.transcript,
    //         requestId: event.data.videoResourceId,
    //         name: 'transcript.ready',
    //       }),
    //     },
    //   ).catch((e) => {
    //     console.error(e)
    //   })
    // })

    return event.data
  },
)
