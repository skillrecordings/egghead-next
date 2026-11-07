import {z} from 'zod'

// The egghead.io unsubscribe page is presentation only. drovr owns the token,
// the stop and the answer; this module reads drovr's state for a token and
// posts the reader's choice back. It never verifies or signs a token and holds
// no secret: the token is the credential.

export const DROVR_EGGHEAD_TENANT = 'org-egghead'

const unsubscribeChoiceSchema = z.enum(['course', 'all'])
export type UnsubscribeChoice = z.infer<typeof unsubscribeChoiceSchema>

const drovrUnsubscribeStateSchema = z.object({
  // Masked at send time, for example j***@g***.com.
  email: z.string().min(1),
  tenantId: z.string().min(1),
  course: z
    .object({
      journeyId: z.string().min(1),
      subscribed: z.boolean(),
      displayName: z.string().min(1).optional(),
    })
    .nullish(),
  all: z.object({subscribed: z.boolean()}),
  choices: z.array(z.string()).optional(),
})
export type DrovrUnsubscribeState = z.infer<typeof drovrUnsubscribeStateSchema>

export type UnsubscribeLookup =
  | {status: 'ok'; state: DrovrUnsubscribeState}
  | {status: 'invalid-token'}
  | {status: 'unavailable'; reason: string}

type Fetcher = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>

export type DrovrUnsubscribeClientConfig = {
  baseUrl: string | undefined
  fetch?: Fetcher
  timeoutMs?: number
  retryDelayMs?: number
}

// drovr's unsubscribe token is `v1.<payload>.<mac>` in base64url. Anything
// else is refused here without a round trip; drovr still verifies the rest.
const TOKEN_SHAPE = /^v1\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/
const MAX_TOKEN_LENGTH = 2048

export function isPlausibleUnsubscribeToken(token: string | undefined) {
  return (
    typeof token === 'string' &&
    token.length <= MAX_TOKEN_LENGTH &&
    TOKEN_SHAPE.test(token)
  )
}

export function drovrApiBaseUrl(
  value: string | undefined = process.env.DROVR_API_URL,
): string | undefined {
  const trimmed = value?.trim()
  if (!trimmed) return undefined
  try {
    return new URL(trimmed).origin
  } catch {
    return undefined
  }
}

export function courseDisplayName(
  course: DrovrUnsubscribeState['course'],
): string {
  return course?.displayName ?? 'these emails'
}

// One retry, only when the connection itself failed, never after our own
// timeout. Both drovr calls are idempotent, so sending one twice is safe.
async function fetchOnceRetried(
  config: DrovrUnsubscribeClientConfig,
  path: string,
  init: RequestInit,
): Promise<Response | undefined> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), config.timeoutMs ?? 8000)
    try {
      return await (config.fetch ?? fetch)(`${config.baseUrl}${path}`, {
        ...init,
        cache: 'no-store',
        signal: controller.signal,
      })
    } catch {
      if (controller.signal.aborted) return undefined
    } finally {
      clearTimeout(timer)
    }
    if (attempt === 0) {
      await new Promise((resolve) =>
        setTimeout(resolve, config.retryDelayMs ?? 300),
      )
    }
  }
  return undefined
}

async function call(
  config: DrovrUnsubscribeClientConfig,
  path: string,
  init: RequestInit,
): Promise<UnsubscribeLookup> {
  if (!config.baseUrl) {
    return {status: 'unavailable', reason: 'drovr-api-not-configured'}
  }
  const response = await fetchOnceRetried(config, path, init)
  if (!response) return {status: 'unavailable', reason: 'drovr-unreachable'}
  // drovr answers 400 for a token that fails to parse or verify. The page
  // validates the choice first, so a 400 always means the token.
  if (response.status === 400) return {status: 'invalid-token'}
  if (response.status !== 200) {
    return {status: 'unavailable', reason: `drovr-${response.status}`}
  }
  let body: unknown
  try {
    body = await response.json()
  } catch {
    return {status: 'unavailable', reason: 'drovr-bad-reply'}
  }
  const state = drovrUnsubscribeStateSchema.safeParse(body)
  if (!state.success) {
    return {status: 'unavailable', reason: 'drovr-bad-reply'}
  }
  // A valid token for another tenant's mail is not egghead's to answer.
  if (state.data.tenantId !== DROVR_EGGHEAD_TENANT) {
    return {status: 'invalid-token'}
  }
  return {status: 'ok', state: state.data}
}

// GET /unsubscribe/state?t=<token> changes nothing.
export async function readUnsubscribeState(
  token: string | undefined,
  config: DrovrUnsubscribeClientConfig,
): Promise<UnsubscribeLookup> {
  if (!token || !isPlausibleUnsubscribeToken(token)) {
    return {status: 'invalid-token'}
  }
  return call(config, `/unsubscribe/state?t=${encodeURIComponent(token)}`, {
    method: 'GET',
    headers: {accept: 'application/json'},
  })
}

// POST /unsubscribe {token, choice} is idempotent and answers the new state.
export async function submitUnsubscribeChoice(
  token: string | undefined,
  choice: UnsubscribeChoice,
  config: DrovrUnsubscribeClientConfig,
): Promise<UnsubscribeLookup> {
  if (!token || !isPlausibleUnsubscribeToken(token)) {
    return {status: 'invalid-token'}
  }
  return call(config, '/unsubscribe', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({token, choice}),
  })
}

// Arriving never unsubscribes by itself, because mail scanners open every
// link. One button press does. A preselected choice from the footer link is
// the primary button, and the other stays one click away.
export type UnsubscribePageView =
  | {kind: 'invalid'}
  | {kind: 'unavailable'}
  | {kind: 'all-unsubscribed'; email: string; justUpdated: boolean}
  | {
      kind: 'choose'
      email: string
      courseName: string
      options: UnsubscribeChoice[]
      courseUnsubscribed: boolean
      justUpdated: boolean
      submitFailed: boolean
    }

export function unsubscribePageView(
  lookup: UnsubscribeLookup,
  query: {
    choice?: UnsubscribeChoice
    updated?: UnsubscribeChoice
    submitFailed?: boolean
  } = {},
): UnsubscribePageView {
  if (lookup.status === 'invalid-token') return {kind: 'invalid'}
  if (lookup.status === 'unavailable') return {kind: 'unavailable'}
  const {state} = lookup
  if (!state.all.subscribed) {
    return {
      kind: 'all-unsubscribed',
      email: state.email,
      justUpdated: query.updated === 'all',
    }
  }
  const courseSubscribed = state.course?.subscribed ?? false
  const options: UnsubscribeChoice[] = !courseSubscribed
    ? ['all']
    : query.choice === 'all'
    ? ['all', 'course']
    : ['course', 'all']
  return {
    kind: 'choose',
    email: state.email,
    courseName: courseDisplayName(state.course),
    options,
    courseUnsubscribed: Boolean(state.course) && !courseSubscribed,
    justUpdated: query.updated === 'course' && !courseSubscribed,
    submitFailed: query.submitFailed === true,
  }
}

export function parseUnsubscribeChoice(
  value: unknown,
): UnsubscribeChoice | undefined {
  const parsed = unsubscribeChoiceSchema.safeParse(
    Array.isArray(value) ? value[0] : value,
  )
  return parsed.success ? parsed.data : undefined
}

export function firstParam(value: unknown): string | undefined {
  const first = Array.isArray(value) ? value[0] : value
  return typeof first === 'string' ? first : undefined
}
