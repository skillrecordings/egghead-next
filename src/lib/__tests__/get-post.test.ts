describe('getPost matching', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = {...originalEnv}
    process.env.COURSE_BUILDER_DATABASE_URL = 'mysql://example'
  })

  afterEach(() => {
    process.env = originalEnv
    jest.restoreAllMocks()
  })

  test('uses exact matching for legacy slugs without a Course Builder id suffix', async () => {
    const execute = jest.fn(async () => [[]] as any)
    const release = jest.fn()
    const getConnection = jest.fn(async () => ({execute, release}))

    jest.doMock('mysql2/promise', () => ({
      __esModule: true,
      createPool: jest.fn(() => ({getConnection})),
    }))

    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})

    const {getPost} = await import('../posts/get-post')

    await expect(
      getPost('build-realtime-and-authenticated-apps-with-firebase-vite'),
    ).resolves.toBeNull()

    expect(execute).toHaveBeenCalledTimes(2)
    for (const call of execute.mock.calls as unknown as Array<
      [string, unknown[]]
    >) {
      const [sql, params] = call
      expect(String(sql)).not.toContain('LIKE')
      expect(params).toEqual([
        'build-realtime-and-authenticated-apps-with-firebase-vite',
        'build-realtime-and-authenticated-apps-with-firebase-vite',
      ])
    }
    expect(release).toHaveBeenCalled()
  })

  test('returns null for stale tip rows instead of throwing validation errors', async () => {
    const tipRow = {
      id: 'post_tip',
      type: 'post',
      fields: {
        title: 'Old Tip',
        postType: 'tip',
        slug: 'old-tip',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const execute = jest
      .fn()
      .mockResolvedValueOnce([[]] as any)
      .mockResolvedValueOnce([[tipRow]] as any)
    const release = jest.fn()
    const getConnection = jest.fn(async () => ({execute, release}))

    jest.doMock('mysql2/promise', () => ({
      __esModule: true,
      createPool: jest.fn(() => ({getConnection})),
    }))

    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})

    const {getPost} = await import('../posts/get-post')

    await expect(getPost('old-tip')).resolves.toBeNull()

    expect(execute).toHaveBeenCalledTimes(2)
    const postSql = String(execute.mock.calls[1][0])
    expect(postSql).toContain('$.postType')
    expect(postSql).not.toContain("'tip'")
    expect(release).toHaveBeenCalled()
  })

  test('normalizes valid Course Builder tip rows with a tilde id suffix', async () => {
    const tipRow = {
      id: 'post_86iwv',
      type: 'post',
      fields: {
        title: 'Profile tasks in an Nx Workspace with Chrome DevTools',
        postType: 'tip',
        slug: 'profile-tasks-in-an-nx-workspace-with-chrome-devtools~86iwv',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const execute = jest
      .fn()
      .mockResolvedValueOnce([[]] as any)
      .mockResolvedValueOnce([[tipRow]] as any)
      .mockResolvedValueOnce([[]] as any)
      .mockResolvedValueOnce([[]] as any)
    const release = jest.fn()
    const getConnection = jest.fn(async () => ({execute, release}))

    jest.doMock('mysql2/promise', () => ({
      __esModule: true,
      createPool: jest.fn(() => ({getConnection})),
    }))

    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})

    const {getPost} = await import('../posts/get-post')

    await expect(
      getPost('profile-tasks-in-an-nx-workspace-with-chrome-devtools~86iwv'),
    ).resolves.toMatchObject({
      post: {
        id: 'post_86iwv',
        fields: {
          postType: 'lesson',
        },
      },
    })

    const postSql = String(execute.mock.calls[1][0])
    expect(postSql).toContain("'tip'")
    expect(release).toHaveBeenCalled()
  })

  test('allows loose matching for Course Builder slugs with a tilde id suffix', async () => {
    const execute = jest.fn(async () => [[]] as any)
    const release = jest.fn()
    const getConnection = jest.fn(async () => ({execute, release}))

    jest.doMock('mysql2/promise', () => ({
      __esModule: true,
      createPool: jest.fn(() => ({getConnection})),
    }))

    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})

    const {getPost} = await import('../posts/get-post')

    await expect(getPost('some-course-builder-post~abc123')).resolves.toBeNull()

    expect(execute).toHaveBeenCalledTimes(2)
    for (const call of execute.mock.calls as unknown as Array<
      [string, unknown[]]
    >) {
      const [sql, params] = call
      expect(String(sql)).toContain('LIKE')
      expect(params).toEqual([
        'some-course-builder-post~abc123',
        'some-course-builder-post~abc123',
        '%abc123',
        '%abc123',
      ])
    }
    expect(release).toHaveBeenCalled()
  })
})
