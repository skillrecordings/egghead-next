import {NextApiRequest, NextApiResponse} from 'next'
import getTracer from '@/utils/honeycomb-tracer'
import {setupHttpTracing} from '@/utils/tracing-js/dist/src'
import {CIO_IDENTIFIER_KEY} from '@/config'
import {ENCODED_CUSTOMER_IO_TRACKING_API_CREDENTIALS} from '@/lib/customer-io'
import {inngest} from '@/inngest/inngest.server'
import {SEND_SLACK_MESSAGE_EVENT} from '@/inngest/events/send-slack-message'

const serverCookie = require('cookie')
const axios = require('axios')

const tracer = getTracer('cio-identify-api')

const CIO_BASE_URL = `https://beta-api.customer.io/v1/api/`

const cioAxios = axios.create({
  baseURL: CIO_BASE_URL,
})

const cioIdentify = async (req: NextApiRequest, res: NextApiResponse) => {
  setupHttpTracing({name: cioIdentify.name, tracer, req, res})

  if (req.method === 'POST') {
    try {
      const {id} = req.query
      const options = req.body || {}

      if (!process.env.CUSTOMER_IO_APPLICATION_API_KEY)
        throw new Error('No CIO Secret Key Found')

      const headers = {
        'content-type': 'application/json',
        Authorization: `Basic ${ENCODED_CUSTOMER_IO_TRACKING_API_CREDENTIALS}`,
      }

      await axios.put(
        `https://track.customer.io/api/v1/customers/${id}`,
        {...options, _update: true},
        {headers},
      )

      const cioCookie = serverCookie.serialize(CIO_IDENTIFIER_KEY, id, {
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 31556952,
      })

      const customer = await cioAxios
        .get(`/customers/${id}/attributes`, {
          headers: {
            Authorization: `Bearer ${process.env.CUSTOMER_IO_APPLICATION_API_KEY}`,
          },
        })
        .then(({data}: {data: any}) => data.customer)
        .catch((error: any) => {
          // console.error(error)
          return {}
        })

      res.setHeader('Set-Cookie', cioCookie)
      res.status(200).json(customer)
    } catch (error: any) {
      console.log('sending message', {res: error.response})
      const cioId = error.response.config.url.split('/').pop()
      await inngest.send({
        name: SEND_SLACK_MESSAGE_EVENT,
        data: {
          messageType: 'error',
          message: `CustomerIO responded with a ${error.response.status} / ${error.response.statusText} on ${error.response.request.path}`,
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

export default cioIdentify
