import {NextApiRequest, NextApiResponse} from 'next'
import {withPagesApiLogging} from '@/lib/logging'
import getTracer from '@/utils/honeycomb-tracer'
import {setupHttpTracing} from '@/utils/tracing-js/dist/src'
import {CIO_IDENTIFIER_KEY} from '@/config'
import {ENCODED_CUSTOMER_IO_TRACKING_API_CREDENTIALS} from '@/lib/customer-io'
import {inngest} from '@/inngest/inngest.server'
import {SEND_SLACK_MESSAGE_EVENT} from '@/inngest/events/send-slack-message'
import {reportCioApiError} from '@/utils/cio/report-cio-api-error'
import {INTERESTED_IN_LIFETIME_SINCE} from '@/utils/cio/subscriber-attributes'
import {
  getTokenFromCookieHeaders,
  isValidCioId,
} from '@/utils/parse-server-cookie'
import {logEvent} from '@/utils/structured-log'

const serverCookie = require('cookie')
const axios = require('axios')

const tracer = getTracer('cio-identify-api')

const CIO_BASE_URL = `https://beta-api.customer.io/v1/api/`
const CIO_TIMEOUT_MS = 3000
const RAILS_TIMEOUT_MS = 5000

const cioAxios = axios.create({
  baseURL: CIO_BASE_URL,
  timeout: CIO_TIMEOUT_MS,
})

const eggAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  timeout: RAILS_TIMEOUT_MS,
})

const MAX_STRING_LENGTH = 500
const MAX_LEARNER_SCORE = 100000

type AttributeValue = string | number | boolean
type AttributeRule = (value: unknown) => value is AttributeValue

const isScalar: AttributeRule = (value): value is AttributeValue =>
  typeof value === 'boolean' ||
  (typeof value === 'number' && Number.isFinite(value)) ||
  (typeof value === 'string' && value.length <= MAX_STRING_LENGTH)

const isBoolean: AttributeRule = (value): value is boolean =>
  typeof value === 'boolean'

const isString = (value: unknown): value is string =>
  typeof value === 'string' && value.length <= MAX_STRING_LENGTH

const isTimestamp: AttributeRule = (value): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0

const isLearnerScore: AttributeRule = (value): value is number =>
  typeof value === 'number' &&
  Number.isFinite(value) &&
  value >= 0 &&
  value <= MAX_LEARNER_SCORE

const isEmail: AttributeRule = (value): value is string =>
  isString(value) && /^[^\s@]+@[^\s@]+$/.test(value)

// Every key a client in this repo sends through cioIdentify (use-cio.tsx).
// Surveys write through the browser SDK (utils/cio/cio-identify.ts), not here.
const EXACT_ATTRIBUTES: Record<string, AttributeRule> = {
  email: isEmail,
  unsubscribed: isBoolean, // unsubscribed.tsx, confirmed.tsx
  theme_preference: isString, // footer.tsx, app-footer.tsx
  learner_score: isLearnerScore, // feedback-input, lessons/overlays.tsx
  [INTERESTED_IN_LIFETIME_SINCE]: isTimestamp, // pricing/lifetime/upcoming-sale.tsx
  career_chat: isScalar, // pages/level-up/email-entry-form.tsx
  online_presence: isScalar, // pages/own-your-online-presence/email-entry-form.tsx
  // customer-io/email-entry-form.tsx `campaignAttribute` values:
  portfolio_foundations: isScalar, // pages/developer-portfolio-foundations/index.mdx
  project_club: isScalar, // pages/clubs/portfolio-project.mdx
}

// Keys built from a list or topic name.
const PATTERN_ATTRIBUTES: [RegExp, AttributeRule][] = [
  [/^unsubscribed_from_[a-z0-9][a-z0-9_-]{0,63}$/, isBoolean], // unsubscribed/confirmed
  [/^[a-z0-9][a-z0-9_-]{0,63}_interest$/, isString], // mdx/topic-interest-form.tsx
]

