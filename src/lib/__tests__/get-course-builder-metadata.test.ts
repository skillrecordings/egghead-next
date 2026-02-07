describe('get-course-builder-metadata query gating', () => {
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

  test('legacy lesson slug uses exact match only (no LIKE)', async () => {
    const execute = jest.fn(async (sql: string, params: any[]) => {
      return [[]] as any
    })
    const release = jest.fn()
    const getConnection = jest.fn(async () => ({execute, release}))

    jest.doMock('mysql2/promise', () => ({
      __esModule: true,
      createPool: jest.fn(() => ({getConnection})),
    }))

    jest.spyOn(console, 'warn').mockImplementation(() => {})
    jest.spyOn(console, 'log').mockImplementation(() => {})

    const {getCourseBuilderLesson} = await import(
      '../get-course-builder-metadata'
    )

    const legacySlug = 'the-beginner-s-guide-to-react'
    const result = await getCourseBuilderLesson(legacySlug)

    expect(result).toBeNull()
    expect(execute).toHaveBeenCalledTimes(1)
    const [sql, params] = execute.mock.calls[0]
    expect(String(sql)).not.toContain('LIKE')
    expect(params).toEqual([legacySlug, legacySlug])
    expect(release).toHaveBeenCalledTimes(1)
  })

  test('course builder lesson slug (~id) can use LIKE matching', async () => {
    const execute = jest.fn(async (sql: string, params: any[]) => {
      return [[]] as any
    })
    const release = jest.fn()
    const getConnection = jest.fn(async () => ({execute, release}))

    jest.doMock('mysql2/promise', () => ({
      __esModule: true,
      createPool: jest.fn(() => ({getConnection})),
    }))

    jest.spyOn(console, 'warn').mockImplementation(() => {})
    jest.spyOn(console, 'log').mockImplementation(() => {})

    const {getCourseBuilderLesson} = await import(
      '../get-course-builder-metadata'
    )

    const cbSlug = 'some-course-title~duu9m'
    const result = await getCourseBuilderLesson(cbSlug)

    expect(result).toBeNull()
    expect(execute).toHaveBeenCalledTimes(1)
    const [sql, params] = execute.mock.calls[0]
    expect(String(sql)).toContain('LIKE')
    expect(params).toEqual([cbSlug, cbSlug, '%duu9m', '%duu9m'])
    expect(release).toHaveBeenCalledTimes(1)
  })

  test('legacy course slug uses exact match only (no LIKE) for course metadata', async () => {
    const execute = jest.fn(async (sql: string, params: any[]) => {
      return [[]] as any
    })
    const release = jest.fn()
    const getConnection = jest.fn(async () => ({execute, release}))

    jest.doMock('mysql2/promise', () => ({
      __esModule: true,
      createPool: jest.fn(() => ({getConnection})),
    }))

    jest.spyOn(console, 'warn').mockImplementation(() => {})
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})

    const {loadCourseBuilderCourseMetadata} = await import(
      '../get-course-builder-metadata'
    )

    const legacyCourseSlug =
      'fundamentals-of-redux-course-from-dan-abramov-bd5cc867'
    const result = await loadCourseBuilderCourseMetadata(legacyCourseSlug)

    expect(result).toBeNull()
    expect(execute).toHaveBeenCalledTimes(1)
    const [sql, params] = execute.mock.calls[0]
    expect(String(sql)).not.toContain('LIKE')
    expect(params).toEqual([legacyCourseSlug, legacyCourseSlug])
    expect(release).toHaveBeenCalledTimes(1)
  })
})
