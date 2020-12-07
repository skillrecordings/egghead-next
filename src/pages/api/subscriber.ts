import {NextApiRequest, NextApiResponse} from 'next'
import {ACCESS_TOKEN_KEY} from 'utils/auth'
import getTracer from 'utils/honeycomb-tracer'
import {setupHttpTracing} from '@vercel/tracing-js'

const serverCookie = require('cookie')
const axios = require('axios')
const {first} = require('lodash')

const tracer = getTracer('subscriber-api')

const enableLog = true
const log = (...args: string[]) => enableLog && console.log(...args)

function getTokenFromCookieHeaders(serverCookies: string) {
  const parsedCookie = serverCookie.parse(serverCookies)
  const eggheadToken = parsedCookie[ACCESS_TOKEN_KEY] || ''
  const convertkitId = parsedCookie['ck_subscriber_id'] || ''
  return {convertkitId, eggheadToken, loginRequired: eggheadToken.length <= 0}
}

const CONVERTKIT_BASE_URL = `https://api.convertkit.com/v3/`

const ckAxios = axios.create({
  baseURL: CONVERTKIT_BASE_URL,
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
  log('successfully fetched egghead user')
  return current
}

const subscriber = async (req: NextApiRequest, res: NextApiResponse) => {
  setupHttpTracing({name: subscriber.name, tracer, req, res})
  if (req.method === 'GET') {
    try {
      const {convertkitId, eggheadToken} = getTokenFromCookieHeaders(
        req.headers.cookie as string,
      )

      if (!process.env.CONVERTKIT_API_SECRET)
        throw new Error('No Convertkit Secret Key Found')

      let subscriber

      if (!convertkitId) {
        const eggheadUser = await fetchEggheadUser(eggheadToken)
        subscriber = await ckAxios
          .get(
            `/subscribers?api_secret=${process.env.CONVERTKIT_API_SECRET}&email_address=${eggheadUser.email}`,
          )
          .then(({data}: {data: any}) => first(data.subscribers))
      } else {
        subscriber = await ckAxios
          .get(
            `/subscribers/${convertkitId}?api_secret=${process.env.CONVERTKIT_API_SECRET}`,
          )
          .then(({data}: {data: any}) => data.subscriber)
      }

      const ckCookie = serverCookie.serialize(
        'ck_subscriber_id',
        subscriber.id,
        {
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 31556952,
        },
      )

      res.setHeader('Set-Cookie', ckCookie)
      res.setHeader('Cache-Control', 'max-age=1, stale-while-revalidate')
      res.status(200).json(subscriber)
    } catch (error) {
      console.log(error)
      res.status(200).end()
    }
  } else {
    console.error('non-get request made')
    res.status(404).end()
  }
}

export default subscriber
