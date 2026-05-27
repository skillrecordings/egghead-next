describe('sanity allowlist refresh', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.restoreAllMocks()
  })

  test('refreshes to an empty lesson allowlist without renaming a missing temp key', async () => {
    const redis = {
      get: jest.fn(async () => null),
      del: jest.fn(async () => 1),
      sadd: jest.fn(async () => 1),
      rename: jest.fn(async () => 'OK'),
      set: jest.fn(async () => 'OK'),
    }

    jest.doMock('@/lib/upstash-redis', () => ({
      __esModule: true,
      getRedis: jest.fn(() => redis),
    }))

    jest.doMock('@/utils/sanity-client', () => ({
      __esModule: true,
      sanityClient: {fetch: jest.fn(async () => [])},
    }))

    const {refreshAllowlistIfStale} = await import('../sanity-allowlist')

    await expect(
      refreshAllowlistIfStale('lesson', {}, 0),
    ).resolves.toMatchObject({
      ok: true,
      kind: 'lesson',
      refreshed: true,
      count: 0,
    })

    expect(redis.sadd).not.toHaveBeenCalled()
    expect(redis.rename).not.toHaveBeenCalled()
    expect(redis.del).toHaveBeenCalledWith('sanity:allowlist:lesson:slugs')
    expect(redis.set).toHaveBeenCalledWith(
      'sanity:allowlist:lesson:meta',
      expect.objectContaining({kind: 'lesson', count: 0}),
    )
  })
})
