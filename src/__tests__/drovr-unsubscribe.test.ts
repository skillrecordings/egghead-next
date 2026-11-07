import type {NextApiRequest, NextApiResponse} from 'next'
import handler from '@/pages/api/unsubscribe'
import {
  readUnsubscribeState,
  submitUnsubscribeChoice,
  unsubscribePageView,
  type DrovrUnsubscribeState,
} from '@/lib/drovr-unsubscribe'

jest.mock('@/utils/structured-log', () => ({logEvent: jest.fn()}))

const TOKEN = 'v1.eyJ0IjoiZWdnIn0.c2lnbmF0dXJl'
const BASE_URL = 'https://api.drovr.test'

const eggheadState = (
  overrides: Partial<DrovrUnsubscribeState> = {},
): DrovrUnsubscribeState => ({
  email: 'j***@e***.io',
  tenantId: 'org-egghead',
  course: null,
  all: {subscribed: true},
  choices: ['all'],
  ...overrides,
})

const reply = (status: number, body?: unknown) =>
  ({
    status,
    json: async () => {
      if (body === undefined) throw new Error('no body')
      return body
    },
  } as unknown as Response)

const recordingFetch = (...replies: Array<Response | Error>) => {
  const calls: Array<{url: string; init?: RequestInit}> = []
  const fetch = jest.fn(async (input: unknown, init?: RequestInit) => {
    calls.push({url: String(input), init})
    const next = replies.shift()
    if (!next) throw new Error('unexpected call')
    if (next instanceof Error) throw next
    return next
  })
  return {calls, fetch}
}

describe('reading drovr unsubscribe state', () => {
  it('refuses a token that is not drovr-shaped without calling drovr', async () => {
    const {calls, fetch} = recordingFetch()

    for (const token of [
      undefined,
      '',
      'abc',
      'v2.a.b',
      `v1.${'a'.repeat(3000)}.b`,
    ]) {
      expect(
        await readUnsubscribeState(token, {baseUrl: BASE_URL, fetch}),
      ).toEqual({status: 'invalid-token'})
    }

    expect(calls).toEqual([])
  })

  it("answers egghead's state, and reads drovr's 400 as an invalid token", async () => {
    const {calls, fetch} = recordingFetch(
      reply(200, eggheadState()),
      reply(400, {type: 'invalid-unsubscribe-token'}),
    )

    expect(
      await readUnsubscribeState(TOKEN, {baseUrl: BASE_URL, fetch}),
    ).toEqual({status: 'ok', state: eggheadState()})
    expect(
      await readUnsubscribeState(TOKEN, {baseUrl: BASE_URL, fetch}),
    ).toEqual({status: 'invalid-token'})
    expect(calls[0]?.url).toBe(
      `${BASE_URL}/unsubscribe/state?t=${encodeURIComponent(TOKEN)}`,
    )
    expect(calls[0]?.init?.method).toBe('GET')
  })

  it("treats a valid token for another tenant's mail as invalid on egghead's page", async () => {
    const {fetch} = recordingFetch(
      reply(200, eggheadState({tenantId: 'org-aihero'})),
    )

    expect(
      await readUnsubscribeState(TOKEN, {baseUrl: BASE_URL, fetch}),
    ).toEqual({status: 'invalid-token'})
  })

  it('is unavailable, never a false answer, when drovr is unset, down or replies badly', async () => {
    const {fetch} = recordingFetch(
      reply(503),
      reply(200, {email: 'j***@e***.io'}),
      reply(200),
    )

    expect(
      await readUnsubscribeState(TOKEN, {baseUrl: undefined, fetch}),
    ).toEqual({status: 'unavailable', reason: 'drovr-api-not-configured'})
    expect(
      await readUnsubscribeState(TOKEN, {baseUrl: BASE_URL, fetch}),
    ).toEqual({status: 'unavailable', reason: 'drovr-503'})
    expect(
      await readUnsubscribeState(TOKEN, {baseUrl: BASE_URL, fetch}),
    ).toEqual({status: 'unavailable', reason: 'drovr-bad-reply'})
    expect(
      await readUnsubscribeState(TOKEN, {baseUrl: BASE_URL, fetch}),
    ).toEqual({status: 'unavailable', reason: 'drovr-bad-reply'})
  })

  it('retries a dropped connection once, then gives up as unreachable', async () => {
    const recovered = recordingFetch(
      new TypeError('fetch failed'),
      reply(200, eggheadState()),
    )

    expect(
      await readUnsubscribeState(TOKEN, {
        baseUrl: BASE_URL,
        fetch: recovered.fetch,
        retryDelayMs: 0,
      }),
    ).toEqual({status: 'ok', state: eggheadState()})

    const down = recordingFetch(
      new TypeError('fetch failed'),
      new TypeError('fetch failed'),
    )

    expect(
      await readUnsubscribeState(TOKEN, {
        baseUrl: BASE_URL,
        fetch: down.fetch,
        retryDelayMs: 0,
      }),
    ).toEqual({status: 'unavailable', reason: 'drovr-unreachable'})
    expect(down.calls).toHaveLength(2)
  })
})

