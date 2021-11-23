import Pusher from 'pusher'
import {NextApiRequest, NextApiResponse} from 'next'
import {getTokenFromCookieHeaders} from '../../../utils/auth'
import fetchEggheadUser from '../../../api/egghead/users/from-token'

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
  const {eggheadToken} = getTokenFromCookieHeaders(req.headers.cookie as string)
  const eggheadUser = await fetchEggheadUser(eggheadToken, true)

  const socketId = req.body.socket_id
  const channel = req.body.channel_name
  const presenceData = {
    user_id: eggheadUser.contact_id,
    user_info: {name: eggheadUser.name, avatarURL: eggheadUser.avatar_url},
  }
  const auth = pusher.authenticate(socketId, channel, presenceData)

  res.json(auth)
}
