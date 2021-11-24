import Pusher from 'pusher'
import {NextApiRequest, NextApiResponse} from 'next'
import {loadContactAvatars} from 'lib/contacts'
import {keys, last} from 'lodash'

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
  // const channelData = await pusher.get({
  //   path: '/channels',
  //   params: {filter_by_prefix: `private-${req.query.course}@@`},
  // })

  // const courseChannel = await pusher.get({
  //   path: `/channels/${req.query.course}`,
  //   params: {info: 'subscription_count'}
  // })

  // const courseChannelData = await courseChannel.json()
  //
  // console.log(courseChannelData)

  // if (channelData.status === 200) {
  //   const body = await channelData.json()
  //   const channelInfo = body.channels
  //
  //   const contact_ids = keys(channelInfo).map((channel) => {
  //     return last(channel.split('@@')) || ''
  //   })
  //
  //   const users = await loadContactAvatars(contact_ids)
  //   res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  //   res.json(users)
  // } else {
  //   res.end()
  // }

  res.json([])
}
