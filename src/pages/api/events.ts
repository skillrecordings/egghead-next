import axios from 'axios'
import {NextApiRequest, NextApiResponse} from 'next'
import getAccessTokenFromCookie from 'utils/getAccessTokenFromCookie'

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
        .then((data) => console.log(data))
      res.status(200).end()
    } catch (error) {
      console.error(JSON.stringify(error))
      res.end()
    }
  } else {
    res.statusCode = 404
    res.end()
  }
}

export default events
