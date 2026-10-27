import {NextApiRequest, NextApiResponse} from 'next'
import {withPagesApiLogging} from '@/lib/logging'
import {
  getTokenFromCookieHeaders,
  isValidCioId,
} from '@/utils/parse-server-cookie'
import getTracer from '@/utils/honeycomb-tracer'
import {setupHttpTracing} from '@/utils/tracing-js/dist/src/index'
import {CIO_IDENTIFIER_KEY} from '@/config'
import {ENCODED_CUSTOMER_IO_TRACKING_API_CREDENTIALS} from '@/lib/customer-io'
import {reportCioApiError} from '@/utils/cio/report-cio-api-error'
import {logEvent} from '@/utils/structured-log'

const serverCookie = require('cookie')
const axios = require('axios')

const tracer = getTracer('subscriber-api')

const CIO_BASE_URL = `https://beta-api.customer.io/v1/api/`

const RAILS_TIMEOUT_MS = 5000
const CIO_TIMEOUT_MS = 3000

const cioAxios = axios.create({
  baseURL: CIO_BASE_URL,
  timeout: CIO_TIMEOUT_MS,
})

const EGGHEAD_AUTH_DOMAIN = process.env.NEXT_PUBLIC_AUTH_DOMAIN

const eggAxios = axios.create({
  baseURL: EGGHEAD_AUTH_DOMAIN,
  timeout: RAILS_TIMEOUT_MS,
})

async function fetchEggheadUser(token: any) {
  const authorizationHeader = token && {
    authorization: `Bearer ${token}`,
  }
  const {data: current} = await eggAxios.get(
    `/api/v1/users/current?minimal=true`,
    {
      headers: {
        ...authorizationHeader,
      },
    },
  )
  return current
}

// Subscriber data (email, attributes) is only ever returned for the logged-in
// egghead user's own contact_id. The cio cookie is unsigned and can be set from
// any `?cio_id=` link, so on its own it only echoes back the id for tracking.
async function fetchSubscriberForToken(
  eggheadToken: string,
  requestId: string | undefined,
  startTime: number,
) {
  let eggheadUser
  try {
    eggheadUser = await fetchEggheadUser(eggheadToken)
  } catch (error: any) {
    logEvent('warn', 'cio_subscriber_error', {
      request_id: requestId,
      error_type: error?.code === 'ECONNABORTED' ? 'timeout' : 'egghead_user',
      error_message: error?.message,
      error_status: error?.response?.status,
      duration_ms: Date.now() - startTime,
    })
    return {subscriber: undefined, optedOut: false}
  }

  if (eggheadUser?.opted_out) {
    return {subscriber: undefined, optedOut: true}
  }

  const contactId = eggheadUser?.contact_id
  if (!isValidCioId(contactId)) {
    // User found but not identifiable in CIO
    return {subscriber: undefined, optedOut: false}
  }

  if (!process.env.CUSTOMER_IO_APPLICATION_API_KEY) {
    throw new Error('No CIO Secret Key Found')
  }

  const encodedContactId = encodeURIComponent(contactId)

  const headers = {
    'content-type': 'application/json',
    Authorization: `Basic ${ENCODED_CUSTOMER_IO_TRACKING_API_CREDENTIALS}`,
  }

  try {
    await axios.put(
      `https://track.customer.io/api/v1/customers/${encodedContactId}`,
      {
        email: eggheadUser.email,
        pro: eggheadUser.is_pro,
        created_at: eggheadUser.created_at,
      },
      {headers, timeout: CIO_TIMEOUT_MS},
    )
  } catch (syncError: any) {
    logEvent('error', 'cio_subscriber_error', {
      request_id: requestId,
      error_type: 'cio_sync',
      error_message: syncError?.message,
      error_status: syncError?.response?.status,
      contact_id: contactId,
      duration_ms: Date.now() - startTime,
    })
  }

  const subscriber = await cioAxios
    .get(`/customers/${encodedContactId}/attributes`, {
      headers: {
        Authorization: `Bearer ${process.env.CUSTOMER_IO_APPLICATION_API_KEY}`,
      },
    })
    .then(({data}: {data: any}) => data.customer)
    .catch((error: any) => {
      logEvent('error', 'cio_subscriber_error', {
        request_id: requestId,
        error_type: 'cio_attributes',
        error_message: error?.message,
        error_status: error?.response?.status,
        contact_id: contactId,
        duration_ms: Date.now() - startTime,
      })
      return undefined
    })

  return {subscriber, optedOut: false}
}

