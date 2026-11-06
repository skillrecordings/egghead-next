import {postDrovrSignup} from '@/lib/drovr-signup'
import {verifyShieldShiba} from '@/lib/shield-shiba'

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {'Content-Type': 'application/json'},
  })

const screening = {
  provider: 'shieldshiba' as const,
  verdict: 'good_boy',
  hostname: 'egghead.io',
  verifiedAt: '2026-11-06T12:00:00.000Z',
}

const signup = {
  submissionId: '01JSIGNUPEVENT',
  occurredAt: '2026-11-06T12:00:01.000Z',
  email: 'reader@example.com',
  page: 'https://egghead.io/q/react',
  screening,
}

const drovr = {apiUrl: 'https://drovr.test', apiKey: 'test-key'}

describe('verifyShieldShiba', () => {
  test('a passed check becomes drovr screening evidence', async () => {
    const fetchImpl = jest.fn(async () =>
      jsonResponse(200, {
        success: true,
        verdict: 'good_boy',
        reasons: [],
        email: 'reader@example.com',
        hostname: 'egghead.io',
        created_at: '2026-11-06T12:00:00Z',
      }),
    )

    await expect(
      verifyShieldShiba({
        token: 'widget-token',
        email: 'reader@example.com',
        secret: 'test-secret',
        fetchImpl,
      }),
    ).resolves.toEqual(screening)

    const [, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit]
    expect(JSON.parse(String(init.body))).toEqual({
      secret: 'test-secret',
      token: 'widget-token',
      email: 'reader@example.com',
    })
  })

  test.each([
    ['an invalid token', () => jsonResponse(422, {success: false})],
    [
      'a blocked verdict',
      () =>
        jsonResponse(200, {
          success: false,
          verdict: 'blocked',
          hostname: 'egghead.io',
          created_at: '2026-11-06T12:00:00Z',
        }),
    ],
    [
      'a response without a hostname',
      () =>
        jsonResponse(200, {
          success: true,
          verdict: 'good_boy',
          created_at: '2026-11-06T12:00:00Z',
        }),
    ],
    [
      'an unreachable provider',
      () => {
        throw new TypeError('fetch failed')
      },
    ],
  ])('%s is a failed check', async (_, answer) => {
    await expect(
      verifyShieldShiba({
        token: 'widget-token',
        email: 'reader@example.com',
        secret: 'test-secret',
        fetchImpl: jest.fn(async () => answer()),
      }),
    ).resolves.toBeNull()
  })

  test('without a token or a secret nothing is redeemed', async () => {
    const fetchImpl = jest.fn()

    await expect(
      verifyShieldShiba({
        email: 'reader@example.com',
        secret: 'test-secret',
        fetchImpl,
      }),
    ).resolves.toBeNull()
    await expect(
      verifyShieldShiba({
        token: 'widget-token',
        email: 'reader@example.com',
        secret: '',
        fetchImpl,
      }),
    ).resolves.toBeNull()
    expect(fetchImpl).not.toHaveBeenCalled()
  })
})

describe('postDrovrSignup', () => {
  test('posts the submission to the egghead form with its screening, under the key', async () => {
    const fetchImpl = jest.fn(async () =>
      jsonResponse(200, {status: 'awaiting-confirmation', contactId: 'c-1'}),
    )

    await expect(
      postDrovrSignup(signup, {...drovr, fetchImpl}),
    ).resolves.toEqual({
      kind: 'accepted',
      status: 'awaiting-confirmation',
    })

    const [url, init] = fetchImpl.mock.calls[0] as unknown as [URL, RequestInit]
    expect(String(url)).toBe('https://drovr.test/signups')
    expect(new Headers(init.headers).get('Authorization')).toBe(
      'Bearer test-key',
    )
    expect(JSON.parse(String(init.body))).toEqual({
      tenantId: 'org-egghead',
      formId: 'egghead-signup',
      submissionId: signup.submissionId,
      occurredAt: signup.occurredAt,
      email: signup.email,
      source: {page: signup.page, screening},
    })
  })

  test.each([
    [403, 'urn:drovr:problem:signup-not-enabled'],
    [422, 'urn:drovr:problem:signup-screening-required'],
  ])('a %s refusal is final and names its problem', async (status, type) => {
    await expect(
      postDrovrSignup(signup, {
        ...drovr,
        fetchImpl: jest.fn(async () => jsonResponse(status, {type})),
      }),
    ).resolves.toEqual({kind: 'refused', httpStatus: status, problem: type})
  })

  test.each([
    ['a 503', async () => jsonResponse(503, {type: 'unavailable'})],
    ['a 429', async () => jsonResponse(429, {})],
    [
      'no answer',
      async () => {
        throw new TypeError('fetch failed')
      },
    ],
  ])('%s is retried', async (_, answer) => {
    await expect(
      postDrovrSignup(signup, {...drovr, fetchImpl: jest.fn(answer)}),
    ).resolves.toMatchObject({kind: 'retry'})
  })

  test('without a drovr URL and key it retries instead of dropping the signup', async () => {
    const fetchImpl = jest.fn()

    await expect(
      postDrovrSignup(signup, {apiUrl: '', apiKey: '', fetchImpl}),
    ).resolves.toMatchObject({kind: 'retry'})
    expect(fetchImpl).not.toHaveBeenCalled()
  })
})
