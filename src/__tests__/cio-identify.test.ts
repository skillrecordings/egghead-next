import handler from '@/pages/api/cio/identify/[id]'
import {ACCESS_TOKEN_KEY} from '@/utils/auth'
import {logEvent} from '@/utils/structured-log'

const mockPut = jest.fn()
const mockCioGet = jest.fn()
const mockEggGet = jest.fn()

jest.mock('axios', () => {
  const create = jest.fn((config: {baseURL?: string}) =>
    String(config?.baseURL).includes('customer.io')
      ? {get: (...args: unknown[]) => mockCioGet(...args)}
      : {get: (...args: unknown[]) => mockEggGet(...args)},
  )
  const axios = {
    create,
    put: (...args: unknown[]) => mockPut(...args),
  }
  return {__esModule: true, default: axios, ...axios}
})
jest.mock('@/lib/logging', () => ({
  withPagesApiLogging: (handler: unknown) => handler,
}))
jest.mock('@/utils/honeycomb-tracer', () => () => ({}))
jest.mock('@/utils/tracing-js/dist/src', () => ({setupHttpTracing: jest.fn()}))
jest.mock('@/lib/customer-io', () => ({
  ENCODED_CUSTOMER_IO_TRACKING_API_CREDENTIALS: 'test-credentials',
}))
jest.mock('@/inngest/inngest.server', () => ({inngest: {}}))
jest.mock('@/inngest/events/send-slack-message', () => ({
  SEND_SLACK_MESSAGE_EVENT: 'test/slack',
}))
jest.mock('@/utils/cio/report-cio-api-error', () => ({
  reportCioApiError: jest.fn(),
}))
jest.mock('@/utils/structured-log', () => ({logEvent: jest.fn()}))

const mockedLogEvent = logEvent as jest.MockedFunction<typeof logEvent>

async function call(
  id: unknown,
  body: unknown = {},
  {method = 'POST', cookie}: {method?: string; cookie?: string} = {},
) {
  const res: any = {statusCode: 200, headers: {}}
  res.status = jest.fn((code: number) => {
    res.statusCode = code
    return res
  })
  res.json = jest.fn((payload: unknown) => {
    res.body = payload
    return res
  })
  res.end = jest.fn(() => res)
  res.setHeader = jest.fn((name: string, value: string) => {
    res.headers[name] = value
  })
  await (handler as any)(
    {method, query: {id}, body, headers: cookie ? {cookie} : {}} as any,
    res,
  )
  return res
}

function cioHasEmail(email: string) {
  mockCioGet.mockResolvedValue({
    data: {customer: {id: 'someone-id', attributes: {email}}},
  })
}

function putBody() {
  expect(mockPut).toHaveBeenCalledTimes(1)
  return mockPut.mock.calls[0][1]
}

function loggedEvents(event: string) {
  return mockedLogEvent.mock.calls.filter(([, name]) => name === event)
}

