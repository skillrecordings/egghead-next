import {NextRequest, NextResponse} from 'next/server'
import {inngest} from '@/inngest/inngest.server'
import {RECEIVED_TRANSLOADIT_NOTIFICATION_EVENT} from '@/inngest/events/received-transloadit-notification'

export async function POST(req: NextRequest) {
  try {
    let formData = await req.formData()
    let data = {
      transloadit: formData.get('transloadit'),
      signature: formData.get('signature'),
    }

    await inngest.send({
      name: RECEIVED_TRANSLOADIT_NOTIFICATION_EVENT,
      data,
    })

    // Preserves the original notification that Transloadit sends to rails
    await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_DOMAIN ?? ''}/transloadit_events.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: new URLSearchParams({
          transloadit: data.transloadit?.toString() ?? '',
          api_key: process.env.TRANSLOADIT_BOT_TOKEN ?? '',
        }),
      },
    )

    return NextResponse.json({success: true}, {status: 200})
  } catch (e) {
    console.error(e)
    return NextResponse.json({success: true}, {status: 200})
  }
}
