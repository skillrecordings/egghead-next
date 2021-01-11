import axios from 'axios'
import {NextApiRequest, NextApiResponse} from 'next'
import getAccessTokenFromCookie from 'utils/get-access-token-from-cookie'

const events = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const token = getAccessTokenFromCookie()
      axios
        .post(`${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/ahoy/events`, req.body, {
          headers: {
            ...(token && {Authorization: `Bearer ${token}`}),
            ...req.headers,
          },
        })
        .catch(() => {
          res.status(200).end()
        })
      res.status(200).end()
    } catch (error) {
      res.status(200).end()
    }
  } else {
    res.statusCode = 404
    res.end()
  }
}

export default events