describe('/api/cio/identify/[id]', () => {
  const originalKey = process.env.CUSTOMER_IO_APPLICATION_API_KEY

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.CUSTOMER_IO_APPLICATION_API_KEY = 'test-app-key'
    mockPut.mockResolvedValue({})
    cioHasEmail('owner@example.com')
    mockEggGet.mockRejectedValue(new Error('no token'))
  })

  afterAll(() => {
    process.env.CUSTOMER_IO_APPLICATION_API_KEY = originalKey
  })

  test('cookie-only unsubscribe writes and returns only the id', async () => {
    const res = await call('someone-id', {unsubscribed: true})

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({id: 'someone-id'})
    expect(mockPut).toHaveBeenCalledWith(
      'https://track.customer.io/api/v1/customers/someone-id',
      {unsubscribed: true, _update: true},
      expect.any(Object),
    )
    expect(mockCioGet).not.toHaveBeenCalled()
    expect(res.headers['Set-Cookie']).toContain('cio_id=someone-id')
  })

  test('accepts every attribute shape the repo sends', async () => {
    const attributes = {
      unsubscribed_from_newsletter: false,
      theme_preference: 'dark',
      learner_score: 120,
      interested_in_lifetime_since: 1793059200,
      career_chat: 'yes',
      online_presence: 'yes',
      portfolio_foundations: 'yes',
      project_club: 'yes',
      react_interest: 'some-article-slug',
    }

    await call('someone-id', attributes)

    expect(putBody()).toEqual({...attributes, _update: true})
    expect(loggedEvents('cio_identify_attributes_dropped')).toHaveLength(0)
  })

  test('drops unknown keys and logs their names, not values', async () => {
    await call('someone-id', {
      unsubscribed: true,
      pro: true,
      is_admin: 'yes',
      created_at: 1,
    })

    expect(putBody()).toEqual({unsubscribed: true, _update: true})
    const [[level, , data]] = loggedEvents('cio_identify_attributes_dropped')
    expect(level).toBe('warn')
    expect(data).toEqual({
      cio_id: 'someone-id',
      dropped_keys: ['pro', 'is_admin', 'created_at'],
    })
  })

  test.each([
    ['nested object', {theme_preference: {nested: true}}],
    ['array', {career_chat: ['a', 'b']}],
    ['oversized string', {theme_preference: 'x'.repeat(501)}],
    ['non-boolean unsubscribe', {unsubscribed: 'true'}],
    ['learner_score as string', {learner_score: '100'}],
    ['negative learner_score', {learner_score: -1}],
    ['huge learner_score', {learner_score: 100001}],
    ['NaN timestamp', {interested_in_lifetime_since: Number.NaN}],
    ['malformed email', {email: 'not-an-email'}],
    ['bad list key', {'unsubscribed_from_../x': true}],
  ])('drops a malformed value (%s)', async (_label, body) => {
    await call('someone-id', body)

    expect(putBody()).toEqual({_update: true})
    expect(loggedEvents('cio_identify_attributes_dropped')).toHaveLength(1)
  })

  test('ignores a non-object body', async () => {
    await call('someone-id', 'unsubscribed=true')

    expect(putBody()).toEqual({_update: true})
  })

  test('rejects an email that differs from the existing one', async () => {
    cioHasEmail('owner@example.com')

    await call('someone-id', {
      email: 'attacker@example.com',
      career_chat: 'yes',
    })

    expect(putBody()).toEqual({career_chat: 'yes', _update: true})
    const [[, , data]] = loggedEvents('cio_identify_email_rejected')
    expect(data).toEqual({cio_id: 'someone-id', reason: 'differs'})
    expect(JSON.stringify(mockedLogEvent.mock.calls)).not.toContain(
      'attacker@example.com',
    )
  })

  test('accepts an email equal to the existing one, ignoring case', async () => {
    cioHasEmail('Owner@Example.com')

    await call('someone-id', {email: 'owner@example.com'})

    expect(putBody()).toEqual({email: 'owner@example.com', _update: true})
  })

  test('accepts an email when the contact has none yet', async () => {
    cioHasEmail('')

    await call('someone-id', {email: 'new@example.com'})

    expect(putBody()).toEqual({email: 'new@example.com', _update: true})
  })

  test('accepts an email for a contact Customer.io does not know yet', async () => {
    mockCioGet.mockRejectedValue(
      Object.assign(new Error('not found'), {response: {status: 404}}),
    )

    await call('someone-id', {email: 'new@example.com'})

    expect(putBody()).toEqual({email: 'new@example.com', _update: true})
  })

  test('drops the email when the lookup fails', async () => {
    mockCioGet.mockRejectedValue(
      Object.assign(new Error('boom'), {response: {status: 500}}),
    )

    await call('someone-id', {email: 'new@example.com', unsubscribed: true})

    expect(putBody()).toEqual({unsubscribed: true, _update: true})
    const [[, , data]] = loggedEvents('cio_identify_email_rejected')
    expect(data).toEqual({cio_id: 'someone-id', reason: 'lookup_failed'})
  })

  test('a logged-in owner of the contact may change the email', async () => {
    mockEggGet.mockResolvedValue({data: {contact_id: 'someone-id'}})

    await call(
      'someone-id',
      {email: 'changed@example.com'},
      {cookie: `${ACCESS_TOKEN_KEY}=good-token`},
    )

    expect(mockEggGet).toHaveBeenCalledWith(
      '/api/v1/users/current?minimal=true',
      {headers: {authorization: 'Bearer good-token'}},
    )
    expect(mockCioGet).not.toHaveBeenCalled()
    expect(putBody()).toEqual({email: 'changed@example.com', _update: true})
  })

  test("a logged-in user can't change someone else's email", async () => {
    mockEggGet.mockResolvedValue({data: {contact_id: 'my-own-id'}})

    await call(
      'someone-id',
      {email: 'attacker@example.com'},
      {cookie: `${ACCESS_TOKEN_KEY}=good-token`},
    )

    expect(putBody()).toEqual({_update: true})
  })

  test('encodes allowed characters in the path segment', async () => {
    await call('person@example.com')

    expect(mockPut.mock.calls[0][0]).toBe(
      'https://track.customer.io/api/v1/customers/person%40example.com',
    )
  })

  test.each([
    ['path traversal', '../../customers/other'],
    ['dots only', '..'],
    ['query injection', 'abc?x=1'],
    ['too long', 'a'.repeat(101)],
    ['array', ['a', 'b']],
    ['empty', ''],
  ])(
    'rejects an invalid id (%s) without calling Customer.io',
    async (_l, id) => {
      const res = await call(id, {unsubscribed: true})

      expect(res.statusCode).toBe(200)
      expect(res.json).not.toHaveBeenCalled()
      expect(res.setHeader).not.toHaveBeenCalled()
      expect(mockPut).not.toHaveBeenCalled()
      expect(mockCioGet).not.toHaveBeenCalled()
    },
  )

  test('non-POST requests 404', async () => {
    const res = await call('someone-id', {}, {method: 'GET'})

    expect(res.statusCode).toBe(404)
    expect(mockPut).not.toHaveBeenCalled()
  })
})
