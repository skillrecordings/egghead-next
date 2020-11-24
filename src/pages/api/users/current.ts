import axios from 'axios'
import {NextApiRequest, NextApiResponse} from 'next'
import {getTokenFromCookieHeaders, AUTH_DOMAIN} from 'utils/auth'

const current = async (req: NextApiRequest, res: NextApiResponse) => {
  const {eggheadToken} = getTokenFromCookieHeaders(req.headers.cookie as string)
  if (req.method === 'GET' && eggheadToken) {
    await axios
      .get(
        `${AUTH_DOMAIN}/api/v1/users/current?minimal=${
          req.query.minimal === 'true'
        }`,
        {
          headers: {
            Authorization: `Bearer ${eggheadToken}`,
          },
        },
      )
      .then(({data}) => {
        res.setHeader('Cache-Control', 'max-age=1, stale-while-revalidate')
        res.status(200).json(data)
      })
      .catch((error) => {
        console.error(error.response.statusText)
        res.status(error.response.status).end(error.response.statusText)
      })
  } else {
    res.status(200).end()
  }
}

export default current
