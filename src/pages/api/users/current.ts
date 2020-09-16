import axios from 'axios'
import {NextApiRequest, NextApiResponse} from 'next'
import {getTokenFromCookieHeaders, AUTH_DOMAIN} from 'utils/auth'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {eggheadToken} = getTokenFromCookieHeaders(req.headers.cookie as string)

  if (req.method === 'get' && eggheadToken) {
    await axios
      .get(`${AUTH_DOMAIN}/api/v1/users/current?minimal=${false}`, {
        headers: {
          Authorization: `Bearer ${eggheadToken}`,
        },
      })
      .then(({data}) => {
        res.status(200).json(data)
      })
      .catch((error) => {
        res.status(error.response.status).end(error.response.statusText)
      })
  } else {
    res.statusCode = 404
    res.end()
  }
}
