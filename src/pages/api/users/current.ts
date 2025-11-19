import axios from 'axios'
import {NextApiRequest, NextApiResponse} from 'next'
import {getTokenFromCookieHeaders, AUTH_DOMAIN} from '@/utils/auth'
import fetchEggheadUser from '../../../api/egghead/users/from-token'

const current = async (req: NextApiRequest, res: NextApiResponse) => {
  // Set CORS headers for Safari ITP compatibility
  // Safari blocks XHR with withCredentials after OAuth redirect
  const origin = req.headers.origin
  const allowedOrigins = [
    'https://egghead.io',
    'https://www.egghead.io',
    'https://app.egghead.io',
  ]

  // For same-origin requests, origin header may be missing
  // Set CORS headers based on origin if present, or host if not
  if (origin) {
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin)
      res.setHeader('Access-Control-Allow-Credentials', 'true')
    }
  } else {
    // Same-origin request - allow credentials
    const host = req.headers.host
    const protocol = req.headers['x-forwarded-proto'] || 'https'
    const currentOrigin = `${protocol}://${host}`
    res.setHeader('Access-Control-Allow-Origin', currentOrigin)
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
