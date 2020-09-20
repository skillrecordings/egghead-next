import axios from 'axios'
import {NextApiRequest, NextApiResponse} from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const response = await axios
        .post(`${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/ahoy/events`, req.body, {
          headers: req.headers,
        })
        .then(({data}) => data)
      res.status(200).json(response)
    } catch (error) {
      console.error(JSON.stringify(error))
      res.status(500).json(error)
    }
  } else {
    res.statusCode = 404
    res.end()
  }
}
