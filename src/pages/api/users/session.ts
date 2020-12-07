import {NextApiRequest, NextApiResponse} from 'next'
import {ACCESS_TOKEN_KEY} from 'utils/auth'
import * as serverCookie from 'cookie'

const session = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', [
      serverCookie.serialize(ACCESS_TOKEN_KEY, '', {
        maxAge: -1,
        path: '/',
        httpOnly: true,
        domain: process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN,
      }),
    ])

    res.writeHead(200)
    res.end()
  } else {
    res.statusCode = 404
    res.end()
  }
}

export default session
