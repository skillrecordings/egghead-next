describe('integration: loadResourcesForCourse (direct PG ordering + fallback safety)', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = {...originalEnv}
  })

  afterEach(() => {
    process.env = originalEnv
    jest.restoreAllMocks()
  })

  test('returns ordered lessons from direct Postgres for legacy course slugs', async () => {
    const pgQuery = jest.fn(async () => ({
      rows: [
        {
          id: 101,
          slug: 'legacy-lesson-1',
          title: 'Legacy Lesson One Title',
          description: 'one',
          duration: 61,
          thumb_url: 'https://example.com/one.png',
          published_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-02T00:00:00.000Z',
          created_at: '2024-01-01T00:00:00.000Z',
          free_forever: true,
          state: 'published',
          type: 'lesson',
          access_state: 'free',
          parent_row_order: 1,
          child_row_order: 0,
        },
        {
          id: 102,
          slug: 'legacy-lesson-2',
          title: 'Legacy Lesson Two Title',
          description: 'two',
          duration: 62,
          thumb_url: 'https://example.com/two.png',
          published_at: '2024-01-03T00:00:00.000Z',
          updated_at: '2024-01-04T00:00:00.000Z',
          created_at: '2024-01-03T00:00:00.000Z',
          free_forever: false,
          state: 'published',
          type: 'lesson',
          access_state: 'pro',
          parent_row_order: 2,
          child_row_order: 0,
        },
      ],
    }))

    const request = jest.fn(async () => {
      throw new Error('GraphQL fallback should not be called when PG succeeds')
    })

    jest.doMock('@/db', () => ({
      __esModule: true,
      pgQuery,
    }))

    jest.doMock('@/utils/configured-graphql-client', () => ({
      __esModule: true,
      getGraphQLClient: () => ({request}),
    }))

    jest.doMock('@/lib/courses', () => ({
      __esModule: true,
      loadCourseMetadata: jest.fn(async () => null),
    }))

    jest.doMock('@/lib/lessons', () => ({
      __esModule: true,
      loadLesson: jest.fn(async () => {
        throw new Error(
          'loadLesson fallback should not be called when PG succeeds',
        )
      }),
    }))

    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})
    jest.spyOn(console, 'debug').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})

    const {loadResourcesForCourse} = await import('../course-resources')

    const lessons = await loadResourcesForCourse({
      slug: 'the-beginner-s-guide-to-react',
    })

    expect(lessons.map((l) => l.slug)).toEqual([
      'legacy-lesson-1',
      'legacy-lesson-2',
    ])
    expect(lessons.map((l) => l.title)).toEqual([
      'Legacy Lesson One Title',
      'Legacy Lesson Two Title',
    ])
    expect(lessons.map((l) => l.path)).toEqual([
      '/lessons/legacy-lesson-1',
      '/lessons/legacy-lesson-2',
    ])

    expect(pgQuery).toHaveBeenCalledTimes(1)
    expect(request).not.toHaveBeenCalled()
  })
})
