import {type NextRequest} from 'next/server'
import {inngest} from '@/inngest/inngest.server'
import {
  MUX_WEBHOOK_EVENT,
  MuxWebhookEventSchema,
} from '@/inngest/events/mux-webhook'

export async function POST(req: NextRequest) {
  // todo: check MUX_WEBHOOK_SIGNING_SECRET to verify the request
  const muxWebhookEvent = MuxWebhookEventSchema.parse(await req.json())

  console.info(
    `Received from mux: ${muxWebhookEvent.type} [${muxWebhookEvent.object.id}]`,
  )

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
