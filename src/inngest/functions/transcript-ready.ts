import {inngest} from '@/inngest/inngest.server'
import {TRANSCRIPT_READY_EVENT} from '@/inngest/events/transcript-requested'
import axios from 'axios'

const railsToken = process.env.EGGHEAD_ADMIN_TOKEN || ''
const EGGHEAD_AUTH_DOMAIN = process.env.NEXT_PUBLIC_AUTH_DOMAIN || ''

export const transcriptReady = inngest.createFunction(
  {id: `transcript-ready`, name: 'Transcript Ready'},
  {event: TRANSCRIPT_READY_EVENT},
  async ({event, step}) => {
    if (event.data.eggheadLessonId) {
      await step.run(
        'add transcript and srt to lesson in egghead',
        async () => {
          const eggAxios = axios.create({
            baseURL: EGGHEAD_AUTH_DOMAIN,
            headers: {
              Authorization: `Bearer ${railsToken}`,
            },
          })

          const lessonParams = {
            'lesson[srt]': event.data.srt ?? '',
            'lesson[transcript]': event.data.transcript ?? '',
          }

          return await eggAxios.put(
            `/api/v1/lessons/${event.data.eggheadLessonId}`,
            new URLSearchParams(lessonParams),
          )
        },
      )
    }

    return event.data
  },
)
