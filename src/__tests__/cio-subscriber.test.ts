import handler from '@/pages/api/cio-subscriber'
import {ACCESS_TOKEN_KEY} from '@/utils/auth'
import {logEvent} from '@/utils/structured-log'

const mockCioGet = jest.fn()
const mockEggGet = jest.fn()
const mockPut = jest.fn()

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
jest.mock('@/utils/tracing-js/dist/src/index', () => ({
  setupHttpTracing: jest.fn(),
}))
jest.mock('@/lib/customer-io', () => ({
  ENCODED_CUSTOMER_IO_TRACKING_API_CREDENTIALS: 'test-credentials',
}))
jest.mock('@/utils/cio/report-cio-api-error', () => ({
  reportCioApiError: jest.fn(),
}))
jest.mock('@/utils/structured-log', () => ({logEvent: jest.fn()}))

const mockedLogEvent = logEvent as jest.MockedFunction<typeof logEvent>

const victim = {
  id: 'victim-cio-id',
  email: 'victim@example.com',
  attributes: {learner_score: 42},
}

const me = {
  id: 'my-contact-id',
  email: 'me@example.com',
  attributes: {learner_score: 7},
}

async function call(cookie?: string) {
  const res: any = {statusCode: 200, headers: {}}
  res.status = jest.fn((code: number) => {
    res.statusCode = code
    return res
  })
  res.json = jest.fn((body: unknown) => {
    res.body = body
    return res
  })
  res.end = jest.fn(() => res)
  res.setHeader = jest.fn((name: string, value: string) => {
    res.headers[name] = value
  })
  await (handler as any)(
    {method: 'GET', headers: cookie ? {cookie} : {}} as any,
    res,
  )
  return res
}

describe('/api/cio-subscriber', () => {
  const originalKey = process.env.CUSTOMER_IO_APPLICATION_API_KEY

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.CUSTOMER_IO_APPLICATION_API_KEY = 'test-app-key'
    mockPut.mockResolvedValue({})
    mockEggGet.mockResolvedValue({
      data: {
        contact_id: me.id,
        email: me.email,
        is_pro: true,
        created_at: 1,
      },
    })
    mockCioGet.mockImplementation((url: string) =>
      Promise.resolve({
        data: {customer: url.includes(me.id) ? me : victim},
      }),
    )
  })

  afterAll(() => {
    process.env.CUSTOMER_IO_APPLICATION_API_KEY = originalKey
  })

  test('cookie-only callers get the id back and nothing else', async () => {
    const res = await call(`cio_id=${victim.id}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({id: victim.id})
    expect(res.body).not.toHaveProperty('email')
    expect(res.body).not.toHaveProperty('attributes')
    expect(mockCioGet).not.toHaveBeenCalled()
    expect(mockEggGet).not.toHaveBeenCalled()
    expect(mockPut).not.toHaveBeenCalled()
  })

  test('the _cioid cookie is also id-only', async () => {
    const res = await call(`_cioid=${victim.id}`)

    expect(res.body).toEqual({id: victim.id})
    expect(mockCioGet).not.toHaveBeenCalled()
  })

  test('the token path returns the logged-in subscriber', async () => {
    const res = await call(`${ACCESS_TOKEN_KEY}=good-token`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual(me)
    expect(mockEggGet).toHaveBeenCalledWith(
      '/api/v1/users/current?minimal=true',
      {headers: {authorization: 'Bearer good-token'}},
    )
    expect(mockCioGet).toHaveBeenCalledTimes(1)
    expect(mockCioGet.mock.calls[0][0]).toBe(`/customers/${me.id}/attributes`)
    expect(res.headers['Set-Cookie']).toContain(`cio_id=${me.id}`)
  })

  test('with both a token and a cookie, the token wins', async () => {
    const res = await call(
      `cio_id=${victim.id}; ${ACCESS_TOKEN_KEY}=good-token`,
    )

    expect(res.body).toEqual(me)
    expect(mockCioGet).toHaveBeenCalledTimes(1)
    expect(mockCioGet.mock.calls[0][0]).toBe(`/customers/${me.id}/attributes`)
    expect(
      mockCioGet.mock.calls.some(([url]) => String(url).includes(victim.id)),
    ).toBe(false)
  })

  test('a failed token lookup with a cookie falls back to id-only', async () => {
    mockEggGet.mockRejectedValue(
      Object.assign(new Error('unauthorized'), {response: {status: 401}}),
    )

    const res = await call(
      `cio_id=${victim.id}; ${ACCESS_TOKEN_KEY}=expired-token`,
    )

    expect(res.body).toEqual({id: victim.id})
    expect(mockCioGet).not.toHaveBeenCalled()
  })

  test('opted-out users get nothing back, even with a cookie', async () => {
    mockEggGet.mockResolvedValue({data: {opted_out: true, contact_id: me.id}})

    const res = await call(
      `cio_id=${victim.id}; ${ACCESS_TOKEN_KEY}=good-token`,
    )

    expect(res.json).not.toHaveBeenCalled()
    expect(res.end).toHaveBeenCalled()
    expect(mockCioGet).not.toHaveBeenCalled()
  })

  test.each([
    ['path traversal', '../../customers/someone-else'],
    ['slash', 'abc/def'],
    ['dots only', '..'],
    ['query injection', 'abc?x=1'],
    ['too long', 'a'.repeat(101)],
    ['whitespace', 'abc def'],
  ])('rejects an invalid cookie id (%s) as anonymous', async (_label, id) => {
    const res = await call(`cio_id=${encodeURIComponent(id)}`)

    expect(res.statusCode).toBe(200)
    expect(res.json).not.toHaveBeenCalled()
    expect(res.end).toHaveBeenCalled()
    expect(mockCioGet).not.toHaveBeenCalled()
    expect(mockPut).not.toHaveBeenCalled()
  })

  test('rejects an invalid contact_id from the token path', async () => {
    mockEggGet.mockResolvedValue({data: {contact_id: '../admin'}})

    const res = await call(`${ACCESS_TOKEN_KEY}=good-token`)

    expect(res.json).not.toHaveBeenCalled()
    expect(mockCioGet).not.toHaveBeenCalled()
    expect(mockPut).not.toHaveBeenCalled()
  })

  test('never logs subscriber emails', async () => {
    await call(`cio_id=${victim.id}; ${ACCESS_TOKEN_KEY}=good-token`)
    await call(`cio_id=${victim.id}`)

    const logged = JSON.stringify(mockedLogEvent.mock.calls)
    expect(logged).not.toContain(me.email)
    expect(logged).not.toContain(victim.email)
  })
})
