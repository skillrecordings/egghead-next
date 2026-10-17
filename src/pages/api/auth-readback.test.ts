import handler from './auth-readback'
import {logEvent} from '@/utils/structured-log'

jest.mock('@/utils/structured-log', () => ({logEvent: jest.fn()}))

const mockedLogEvent = logEvent as jest.MockedFunction<typeof logEvent>

function call(
  body: unknown,
  ua = 'Mozilla/5.0 Firefox/131.0',
  extra: Record<string, string> = {},
) {
  const res: any = {statusCode: 200}
  res.status = jest.fn((code: number) => {
    res.statusCode = code
    return res
  })
  res.end = jest.fn(() => res)
  handler(
    {method: 'POST', body, headers: {'user-agent': ua, ...extra}} as any,
    res,
  )
  return res
}

const valid = {
  step: 'cleared',
  cookieReadOk: false,
  localStorageOk: false,
  fromRedirect: true,
}

describe('/api/auth-readback', () => {
  beforeEach(() => jest.clearAllMocks())

  test('logs only allowlisted fields plus a browser family', () => {
    const res = call(JSON.stringify({...valid, token: 'secret', email: 'x'}))

    expect(res.statusCode).toBe(204)
    expect(mockedLogEvent).toHaveBeenCalledWith(
      'warn',
      'auth.session.cookie_readback',
      {...valid, browserFamily: 'firefox'},
    )
  })

  test('rejects unknown steps and non-boolean fields without logging', () => {
    expect(call({...valid, step: 'token=abc'}).statusCode).toBe(400)
    expect(call({...valid, cookieReadOk: 'yes'}).statusCode).toBe(400)
    expect(call('not json').statusCode).toBe(400)
    expect(mockedLogEvent).not.toHaveBeenCalled()
  })

  test('ignores cross-site posts', () => {
    const res = call(valid, undefined, {'sec-fetch-site': 'cross-site'})

    expect(res.statusCode).toBe(204)
    expect(mockedLogEvent).not.toHaveBeenCalled()
  })

  test('logs a healthy set at info and maps iOS browsers to safari', () => {
    const ios = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0) CriOS/130.0'
    call({...valid, step: 'set', cookieReadOk: true}, ios)

    expect(mockedLogEvent).toHaveBeenCalledWith(
      'info',
      'auth.session.cookie_readback',
      expect.objectContaining({step: 'set', browserFamily: 'safari'}),
    )
  })
})
