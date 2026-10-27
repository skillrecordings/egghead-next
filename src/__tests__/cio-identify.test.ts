import handler from '@/pages/api/cio/identify/[id]'

const mockPut = jest.fn()
const mockGet = jest.fn()

jest.mock('axios', () => {
  const axios = {
    create: jest.fn(() => ({get: (...args: unknown[]) => mockGet(...args)})),
    get: (...args: unknown[]) => mockGet(...args),
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

async function call(id: unknown, body: unknown = {}, method = 'POST') {
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
  await (handler as any)({method, query: {id}, body, headers: {}} as any, res)
  return res
}

describe('/api/cio/identify/[id]', () => {
  const originalKey = process.env.CUSTOMER_IO_APPLICATION_API_KEY

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.CUSTOMER_IO_APPLICATION_API_KEY = 'test-app-key'
    mockPut.mockResolvedValue({})
    mockGet.mockResolvedValue({
      data: {customer: {id: 'x', email: 'leak@example.com', attributes: {}}},
    })
  })

  afterAll(() => {
    process.env.CUSTOMER_IO_APPLICATION_API_KEY = originalKey
  })

  test('writes attributes and returns only the id', async () => {
    const res = await call('someone-id', {unsubscribed: true})

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({id: 'someone-id'})
    expect(mockGet).not.toHaveBeenCalled()
    expect(mockPut).toHaveBeenCalledWith(
      'https://track.customer.io/api/v1/customers/someone-id',
      {unsubscribed: true, _update: true},
      expect.any(Object),
    )
    expect(res.headers['Set-Cookie']).toContain('cio_id=someone-id')
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
      expect(mockGet).not.toHaveBeenCalled()
    },
  )

  test('non-POST requests 404', async () => {
    const res = await call('someone-id', {}, 'GET')

    expect(res.statusCode).toBe(404)
    expect(mockPut).not.toHaveBeenCalled()
  })
})
