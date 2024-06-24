import {inngest} from '@/inngest/inngest.server'
import {RECEIVED_TRANSLOADIT_NOTIFICATION_EVENT} from '@/inngest/events/received-transloadit-notification'
import {VERIFIED_TRANSLOADIT_NOTIFICATION_EVENT} from '@/inngest/events/verified-transloadit-notification'
import crypto from 'node:crypto'

let checkSignature = (fields: any) => {
  const AUTH_SECRET = process.env.TRANSLOADIT_SECRET || ''
  const receivedSignature = fields.signature
  let payload = fields.transloadit

  try {
    const calculatedSignature = crypto
      .createHmac('sha1', AUTH_SECRET)
      .update(Buffer.from(payload, 'utf-8'))
      .digest('hex')

    return calculatedSignature === receivedSignature
  } catch (e) {
    // We can assume the signature string was ill-formed.
    console.error(e)
    return false
  }
}

let signUrl = async ({formData}: {formData: any}) => {
  return checkSignature(formData.data)
}

export let handleTransloaditNotification = inngest.createFunction(
  {
    id: 'handle-transloadit-notification',
    name: 'Handle Transloadit Notification',
  },
  {event: RECEIVED_TRANSLOADIT_NOTIFICATION_EVENT},
  async ({event, step}) => {
    let isValid = await step.run(
      'verify-transloadit-notification',
      async () => {
        return await signUrl({formData: event})
      },
    )

    if (isValid) {
      await step.sendEvent('send-verified-transloadit-notification-event', {
        name: VERIFIED_TRANSLOADIT_NOTIFICATION_EVENT,
        data: event.data,
      })
    }
  },
)
