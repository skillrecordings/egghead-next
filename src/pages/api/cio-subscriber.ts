import {NextApiRequest, NextApiResponse} from 'next'
import {getTokenFromCookieHeaders} from '@/utils/parse-server-cookie'
import getTracer from '@/utils/honeycomb-tracer'
import {setupHttpTracing} from '@/utils/tracing-js/dist/src/index'
import {CIO_IDENTIFIER_KEY} from '@/config'
import {ENCODED_CUSTOMER_IO_TRACKING_API_CREDENTIALS} from '@/lib/customer-io'
import {inngest} from '@/inngest/inngest.server'
import {SEND_SLACK_MESSAGE_EVENT} from '@/inngest/events/send-slack-message'

const serverCookie = require('cookie')
const axios = require('axios')
const {first} = require('lodash')

const tracer = getTracer('subscriber-api')

const CIO_BASE_URL = `https://beta-api.customer.io/v1/api/`

const cioAxios = axios.create({
  baseURL: CIO_BASE_URL,
})

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

const cioSubscriber = async (req: NextApiRequest, res: NextApiResponse) => {
  setupHttpTracing({name: cioSubscriber.name, tracer, req, res})

  if (req.method === 'GET') {
    try {
      const {cioId, eggheadToken} = getTokenFromCookieHeaders(
        req.headers.cookie as string,
      )

      if (!process.env.CUSTOMER_IO_APPLICATION_API_KEY)
        throw new Error('No CIO Secret Key Found')

      let subscriber

      if (!cioId) {
        const eggheadUser = await fetchEggheadUser(eggheadToken)

        if (!eggheadUser || eggheadUser.opted_out || !eggheadUser.contact_id) {
        } else {
          const headers = {
            'content-type': 'application/json',
            Authorization: `Basic ${ENCODED_CUSTOMER_IO_TRACKING_API_CREDENTIALS}`,
          }

          await axios.put(
            `https://track.customer.io/api/v1/customers/${eggheadUser.contact_id}`,
            {
              email: eggheadUser.email,
              pro: eggheadUser.is_pro,
              created_at: eggheadUser.created_at,
            },
            {headers},
          )

          subscriber = await cioAxios
            .get(`/customers/${eggheadUser.contact_id}/attributes`, {
              headers: {
                Authorization: `Bearer ${process.env.CUSTOMER_IO_APPLICATION_API_KEY}`,
              },
            })
            .then(({data}: {data: any}) => data.customer)
            .catch((error: any) => {
              console.error(error)
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
        // res.setHeader('Cache-Control', 'max-age=1, stale-while-revalidate')
        res.status(200).json(subscriber)
      } else {
        console.error('no subscriber was loaded')
        res.status(200).end()
      }
    } catch (error: any) {
      console.error(error)
      console.log('sending message', {res: error.response})
      const cioId = error.response.config.url.split('/').pop()
      await inngest.send({
        name: SEND_SLACK_MESSAGE_EVENT,
        data: {
          messageType: 'error',
          message: `CustomerIO responded with a ${error.response.status} / ${error.response.statusText} on ${error.response.request.path}for /api/cio-subscriber`,
          channel: 'C04AUF65Y9G',
          attachments: [
            {
              color: '#d42115',
              blocks: [
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: `${process.env.CUSTOMER_IO_WORKSPACE_URL}/${cioId}`,
                  },
                },
              ],
            },
          ],
        },
      })

      res.status(200).end()
    }
  } else {
    console.error('non-get request made')
    res.status(404).end()
  }
}

export default cioSubscriber
