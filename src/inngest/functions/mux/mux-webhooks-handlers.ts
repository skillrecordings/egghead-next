import {inngest} from '@/inngest/inngest.server'
import {MUX_WEBHOOK_EVENT} from '@/inngest/events/mux-webhook'

export const muxVideoAssetCreated = inngest.createFunction(
  {id: `mux-video-asset-created`, name: 'Mux Video Asset Created'},
  {
    event: MUX_WEBHOOK_EVENT,
    if: 'event.data.muxWebhookEvent.type == "video.asset.created"',
  },
  async ({event, step}) => {
    // TODO Partykit
    // await step.run('announce asset created', async () => {
    //   await fetch(
    //     `${process.env.NEXT_PUBLIC_PARTY_KIT_URL}/party/${process.env.NEXT_PUBLIC_PARTYKIT_ROOM_NAME}`,
    //     {
    //       method: 'POST',
    //       body: JSON.stringify({
    //         body: `Mux Asset created: ${event.data.muxWebhookEvent.data.id}`,
    //         requestId: event.data.muxWebhookEvent.data.passthrough,
    //       }),
    //     },
    //   ).catch((e) => {
    //     console.error(e)
    //   })
    // })
    return event.data.muxWebhookEvent.data
  },
)
