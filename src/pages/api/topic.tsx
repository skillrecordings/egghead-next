import {NextApiRequest, NextApiResponse} from 'next'
import {withPagesApiLogging} from '@/lib/logging'
import getTracer from '@/utils/honeycomb-tracer'
import {setupHttpTracing} from '@/utils/tracing-js/dist/src/index'
import {
  getTokenFromCookieHeaders,
  isValidCioId,
} from '@/utils/parse-server-cookie'
import {ENCODED_CUSTOMER_IO_TRACKING_API_CREDENTIALS} from '@/lib/customer-io'
import {logEvent} from '@/utils/structured-log'
const axios = require('axios')

const tracer = getTracer('topic-api')

const CIO_BASE_URL = `https://beta-api.customer.io/v1/api/`

const cioAxios = axios.create({
  baseURL: CIO_BASE_URL,
})

// `topic` becomes part of an attribute key, so keep it to tag-like slugs.
const TOPIC_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$/
const MAX_AMOUNT = 10

const EGGHEAD_AUTH_DOMAIN = process.env.NEXT_PUBLIC_AUTH_DOMAIN

const eggAxios = axios.create({
  baseURL: EGGHEAD_AUTH_DOMAIN,
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

const cioTopicScore = async (req: NextApiRequest, res: NextApiResponse) => {
  setupHttpTracing({name: cioTopicScore.name, tracer, req, res})
  if (req.method === 'POST') {
    try {
      const {topic, amount = 1} = req.body || {}

      if (!topic) throw new Error('No topic to increment')

      const increment = Number(amount)
      if (
        typeof topic !== 'string' ||
        !TOPIC_PATTERN.test(topic) ||
        !Number.isFinite(increment) ||
        increment <= 0 ||
        increment > MAX_AMOUNT
      ) {
        logEvent('warn', 'cio_topic_skip', {reason: 'invalid_input'})
        res.status(200).end()
        return
      }

      let {cioId, eggheadToken} = getTokenFromCookieHeaders(
        req.headers.cookie as string,
      )

      if (!process.env.CUSTOMER_IO_APPLICATION_API_KEY)
        throw new Error('No CIO Secret Key Found')

      const headers = {
        'content-type': 'application/json',
        Authorization: `Basic ${ENCODED_CUSTOMER_IO_TRACKING_API_CREDENTIALS}`,
      }

      let subscriber

      if (!cioId) {
        const eggheadUser = await fetchEggheadUser(eggheadToken)

        if (
          !eggheadUser ||
          eggheadUser.opted_out ||
          !isValidCioId(eggheadUser.contact_id)
        )
          throw new Error('cannot identify user')

        await axios.put(
          `https://track.customer.io/api/v1/customers/${encodeURIComponent(
            eggheadUser.contact_id,
          )}`,
          {
            email: eggheadUser.email,
            pro: eggheadUser.is_pro,
            created_at: eggheadUser.created_at,
          },
          {headers},
        )

        cioId = eggheadUser.contact_id

        subscriber = await cioAxios
          .get(`/customers/${encodeURIComponent(cioId)}/attributes`, {
            headers: {
              Authorization: `Bearer ${process.env.CUSTOMER_IO_APPLICATION_API_KEY}`,
            },
          })
          .then(({data}: {data: any}) => data.customer)
          .catch((error: any) => {
            logEvent('error', 'cio_topic_error', {
              error_type: 'cio_attributes',
              error_message: error?.message,
              error_status: error?.response?.status,
            })
          })
      } else {
        subscriber = await cioAxios
          .get(`/customers/${encodeURIComponent(cioId)}/attributes`, {
            headers: {
              Authorization: `Bearer ${process.env.CUSTOMER_IO_APPLICATION_API_KEY}`,
            },
          })
          .then(({data}: {data: any}) => {
            return data.customer
          })
      }

      // Only the score attributes are read, and nothing goes back in the response.
      if (subscriber && isValidCioId(subscriber.id)) {
        const currentTopicScore: number =
          subscriber?.attributes?.[`${topic}_score`] || 0
        const currentLearnerScore: number =
          subscriber?.attributes?.learner_score || 0

        await axios.put(
          `https://track.customer.io/api/v1/customers/${encodeURIComponent(
            subscriber.id,
          )}`,
          {
            [`${topic}_score`]: Number(currentTopicScore) + increment,
            learner_score: Number(currentLearnerScore) + increment,
          },
          {headers},
        )

        res.status(200).end()
      } else {
        logEvent('debug', 'cio_topic_skip', {reason: 'no_subscriber'})
        res.status(200).end()
      }
    } catch (error: any) {
      logEvent('error', 'cio_topic_error', {
        error_type: 'unhandled',
        error_message: error?.message,
        error_status: error?.response?.status,
      })
      res.status(200).end()
    }
  } else {
    logEvent('warn', 'cio_topic_skip', {reason: 'non_post'})
    res.status(404).end()
  }
}

export default withPagesApiLogging(cioTopicScore)
