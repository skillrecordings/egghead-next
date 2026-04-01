import {withTimeout} from '../with-timeout'

describe('withTimeout', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  test('clears the timeout when the wrapped promise resolves first', async () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')

    const promise = withTimeout(Promise.resolve('ok'), 5000, () => {
      return new Error('timed out')
    })

    await expect(promise).resolves.toBe('ok')
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(5000)
  })

  test('rejects with the timeout error when the deadline wins', async () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')

    const promise = withTimeout(
      new Promise<string>(() => {
        // never resolves
      }),
      5000,
      () => new Error('timed out'),
    )

    jest.advanceTimersByTime(5000)

    await expect(promise).rejects.toThrow('timed out')
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1)
  })
})
