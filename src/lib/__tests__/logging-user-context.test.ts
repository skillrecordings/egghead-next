import {extractUserContext} from '../logging'

const TEST_TOKEN = 'test-token-not-real'

describe('extractUserContext', () => {
  test('sees a Bearer header even when unrelated cookies are present', () => {
    expect(
      extractUserContext(
        'ajs_anonymous_id=abc; theme=dark',
        `Bearer ${TEST_TOKEN}`,
      ),
    ).toEqual({user_id: null, has_token: true})
  })

  test('recognises the egghead_token cookie', () => {
    expect(extractUserContext(`egghead_token=${TEST_TOKEN}`)).toEqual({
      user_id: null,
      has_token: true,
    })
  })

  test('recognises eh_token_2020_11_22 and reads user_id from eh_user', () => {
    const user = encodeURIComponent(JSON.stringify({id: 42}))
    expect(
      extractUserContext(`eh_token_2020_11_22=${TEST_TOKEN}; eh_user=${user}`),
    ).toEqual({user_id: 42, has_token: true})
  })

  test('no token anywhere', () => {
    expect(extractUserContext('theme=dark', null)).toEqual({
      user_id: null,
      has_token: false,
    })
    expect(extractUserContext(undefined, 'Basic abc')).toEqual({
      user_id: null,
      has_token: false,
    })
    expect(extractUserContext(undefined, 'Bearer   ')).toEqual({
      user_id: null,
      has_token: false,
    })
  })

  test('never puts the token in its result', () => {
    const ctx = extractUserContext(
      `egghead_token=${TEST_TOKEN}`,
      `Bearer ${TEST_TOKEN}`,
    )
    expect(JSON.stringify(ctx)).not.toContain(TEST_TOKEN)
  })
})
