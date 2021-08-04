import axios from 'axios'
import {NextApiRequest, NextApiResponse} from 'next'
import {getTokenFromCookieHeaders, AUTH_DOMAIN} from 'utils/auth'

const current = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET' && eggheadToken) {
    const {eggheadToken} = getTokenFromCookieHeaders(
      req.headers.cookie as string,
    )
  } else {
    res.status(200).end()
  }
}

export default current
