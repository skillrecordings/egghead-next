import {NextApiRequest, NextApiResponse} from 'next'
import {ACCESS_TOKEN_KEY} from 'utils/auth'
import getTracer from 'utils/honeycomb-tracer'
import {setupHttpTracing} from '@vercel/tracing-js'

const serverCookie = require('cookie')
const axios = require('axios')
const {first} = require('lodash')

const tracer = getTracer('subscriber-api')

function getTokenFromCookieHeaders(serverCookies: string) {
  const parsedCookie = serverCookie.parse(serverCookies)
  const eggheadToken = parsedCookie[ACCESS_TOKEN_KEY] || ''
  const cioId = parsedCookie['cio_id'] || parsedCookie['_cioid'] || ''
  return {cioId, eggheadToken, loginRequired: eggheadToken.length <= 0}
}

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

        if (!eggheadUser || eggheadUser.opted_out || !eggheadUser.contact_id)
          throw new Error('cannot identify user')

        const headers = {
          'content-type': 'application/json',
          Authorization: `Basic ${process.env.CUSTOMER_IO_TRACK_API_BASIC}`,
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
        const cioCookie = serverCookie.serialize('cio_id', subscriber.id, {
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 31556952,
        })

        res.setHeader('Set-Cookie', cioCookie)
        // res.setHeader('Cache-Control', 'max-age=1, stale-while-revalidate')
        res.status(200).json(subscriber)
      } else {
        console.error('no subscriber was loaded')
        res.status(200).end()
      }
    } catch (error) {
      console.error(error.message)
      res.status(200).end()
    }
  } else {
    console.error('non-get request made')
    res.status(404).end()
  }
}

export default cioSubscriber
