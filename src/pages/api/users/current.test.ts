import {current} from './current'
import fetchEggheadUser from '@/api/egghead/users/from-token'

jest.mock('@/api/egghead/users/from-token', () => ({
  __esModule: true,
  default: jest.fn(),
}))

const mockedFetchEggheadUser = fetchEggheadUser as jest.MockedFunction<
  typeof fetchEggheadUser
>

function createResponse() {
  const headers: Record<string, string> = {}
  const res: any = {
    statusCode: 200,
    body: undefined,
    ended: false,
    setHeader: jest.fn((name: string, value: string) => {
      headers[name] = value
    }),
  }

  res.status = jest.fn((code: number) => {
    res.statusCode = code
    return res
  })
  res.json = jest.fn((payload: unknown) => {
    res.body = payload
    return res
  })
  res.end = jest.fn(() => {
    res.ended = true
    return res
  })

  return {res, headers}
}

describe('/api/users/current', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('degrades invalid upstream auth into 200 null', async () => {
    mockedFetchEggheadUser.mockRejectedValue({
      response: {
        status: 403,
      },
    })

    const {res} = createResponse()
    const req: any = {
      method: 'GET',
      headers: {
        cookie: 'eh_token_2020_11_22=stale-token',
        host: 'egghead.io',
      },
      query: {
        minimal: 'true',
      },
    }

    await current(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(null)
  })

  it('passes the requested minimal flag through to the Rails lookup', async () => {
    mockedFetchEggheadUser.mockResolvedValue({id: 42} as any)

    const {res} = createResponse()
    const req: any = {
      method: 'GET',
      headers: {
        authorization: 'Bearer valid-token',
        host: 'egghead.io',
      },
      query: {
        minimal: 'false',
      },
    }

    await current(req, res)

    expect(mockedFetchEggheadUser).toHaveBeenCalledWith('valid-token', false)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({id: 42})
  })
})
