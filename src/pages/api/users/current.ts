import axios from 'axios'
import {NextApiRequest, NextApiResponse} from 'next'
import {getTokenFromCookieHeaders, AUTH_DOMAIN} from 'utils/auth'
import fetchEggheadUser from '../../../api/egghead/users/from-token'

const current = async (req: NextApiRequest, res: NextApiResponse) => {
  const {eggheadToken} = getTokenFromCookieHeaders(req.headers.cookie as string)

  if (req.method === 'GET' && eggheadToken) {
    const eggheadUser = fetchEggheadUser(eggheadToken)

    res.status(200).json(eggheadUser)
  } else {
    res.status(200).end()
  }
}

export default current
