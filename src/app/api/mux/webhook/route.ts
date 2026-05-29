import {type NextRequest} from 'next/server'
import {inngest} from '@/inngest/inngest.server'
import {
  MUX_WEBHOOK_EVENT,
  MuxWebhookEventSchema,
} from '@/inngest/events/mux-webhook'
import {withAppApiLogging} from '@/lib/logging'
import {logEvent} from '@/utils/structured-log'

async function _POST(req: NextRequest) {
  // todo: check MUX_WEBHOOK_SIGNING_SECRET to verify the request
  const muxWebhookEvent = MuxWebhookEventSchema.parse(await req.json())

  logEvent('info', 'mux.webhook.received', {
    type: muxWebhookEvent.type,
    object_id: muxWebhookEvent.object.id,
  })

  await inngest.send({
    name: MUX_WEBHOOK_EVENT,
    data: {
      muxWebhookEvent,
    },
  })

  return new Response('ok', {
    status: 200,
  })
}
export const POST = withAppApiLogging(_POST)