function ruleFor(key: string): AttributeRule | undefined {
  if (Object.prototype.hasOwnProperty.call(EXACT_ATTRIBUTES, key)) {
    return EXACT_ATTRIBUTES[key]
  }
  return PATTERN_ATTRIBUTES.find(([pattern]) => pattern.test(key))?.[1]
}

function sanitizeAttributes(body: unknown) {
  const attributes: Record<string, AttributeValue> = {}
  const dropped: string[] = []
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return {attributes, dropped}
  }
  for (const [key, value] of Object.entries(body)) {
    const rule = ruleFor(key)
    if (rule && rule(value)) {
      attributes[key] = value
    } else {
      // Key names only; never log values (they can be emails).
      dropped.push(key.slice(0, 80))
    }
  }
  return {attributes, dropped}
}

async function tokenOwnsContact(req: NextApiRequest, id: string) {
  const {eggheadToken} = getTokenFromCookieHeaders(req.headers.cookie || '')
  if (!eggheadToken) return false
  try {
    const {data: current} = await eggAxios.get(
      `/api/v1/users/current?minimal=true`,
      {headers: {authorization: `Bearer ${eggheadToken}`}},
    )
    return Boolean(current?.contact_id) && current.contact_id === id
  } catch {
    return false
  }
}

// Server-side only; the customer read here is never returned to the client.
async function existingCioEmail(id: string): Promise<string | undefined> {
  try {
    const {data} = await cioAxios.get(
      `/customers/${encodeURIComponent(id)}/attributes`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CUSTOMER_IO_APPLICATION_API_KEY}`,
        },
      },
    )
    const email =
      data?.customer?.attributes?.email ?? data?.customer?.email ?? ''
    return typeof email === 'string' ? email : ''
  } catch (error: any) {
    // A brand-new contact has no Customer.io record yet.
    if (error?.response?.status === 404) return ''
    return undefined
  }
}

// Anyone can call identify with any id, so an email only lands if the caller
// owns the contact, or it fills an empty email, or it matches the existing one.
async function emailAllowed(
  req: NextApiRequest,
  id: string,
  email: string,
): Promise<{allowed: boolean; reason: string}> {
  if (await tokenOwnsContact(req, id)) return {allowed: true, reason: 'token'}
  const existing = await existingCioEmail(id)
  if (existing === undefined) return {allowed: false, reason: 'lookup_failed'}
  if (existing === '') return {allowed: true, reason: 'empty'}
  if (existing.toLowerCase() === email.toLowerCase()) {
    return {allowed: true, reason: 'same'}
  }
  return {allowed: false, reason: 'differs'}
}

const cioIdentify = async (req: NextApiRequest, res: NextApiResponse) => {
  setupHttpTracing({name: cioIdentify.name, tracer, req, res})

  if (req.method === 'POST') {
    try {
      const {id} = req.query

      // The id comes straight from the URL; anything malformed is a no-op.
      if (!isValidCioId(id)) {
        logEvent('warn', 'cio_identify_skip', {reason: 'invalid_id'})
        res.status(200).end()
        return
      }

      if (!process.env.CUSTOMER_IO_APPLICATION_API_KEY)
        throw new Error('No CIO Secret Key Found')

      const {attributes, dropped} = sanitizeAttributes(req.body)

      if (dropped.length > 0) {
        logEvent('warn', 'cio_identify_attributes_dropped', {
          cio_id: id,
          dropped_keys: dropped,
        })
      }

      if (typeof attributes.email === 'string') {
        const {allowed, reason} = await emailAllowed(req, id, attributes.email)
        if (!allowed) {
          delete attributes.email
          logEvent('warn', 'cio_identify_email_rejected', {cio_id: id, reason})
        }
      }

      const headers = {
        'content-type': 'application/json',
        Authorization: `Basic ${ENCODED_CUSTOMER_IO_TRACKING_API_CREDENTIALS}`,
      }

      await axios
        .put(
          `https://track.customer.io/api/v1/customers/${encodeURIComponent(
            id,
          )}`,
          {...attributes, _update: true},
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
