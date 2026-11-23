import axios from 'axios'
import {NextApiRequest, NextApiResponse} from 'next'
import {withPagesApiLogging} from '@/lib/logging'
import {getTokenFromCookieHeaders} from '@/utils/auth'
import {logEvent} from '@/utils/structured-log'

export const checkProStatus = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  res.setHeader('Cache-Control', 'private, no-store')

  if (req.method !== 'POST') {
    res.status(404).end()
    return
  }

  let hasProAccess = false
  try {
    const {eggheadToken: cookieToken} = getTokenFromCookieHeaders(
      req.headers.cookie || '',
    )
    const authorization = req.headers.authorization
    const token =
      cookieToken ||
      (authorization?.startsWith('Bearer ') ? authorization.substring(7) : '')

    if (token) {
      // Rails resolves the viewer from their token. Never look up a body email.
      const {data} = await axios.get<unknown>(
        `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/users/current`,
        {
          headers: {Authorization: `Bearer ${token}`},
          timeout: 5000,
        },
      )
      hasProAccess =
        typeof data === 'object' &&
        data !== null &&
        (('is_pro' in data && data.is_pro === true) ||
          ('is_instructor' in data && data.is_instructor === true))
    } else {
      logEvent('debug', 'auth.pro_status.anonymous', {has_pro_access: false})
    }
  } catch {
    // Do not log upstream errors: they can contain credentials or user data.
    logEvent('warn', 'auth.pro_status.lookup_failed', {has_pro_access: false})
  }

  res.status(200).json({hasProAccess})
}

export default withPagesApiLogging(checkProStatus)
