import {NextApiRequest, NextApiResponse} from 'next'
import {withPagesApiLogging} from '@/lib/logging'
import {getTokenFromCookieHeaders} from '@/utils/auth'
import fetchEggheadUser from '../../../api/egghead/users/from-token'

function getMinimalUserFlag(input: string | string[] | undefined) {
  if (Array.isArray(input)) {
    return input[0] !== 'false'
  }

  return input !== 'false'
}

export const current = async (req: NextApiRequest, res: NextApiResponse) => {
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
      const eggheadUser = await fetchEggheadUser(
        eggheadToken,
        getMinimalUserFlag(req.query.minimal),
      )
      res.status(200).json(eggheadUser)
    } catch (error: any) {
      const status = error?.response?.status

      if (status === 401 || status === 403) {
        res.status(status).json({error: 'invalid_token', invalidToken: true})
      } else {
        console.error('Error fetching user:', error)
        res.status(500).json({error: 'Failed to fetch user'})
      }
    }
  } else {
    res.status(200).end()
  }
}

export default withPagesApiLogging(current)
