import {NextApiRequest, NextApiResponse} from 'next'
import {withPagesApiLogging} from '@/lib/logging'
import getTracer from '@/utils/honeycomb-tracer'
import {setupHttpTracing} from '@/utils/tracing-js/dist/src'
import {CIO_IDENTIFIER_KEY} from '@/config'
import {ENCODED_CUSTOMER_IO_TRACKING_API_CREDENTIALS} from '@/lib/customer-io'
import {inngest} from '@/inngest/inngest.server'
import {SEND_SLACK_MESSAGE_EVENT} from '@/inngest/events/send-slack-message'
import {reportCioApiError} from '@/utils/cio/report-cio-api-error'
import {isValidCioId} from '@/utils/parse-server-cookie'
import {logEvent} from '@/utils/structured-log'

const serverCookie = require('cookie')
const axios = require('axios')

const tracer = getTracer('cio-identify-api')

const cioIdentify = async (req: NextApiRequest, res: NextApiResponse) => {
  setupHttpTracing({name: cioIdentify.name, tracer, req, res})

  if (req.method === 'POST') {
    try {
      const {id} = req.query
      const options = req.body || {}

      // The id comes straight from the URL; anything malformed is a no-op.
      if (!isValidCioId(id)) {
        logEvent('warn', 'cio_identify_skip', {reason: 'invalid_id'})
        res.status(200).end()
        return
      }

      if (!process.env.CUSTOMER_IO_APPLICATION_API_KEY)
        throw new Error('No CIO Secret Key Found')

      const headers = {
        'content-type': 'application/json',
        Authorization: `Basic ${ENCODED_CUSTOMER_IO_TRACKING_API_CREDENTIALS}`,
      }

      await axios
        .put(
          `https://track.customer.io/api/v1/customers/${encodeURIComponent(
            id,
          )}`,
          {...options, _update: true},
          {headers},
        )
        .catch(() => {})

      const cioCookie = serverCookie.serialize(CIO_IDENTIFIER_KEY, id, {
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 31556952,
      })

      res.setHeader('Set-Cookie', cioCookie)
      // Write-only: never read the customer back. Anyone can call this with
      // any id (email links identify visitors without a login), so returning
      // attributes here would leak them.
      res.status(200).json({id})
    } catch (error: any) {
      if (error.response?.status !== 404) {
        await reportCioApiError(error)
      }

      res.status(200).end()
    }
  } else {
    logEvent('warn', 'cio_identify_skip', {reason: 'non_post'})
    res.status(404).end()
  }
}

export default withPagesApiLogging(cioIdentify)
