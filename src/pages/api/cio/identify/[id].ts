import {NextApiRequest, NextApiResponse} from 'next'
import getTracer from 'utils/honeycomb-tracer'
import {setupHttpTracing} from 'utils/tracing-js/dist/src'
import {CIO_IDENTIFIER_KEY} from 'config'
import {sleep} from '../../../../utils/sleep'

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
        Authorization: `Basic ${process.env.CUSTOMER_IO_TRACK_API_BASIC}`,
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
          console.error(error)
        })

      res.setHeader('Set-Cookie', cioCookie)
      res.status(200).json(customer)
    } catch (error) {
      console.error(error.message)
      res.status(200).end()
    }
  } else {
    console.error('non-get request made')
    res.status(404).end()
  }
}

export default cioIdentify
