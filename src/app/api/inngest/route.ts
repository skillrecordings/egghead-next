import {serve} from 'inngest/next'
import {inngest} from 'inngest/inngest.server'
import {addSrtToMuxAsset} from 'inngest/functions/mux/add-srt-to-mux-asset'
import {videoUploaded} from 'inngest/functions/video-uploaded'
import {transcriptReady} from 'inngest/functions/transcript-ready'
import {
  muxVideoAssetCreated,
  muxVideoAssetReady,
} from 'inngest/functions/mux/mux-webhooks-handlers'

export const {GET, POST, PUT} = serve({
  client: inngest,
  functions: [
    muxVideoAssetCreated,
    muxVideoAssetReady,
    transcriptReady,
    videoUploaded,
    addSrtToMuxAsset,
  ],
})
