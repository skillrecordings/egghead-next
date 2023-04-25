import Mux from '@mux/mux-node'
import {NextApiRequest, NextApiResponse} from 'next/types'
import {getAbilityFromToken} from 'server/ability'
import {ACCESS_TOKEN_KEY} from 'utils/auth'
const {Video} = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET)

const uploadUrl = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const ability = await getAbilityFromToken(req.cookies[ACCESS_TOKEN_KEY])

    if (ability.can('upload', 'Video')) {
      Video.Uploads.create({
        cors_origin: 'https://egghead.io',
        new_asset_settings: {
          playback_policy: 'public',
        },
      }).then((upload) => {
        // upload.url is what you'll want to return to your client.
        res.json({uploadUrl: upload.url})
      })
    } else {
      res.status(403).end()
    }
  }
}

export default uploadUrl
