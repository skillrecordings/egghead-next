import Pusher from 'pusher'
import {NextApiRequest, NextApiResponse} from 'next'

export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || '',
  key: process.env.NEXT_PUBLIC_PUSHER_KEY || '',
  secret: process.env.PUSHER_SECRET || '',
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || '',
  useTLS: true,
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const channelData = await pusher.get({
    path: '/channels',
    params: {filter_by_prefix: `private-${req.query.course}-`},
  })
  if (channelData.status === 200) {
    const body = await channelData.json()
    const channelInfo = body.channels
    res.json(channelInfo)
  } else {
    res.end()
  }
}
