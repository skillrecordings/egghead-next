import {NextApiRequest, NextApiResponse} from 'next'
import {withPagesApiLogging} from '@/lib/logging'
import {loadAuthedCourseBits} from '@/lib/playlists'
import {ACCESS_TOKEN_KEY} from '@/utils/auth'

const PRIVATE_NO_STORE_CACHE_CONTROL = 'private, no-store'

export default withPagesApiLogging(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET')
      res.status(405).json({error: 'Method Not Allowed'})
      return
    }

    const slug = Array.isArray(req.query.slug)
      ? req.query.slug[0]
      : req.query.slug

    if (!slug) {
      res.status(400).json({error: 'Missing course slug'})
      return
    }

    res.setHeader('Cache-Control', PRIVATE_NO_STORE_CACHE_CONTROL)
    res.setHeader('x-egghead-cache-scope', 'private')
    res.setHeader('x-egghead-cache-blocker', 'authed_course_bits_api')

    const accessToken = req.cookies[ACCESS_TOKEN_KEY]
    const authedBits = await loadAuthedCourseBits(slug, accessToken)

    res.status(200).json(authedBits ?? {})
  },
)
