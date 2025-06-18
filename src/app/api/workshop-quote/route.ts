import {NextRequest} from 'next/server'

import {WORKSHOP_QUOTE_REQUEST_EVENT} from '@/inngest/events/workshop-quote-request'
import {inngest} from '@/inngest/inngest.server'

export async function POST(req: NextRequest) {
  const {email, seats, additionalInfo, productTitle} = await req.json()

  await inngest.send({
    name: WORKSHOP_QUOTE_REQUEST_EVENT,
    data: {
      email,
      seats,
      productTitle,
      additionalInfo,
    },
  })

  return new Response('workshop quote request sent', {
    status: 200,
  })
}
