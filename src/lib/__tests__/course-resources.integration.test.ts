describe('integration: loadResourcesForCourse (ordering + title correctness)', () => {
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

  test('returns ordered lessons with correct titles for legacy course slugs', async () => {
    const execute = jest.fn(async (sql: string) => {
      // As above: only return bogus data if LIKE is used (should not happen)
      if (String(sql).includes('LIKE')) {
        return [
          [
            {
              id: 'post_zzzzz',
              type: 'post',
              fields: JSON.stringify({
                slug: 'unrelated-course-builder-post~zzzzz',
                title: 'WRONG TITLE FROM COURSE BUILDER',
                body: 'wrong',
              }),
              video_fields: null,
            },
          ],
        ] as any
      }
      return [[]] as any
    })

    const release = jest.fn()
    const getConnection = jest.fn(async () => ({execute, release}))

    jest.doMock('mysql2/promise', () => ({
      __esModule: true,
      createPool: jest.fn(() => ({getConnection})),
    }))

    const request = jest.fn(async (query: string, variables: any) => {
      const q = String(query)
      if (q.includes('query getPlaylistLessonSlugs')) {
        return {
          playlist: {
            id: 999,
            slug: variables.slug,
            items: [
              {
                __typename: 'Lesson',
                slug: 'legacy-lesson-1',
                path: '/lessons/legacy-lesson-1',
              },
              {
                __typename: 'Lesson',
                slug: 'legacy-lesson-2',
                path: '/lessons/legacy-lesson-2',
              },
            ],
          },
        }
      }

      if (q.includes('query getLesson')) {
        const slug = variables.slug
        return {
          lesson: {
            id: 123,
            completed: false,
            slug,
            title:
              slug === 'legacy-lesson-1'
                ? 'Legacy Lesson One Title'
                : 'Legacy Lesson Two Title',
            description: '',
            duration: 60,
            free_forever: true,
            path: `/lessons/${slug}`,
            transcript: null,
            transcript_url: null,
            subtitles_url: null,
            hls_url: null,
            dash_url: null,
            http_url: null,
            lesson_view_url: null,
            thumb_url: null,
            icon_url: null,
            download_url: null,
            staff_notes_url: null,
            state: 'published',
            repo_url: null,
            code_url: null,
            primary_tag: {
              name: 'react',
              label: 'React',
              http_url: '',
              image_url: '',
            },
            created_at: null,
            updated_at: null,
            published_at: null,
            collection: null,
            tags: [],
            instructor: {
              full_name: 'Someone',
              avatar_64_url: '',
              slug: 'someone',
              twitter: '',
            },
          },
        }
      }

      throw new Error(`Unexpected GraphQL query in test: ${q}`)
    })

    jest.doMock('@/utils/configured-graphql-client', () => ({
      __esModule: true,
      getGraphQLClient: () => ({request}),
    }))

    jest.doMock('@/utils/sanity-client', () => ({
      __esModule: true,
      sanityClient: {fetch: jest.fn(async () => ({}))},
    }))

    jest.doMock('@/lib/lesson-comments', () => ({
      __esModule: true,
      loadLessonComments: jest.fn(async () => []),
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

    // Two lessons loaded => two Course Builder lookups, neither should use LIKE
    expect(execute).toHaveBeenCalledTimes(2)
    for (const call of execute.mock.calls) {
      expect(String(call[0])).not.toContain('LIKE')
    }
  })
})