const cioSubscriber = async (req: NextApiRequest, res: NextApiResponse) => {
  setupHttpTracing({name: cioSubscriber.name, tracer, req, res})
  const startTime = Date.now()
  const requestId = req.headers['x-egghead-request-id'] as string | undefined

  if (req.method !== 'GET') {
    logEvent('warn', 'cio_subscriber_skip', {
      request_id: requestId,
      reason: 'non_get',
    })
    res.status(404).end()
    return
  }

  // No cookies = no user to identify. Return 200 immediately.
  // This eliminates all bot/crawler 500s (57% of frontend errors).
  if (!req.headers.cookie) {
    logEvent('debug', 'cio_subscriber_skip', {
      request_id: requestId,
      reason: 'no_cookies',
      duration_ms: Date.now() - startTime,
    })
    res.status(200).end()
    return
  }

  try {
    // cioId is already validated; malformed cookie values come back empty.
    const {cioId, eggheadToken} = getTokenFromCookieHeaders(
      req.headers.cookie || '',
    )

    // No CIO id and no auth token = anonymous user with random cookies
    if (!cioId && !eggheadToken) {
      logEvent('debug', 'cio_subscriber_skip', {
        request_id: requestId,
        reason: 'no_identifiers',
        duration_ms: Date.now() - startTime,
      })
      res.status(200).end()
      return
    }

    let subscriber
    let optedOut = false

    // The token path wins whenever a token exists, even with a cio cookie.
    if (eggheadToken) {
      ;({subscriber, optedOut} = await fetchSubscriberForToken(
        eggheadToken,
        requestId,
        startTime,
      ))
    }

    if (subscriber) {
      res.setHeader('Cache-Control', 'private, max-age=60')
      if (isValidCioId(subscriber.id)) {
        const cioCookie = serverCookie.serialize(
          CIO_IDENTIFIER_KEY,
          subscriber.id,
          {
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 31556952,
          },
        )
        res.setHeader('Set-Cookie', cioCookie)
      }
      logEvent('debug', 'cio_subscriber_success', {
        request_id: requestId,
        has_subscriber: true,
        cio_id: subscriber.id,
        duration_ms: Date.now() - startTime,
      })
      res.status(200).json(subscriber)
    } else if (cioId && !optedOut) {
      // Cookie-only: echo the id so browser tracking keeps working. Never
      // look the cookie id up in Customer.io or return email/attributes.
      res.setHeader('Cache-Control', 'private, max-age=60')
      logEvent('debug', 'cio_subscriber_success', {
        request_id: requestId,
        has_subscriber: false,
        id_only: true,
        cio_id: cioId,
        duration_ms: Date.now() - startTime,
      })
      res.status(200).json({id: cioId})
    } else {
      logEvent('debug', 'cio_subscriber_success', {
        request_id: requestId,
        has_subscriber: false,
        duration_ms: Date.now() - startTime,
      })
      res.status(200).end()
    }
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') return

    logEvent('error', 'cio_subscriber_error', {
      request_id: requestId,
      error_type: error?.code === 'ECONNABORTED' ? 'timeout' : 'unhandled',
      error_message: error?.message,
      error_status: error?.response?.status,
      has_cookies: !!req.headers.cookie,
      duration_ms: Date.now() - startTime,
    })

    try {
      if (error.response?.status !== 404) {
        await reportCioApiError(error)
      }
    } catch {
      // Never let error reporting crash the handler
    }

    // Always return 200 — this endpoint is non-critical
    res.status(200).end()
  }
}

export default withPagesApiLogging(cioSubscriber)
