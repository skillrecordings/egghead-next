import handler from './auth-readback'
import {logEvent} from '@/utils/structured-log'

jest.mock('@/utils/structured-log', () => ({logEvent: jest.fn()}))

const mockedLogEvent = logEvent as jest.MockedFunction<typeof logEvent>

function call(body: unknown, ua = 'Mozilla/5.0 Firefox/131.0') {
  const res: any = {statusCode: 200}
  res.status = jest.fn((code: number) => {
    res.statusCode = code
    return res
  })
  res.end = jest.fn(() => res)
  handler({method: 'POST', body, headers: {'user-agent': ua}} as any, res)
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
})
