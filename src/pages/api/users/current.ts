import axios from 'axios'
import {NextApiRequest, NextApiResponse} from 'next'
import {getTokenFromCookieHeaders, AUTH_DOMAIN} from '@/utils/auth'
import fetchEggheadUser from '../../../api/egghead/users/from-token'

const current = async (req: NextApiRequest, res: NextApiResponse) => {
  // Set CORS headers for Safari / iOS WebKit compatibility
  const origin = req.headers.origin
  const allowedOrigins = [
    'https://egghead.io',
    'https://www.egghead.io',
    'https://app.egghead.io',
  ]

  let allowOrigin: string | undefined

  if (origin && allowedOrigins.includes(origin)) {
    // Cross-origin or same-origin request with explicit Origin header
    allowOrigin = origin
  } else if (!origin) {
    // Same-origin request - Origin header may be missing
    const host = req.headers.host
    const protocol =
      (Array.isArray(req.headers['x-forwarded-proto'])
        ? req.headers['x-forwarded-proto'][0]
        : req.headers['x-forwarded-proto']) || 'https'

    if (host) {
      allowOrigin = `${protocol}://${host}`
    }
  }

  if (allowOrigin) {
    res.setHeader('Access-Control-Allow-Origin', allowOrigin)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    // Required when Access-Control-Allow-Origin is dynamic
    res.setHeader('Vary', 'Origin')
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    // Include all non-simple headers you use anywhere (Authorization + X-SITE-CLIENT, etc)
    'Authorization, Content-Type, Cookie, X-SITE-CLIENT',
  )

  // Handle CORS preflight
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
    try {
      const eggheadUser = await fetchEggheadUser(eggheadToken, true)
      res.status(200).json(eggheadUser)
    } catch (error: any) {
      // If Rails returns 401/403, the token is invalid - return null gracefully
      // This prevents the client from retrying infinitely
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        res.status(200).json(null)
      } else {
        console.error('Error fetching user:', error)
        res.status(500).json({error: 'Failed to fetch user'})
      }
    }
  } else {
    res.status(200).end()
  }
}

export default current