describe('posting an unsubscribe choice', () => {
  it('posts the token and choice to drovr and answers the new state', async () => {
    const stopped = eggheadState({all: {subscribed: false}})
    const {calls, fetch} = recordingFetch(reply(200, stopped))

    expect(
      await submitUnsubscribeChoice(TOKEN, 'all', {baseUrl: BASE_URL, fetch}),
    ).toEqual({status: 'ok', state: stopped})
    expect(calls[0]?.url).toBe(`${BASE_URL}/unsubscribe`)
    expect(calls[0]?.init?.method).toBe('POST')
    expect(JSON.parse(String(calls[0]?.init?.body))).toEqual({
      token: TOKEN,
      choice: 'all',
    })
  })
})

describe('the unsubscribe page view', () => {
  const course = {
    journeyId: 'egghead-signup-welcome',
    subscribed: true,
    displayName: 'the egghead welcome emails',
  }

  it('offers the course first, or all first when the footer link preselects it', () => {
    const lookup = {status: 'ok' as const, state: eggheadState({course})}

    expect(unsubscribePageView(lookup)).toMatchObject({
      kind: 'choose',
      options: ['course', 'all'],
      courseName: 'the egghead welcome emails',
    })
    expect(unsubscribePageView(lookup, {choice: 'all'})).toMatchObject({
      options: ['all', 'course'],
    })
  })

  it('offers only "all" when there is no course or it is already off, and says when everything is off', () => {
    expect(
      unsubscribePageView({status: 'ok', state: eggheadState()}),
    ).toMatchObject({kind: 'choose', options: ['all']})
    expect(
      unsubscribePageView({
        status: 'ok',
        state: eggheadState({course: {...course, subscribed: false}}),
      }),
    ).toMatchObject({options: ['all'], courseUnsubscribed: true})
    expect(
      unsubscribePageView(
        {status: 'ok', state: eggheadState({all: {subscribed: false}})},
        {updated: 'all'},
      ),
    ).toEqual({
      kind: 'all-unsubscribed',
      email: 'j***@e***.io',
      justUpdated: true,
    })
  })
})

describe('POST /api/unsubscribe', () => {
  const originalFetch = global.fetch
  const originalUrl = process.env.DROVR_API_URL

  beforeEach(() => {
    process.env.DROVR_API_URL = `${BASE_URL}/`
  })

  afterEach(() => {
    global.fetch = originalFetch
    process.env.DROVR_API_URL = originalUrl
  })

  const call = async (method: string, body?: Record<string, unknown>) => {
    const res = {
      statusCode: 200,
      location: undefined as string | undefined,
      setHeader: jest.fn(),
      status(code: number) {
        this.statusCode = code
        return this
      },
      end: jest.fn(),
      redirect(code: number, location: string) {
        this.statusCode = code
        this.location = location
        return this
      },
    }
    await handler(
      {method, body} as NextApiRequest,
      res as unknown as NextApiResponse,
    )
    return res
  }

  it('refuses anything but POST', async () => {
    expect((await call('GET')).statusCode).toBe(405)
  })

  it('posts the choice to drovr and shows its answer, an invalid token, or a retryable failure', async () => {
    const {calls, fetch} = recordingFetch(
      reply(200, eggheadState({all: {subscribed: false}})),
      reply(400),
      reply(503),
    )
    global.fetch = fetch as unknown as typeof global.fetch

    const done = await call('POST', {t: TOKEN, choice: 'all'})
    const invalid = await call('POST', {t: TOKEN, choice: 'all'})
    const failed = await call('POST', {t: TOKEN, choice: 'course'})

    const t = encodeURIComponent(TOKEN)
    expect(done).toMatchObject({
      statusCode: 303,
      location: `/unsubscribe?t=${t}&updated=all`,
    })
    expect(invalid.location).toBe(`/unsubscribe?t=${t}&error=invalid`)
    expect(failed.location).toBe(
      `/unsubscribe?t=${t}&choice=course&error=unavailable`,
    )
    expect(calls.map((each) => each.url)).toEqual([
      `${BASE_URL}/unsubscribe`,
      `${BASE_URL}/unsubscribe`,
      `${BASE_URL}/unsubscribe`,
    ])
  })

  it('sends nothing to drovr without a valid choice', async () => {
    const {calls, fetch} = recordingFetch()
    global.fetch = fetch as unknown as typeof global.fetch

    const res = await call('POST', {t: TOKEN, choice: 'everything'})

    expect(res.location).toBe(`/unsubscribe?t=${encodeURIComponent(TOKEN)}`)
    expect(calls).toEqual([])
  })
})
