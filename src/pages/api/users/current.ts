import axios from 'axios'
import {NextApiRequest, NextApiResponse} from 'next'
import {getTokenFromCookieHeaders, AUTH_DOMAIN} from '@/utils/auth'
import fetchEggheadUser from '../../../api/egghead/users/from-token'

const current = async (req: NextApiRequest, res: NextApiResponse) => {
  // Set CORS headers for Safari ITP cross-subdomain compatibility
  // Safari blocks XHR from egghead.io after redirect from app.egghead.io
  const origin = req.headers.origin
  const allowedOrigins = [
    'https://egghead.io',
    'https://www.egghead.io',
    'https://app.egghead.io',
  ]

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, Content-Type, Cookie',
  )

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  let {eggheadToken} = getTokenFromCookieHeaders(req.headers.cookie as string)

  if (!eggheadToken && req.headers.authorization) {
    const authHeader = req.headers.authorization
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      eggheadToken = authHeader.substring(7)
    }
  }

  if (req.method === 'GET' && eggheadToken) {
    const eggheadUser = await fetchEggheadUser(eggheadToken, true)

    res.status(200).json(eggheadUser)
  } else {
    res.status(200).end()
  }
}

export default current
