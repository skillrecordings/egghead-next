import handler from '@/pages/api/topic'
import {ACCESS_TOKEN_KEY} from '@/utils/auth'

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
jest.mock('@/utils/tracing-js/dist/src/index', () => ({
  setupHttpTracing: jest.fn(),
}))
jest.mock('@/lib/customer-io', () => ({
  ENCODED_CUSTOMER_IO_TRACKING_API_CREDENTIALS: 'test-credentials',
}))
jest.mock('@/utils/structured-log', () => ({logEvent: jest.fn()}))

const customer = {
  id: 'someone-id',
  email: 'someone@example.com',
  attributes: {react_score: 3, learner_score: 10},
}

async function call(body: unknown, cookie?: string, method = 'POST') {
  const res: any = {statusCode: 200}
  res.status = jest.fn((code: number) => {
    res.statusCode = code
    return res
  })
  res.json = jest.fn(() => res)
  res.send = jest.fn(() => res)
  res.end = jest.fn(() => res)
  await (handler as any)(
    {method, body, headers: cookie ? {cookie} : {}} as any,
    res,
  )
  return res
}

describe('/api/topic', () => {
  const originalKey = process.env.CUSTOMER_IO_APPLICATION_API_KEY

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.CUSTOMER_IO_APPLICATION_API_KEY = 'test-app-key'
    mockPut.mockResolvedValue({})
    mockCioGet.mockResolvedValue({data: {customer}})
    mockEggGet.mockResolvedValue({
      data: {contact_id: 'someone-id', email: 'someone@example.com'},
    })
  })

  afterAll(() => {
    process.env.CUSTOMER_IO_APPLICATION_API_KEY = originalKey
  })

  test('increments scores and returns no customer data', async () => {
    const res = await call({topic: 'react', amount: 2}, 'cio_id=someone-id')

    expect(res.statusCode).toBe(200)
    expect(res.json).not.toHaveBeenCalled()
    expect(res.send).not.toHaveBeenCalled()
    expect(res.end).toHaveBeenCalledWith()
    expect(mockCioGet.mock.calls[0][0]).toBe('/customers/someone-id/attributes')
    expect(mockPut).toHaveBeenCalledWith(
      'https://track.customer.io/api/v1/customers/someone-id',
      {react_score: 5, learner_score: 12},
      expect.any(Object),
    )
  })

  test('token path encodes the contact id', async () => {
    mockEggGet.mockResolvedValue({data: {contact_id: 'person@example.com'}})
    mockCioGet.mockResolvedValue({
      data: {customer: {...customer, id: 'person@example.com'}},
    })

    await call({topic: 'react'}, `${ACCESS_TOKEN_KEY}=good-token`)

    expect(mockCioGet.mock.calls[0][0]).toBe(
      '/customers/person%40example.com/attributes',
    )
    expect(mockPut.mock.calls.map(([url]) => url)).toEqual([
      'https://track.customer.io/api/v1/customers/person%40example.com',
      'https://track.customer.io/api/v1/customers/person%40example.com',
    ])
  })

  test('an invalid cookie id is treated as anonymous', async () => {
    mockEggGet.mockRejectedValue(new Error('unauthorized'))

    await call({topic: 'react'}, 'cio_id=../../customers/other')

    expect(mockCioGet).not.toHaveBeenCalled()
    expect(mockPut).not.toHaveBeenCalled()
  })

  test('an invalid contact_id from the token path is rejected', async () => {
    mockEggGet.mockResolvedValue({data: {contact_id: '../admin'}})

    await call({topic: 'react'}, `${ACCESS_TOKEN_KEY}=good-token`)

    expect(mockCioGet).not.toHaveBeenCalled()
    expect(mockPut).not.toHaveBeenCalled()
  })

  test.each([
    ['attribute-key topic', {topic: 'react_score": 1, "x'}],
    ['object topic', {topic: {a: 1}}],
    ['huge amount', {topic: 'react', amount: 1e9}],
    ['negative amount', {topic: 'react', amount: -5}],
    ['NaN amount', {topic: 'react', amount: 'lots'}],
  ])('skips invalid input (%s)', async (_label, body) => {
    await call(body, 'cio_id=someone-id')

    expect(mockCioGet).not.toHaveBeenCalled()
    expect(mockPut).not.toHaveBeenCalled()
  })

  test('non-POST requests 404', async () => {
    const res = await call({topic: 'react'}, 'cio_id=someone-id', 'GET')

    expect(res.statusCode).toBe(404)
  })
})
