import {inngest} from '@/inngest/inngest.server'
import {
  muxVideoAssetCreated,
  muxVideoAssetReady,
} from '@/inngest/functions/mux/mux-webhooks-handlers'
import {transcriptReady} from '@/inngest/functions/transcript-ready'
import {videoUploaded} from '@/inngest/functions/video-uploaded'
import {tipVideoUploaded} from '@/inngest/functions/tip-video-uploaded'
import {addSrtToMuxAsset} from '@/inngest/functions/mux/add-srt-to-mux-asset'
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

export const inngestConfig = {
  client: inngest,
  functions: [
    muxVideoAssetCreated,
    muxVideoAssetReady,
    transcriptReady,
    videoUploaded,
    tipVideoUploaded,
    addSrtToMuxAsset,
    test,
  ],
}
