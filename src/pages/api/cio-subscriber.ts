import {NextApiRequest, NextApiResponse} from 'next'
import {withPagesApiLogging} from '@/lib/logging'
import {getTokenFromCookieHeaders} from '@/utils/parse-server-cookie'
import getTracer from '@/utils/honeycomb-tracer'
import {setupHttpTracing} from '@/utils/tracing-js/dist/src/index'
import {CIO_IDENTIFIER_KEY} from '@/config'
import {ENCODED_CUSTOMER_IO_TRACKING_API_CREDENTIALS} from '@/lib/customer-io'
import {reportCioApiError} from '@/utils/cio/report-cio-api-error'

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

const cioSubscriber = async (req: NextApiRequest, res: NextApiResponse) => {
  setupHttpTracing({name: cioSubscriber.name, tracer, req, res})
  const startTime = Date.now()

  if (req.method !== 'GET') {
    console.error('non-get request made')
    res.status(404).end()
    return
  }

  // No cookies = no user to identify. Return 200 immediately.
  // This eliminates all bot/crawler 500s (57% of frontend errors).
  if (!req.headers.cookie) {
    console.debug(
      JSON.stringify({
        event: 'cio_subscriber_skip',
        reason: 'no_cookies',
        duration_ms: Date.now() - startTime,
      }),
    )
    res.status(200).end()
    return
  }

  try {
    const {cioId, eggheadToken} = getTokenFromCookieHeaders(
      req.headers.cookie || '',
    )

    // No CIO id and no auth token = anonymous user with random cookies
    if (!cioId && !eggheadToken) {
      console.debug(
        JSON.stringify({
          event: 'cio_subscriber_skip',
          reason: 'no_identifiers',
          duration_ms: Date.now() - startTime,
        }),
      )
      res.status(200).end()
      return
    }

    if (!process.env.CUSTOMER_IO_APPLICATION_API_KEY) {
      throw new Error('No CIO Secret Key Found')
    }

    let subscriber

    if (!cioId) {
      const eggheadUser = await fetchEggheadUser(eggheadToken)

      if (!eggheadUser || eggheadUser.opted_out || !eggheadUser.contact_id) {
        // User found but not identifiable in CIO
      } else {
        const headers = {
          'content-type': 'application/json',
          Authorization: `Basic ${ENCODED_CUSTOMER_IO_TRACKING_API_CREDENTIALS}`,
        }

        try {
          await axios.put(
            `https://track.customer.io/api/v1/customers/${eggheadUser.contact_id}`,
            {
              email: eggheadUser.email,
              pro: eggheadUser.is_pro,
              created_at: eggheadUser.created_at,
            },
            {headers, timeout: CIO_TIMEOUT_MS},
          )
        } catch (syncError: any) {
          console.error(
            JSON.stringify({
              event: 'cio_subscriber_error',
              error_type: 'cio_sync',
              error_message: syncError?.message,
              error_status: syncError?.response?.status,
              contact_id: eggheadUser.contact_id,
              duration_ms: Date.now() - startTime,
            }),
          )
        }

        subscriber = await cioAxios
          .get(`/customers/${eggheadUser.contact_id}/attributes`, {
            headers: {
              Authorization: `Bearer ${process.env.CUSTOMER_IO_APPLICATION_API_KEY}`,
            },
          })
          .then(({data}: {data: any}) => data.customer)
          .catch((error: any) => {
            console.error(
              JSON.stringify({
                event: 'cio_subscriber_error',
                error_type: 'cio_attributes',
                error_message: error?.message,
                error_status: error?.response?.status,
                contact_id: eggheadUser.contact_id,
                duration_ms: Date.now() - startTime,
              }),
            )
            return undefined
          })
      }
    } else {
      subscriber = await cioAxios
        .get(`/customers/${cioId}/attributes`, {
          headers: {
            Authorization: `Bearer ${process.env.CUSTOMER_IO_APPLICATION_API_KEY}`,
          },
        })
        .then(({data}: {data: any}) => {
          return data.customer
        })
        .catch((error: any) => {
          console.error(
            JSON.stringify({
              event: 'cio_subscriber_error',
              error_type: 'cio_attributes',
              error_message: error?.message,
              error_status: error?.response?.status,
              cio_id: cioId,
              duration_ms: Date.now() - startTime,
            }),
          )
          return undefined
        })
    }

    if (subscriber) {
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
      res.setHeader('Cache-Control', 'private, max-age=60')
      console.debug(
        JSON.stringify({
          event: 'cio_subscriber_success',
          has_subscriber: true,
          cio_id: subscriber.id,
          duration_ms: Date.now() - startTime,
        }),
      )
      res.status(200).json(subscriber)
    } else {
      console.debug(
        JSON.stringify({
          event: 'cio_subscriber_success',
          has_subscriber: false,
          duration_ms: Date.now() - startTime,
        }),
      )
      res.status(200).end()
    }
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') return

    console.error(
      JSON.stringify({
        event: 'cio_subscriber_error',
        error_type: error?.code === 'ECONNABORTED' ? 'timeout' : 'unhandled',
        error_message: error?.message,
        error_status: error?.response?.status,
        has_cookies: !!req.headers.cookie,
        duration_ms: Date.now() - startTime,
      }),
    )

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
