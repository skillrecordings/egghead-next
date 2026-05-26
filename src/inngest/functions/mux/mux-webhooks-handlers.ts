import {inngest} from '@/inngest/inngest.server'
import {MUX_WEBHOOK_EVENT} from '@/inngest/events/mux-webhook'

export const muxVideoAssetCreated = inngest.createFunction(
  {id: `mux-video-asset-created`, name: 'Mux Video Asset Created'},
  {
    event: MUX_WEBHOOK_EVENT,
    if: 'event.data.muxWebhookEvent.type == "video.asset.created"',
  },
  async ({event}) => {
    return event.data.muxWebhookEvent.data
  },
)
