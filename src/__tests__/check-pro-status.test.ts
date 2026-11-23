import axios from 'axios'
import {NextApiRequest, NextApiResponse} from 'next'
import {checkProStatus} from '@/pages/api/users/check-pro-status'

jest.mock('axios', () => ({
  __esModule: true,
  default: {get: jest.fn(), create: jest.fn()},
}))
jest.mock('@/lib/logging', () => ({
  withPagesApiLogging: (handler: unknown) => handler,
}))
jest.mock('@/utils/structured-log', () => ({logEvent: jest.fn()}))

const get = axios.get as jest.MockedFunction<typeof axios.get>

function request({
  body = {email: 'known-pro@example.com'},
  headers = {},
  method = 'POST',
}: {
  body?: unknown
  headers?: NextApiRequest['headers']
  method?: string
} = {}) {
  // SAFETY: the handler only reads method, headers and body from this fixture.
  return {method, headers, body} as NextApiRequest
}

function response() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
    setHeader: jest.fn(),
  }
  // SAFETY: these are the only response methods used by the handler.
  return {res: res as unknown as NextApiResponse, mocks: res}
}

async function expectStatus(req: NextApiRequest, hasProAccess: boolean) {
  const {res, mocks} = response()
  await checkProStatus(req, res)
  expect(mocks.status).toHaveBeenCalledWith(200)
  expect(mocks.json).toHaveBeenCalledWith({hasProAccess})
  expect(mocks.setHeader).toHaveBeenCalledWith(
    'Cache-Control',
    'private, no-store',
  )
}

beforeEach(() => jest.clearAllMocks())

describe('/api/users/check-pro-status', () => {
  it.each([
    {email: 'known-pro@example.com'},
    {email: 'non-member@example.com'},
    {email: 'instructor@example.com'},
    {email: 'not an email'},
    {},
    null,
  ])(
    'returns the same anonymous response for body %j without contacting Rails',
    async (body) => {
      get.mockResolvedValue({data: {is_pro: true}})
      await expectStatus(request({body}), false)
      expect(get).not.toHaveBeenCalled()
    },
  )

  it('checks only the signed-in viewer using their cookie, ignoring another email', async () => {
    get.mockResolvedValue({data: {is_pro: true}})
    await expectStatus(
      request({headers: {cookie: 'eh_token_2020_11_22=viewer-token'}}),
      true,
    )
    expect(get).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/v1\/users\/current$/),
      {headers: {Authorization: 'Bearer viewer-token'}, timeout: 5000},
    )
    expect(get).toHaveBeenCalledTimes(1)
  })

  it('accepts a viewer bearer token and recognizes instructors', async () => {
    get.mockResolvedValue({data: {is_pro: false, is_instructor: true}})
    await expectStatus(
      request({headers: {authorization: 'Bearer viewer-token'}}),
      true,
    )
    expect(get).toHaveBeenCalledWith(expect.any(String), {
      headers: {Authorization: 'Bearer viewer-token'},
      timeout: 5000,
    })
  })

  it('does not grant access based on the submitted email to a non-pro viewer', async () => {
    get.mockResolvedValue({data: {is_pro: false, is_instructor: false}})
    await expectStatus(
      request({headers: {authorization: 'Bearer free-viewer'}}),
      false,
    )
  })

  it.each([
    {response: {status: 404}},
    {response: {status: 401}},
    {response: {status: 403}},
    {response: {status: 500}},
    {code: 'ECONNABORTED'},
    new Error('network failure'),
  ])('returns the fixed response for upstream failure %j', async (error) => {
    get.mockRejectedValue(error)
    await expectStatus(
      request({headers: {authorization: 'Bearer viewer-token'}}),
      false,
    )
  })

  it.each([null, {}, 'unexpected', {is_pro: 'true'}, {is_instructor: 1}])(
    'fails closed on malformed upstream data %j',
    async (data) => {
      get.mockResolvedValue({data})
      await expectStatus(
        request({headers: {authorization: 'Bearer viewer-token'}}),
        false,
      )
    },
  )

  it('ignores non-bearer authorization', async () => {
    await expectStatus(
      request({headers: {authorization: 'Basic credentials'}}),
      false,
    )
    expect(get).not.toHaveBeenCalled()
  })

  it('keeps the non-POST method contract without an upstream request', async () => {
    const {res, mocks} = response()
    await checkProStatus(request({method: 'GET'}), res)
    expect(mocks.status).toHaveBeenCalledWith(404)
    expect(mocks.end).toHaveBeenCalled()
    expect(get).not.toHaveBeenCalled()
  })
})
