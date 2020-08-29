import axios from 'axios'
import {NextApiRequest, NextApiResponse} from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const response = axios
      .post(`${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/ahoy/visits`, req.body, {
        headers: req.headers,
      })
      .then(({data}) => data)
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(response))
  } else {
    res.statusCode = 404
    res.end()
  }
}
