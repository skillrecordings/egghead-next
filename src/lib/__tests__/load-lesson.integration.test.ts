describe('integration: loadLesson (title correctness)', () => {
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

  test('legacy slug title is not overwritten by unrelated Course Builder records', async () => {
    const execute = jest.fn(async (sql: string) => {
      // If legacy slug ever triggers LIKE matching again, return a bogus record
      // that would overwrite the title. With the gating fix, LIKE should never
      // be used for legacy slugs and this should return no rows.
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
      if (String(query).includes('query getLesson')) {
        return {
          lesson: {
            id: 123,
            completed: false,
            slug: variables.slug,
            title: 'Correct Legacy Lesson Title',
            description: 'Correct legacy description',
            duration: 60,
            free_forever: true,
            path: `/lessons/${variables.slug}`,
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
      throw new Error(`Unexpected GraphQL query in test: ${String(query)}`)
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
    jest.spyOn(console, 'error').mockImplementation(() => {})

    const {loadLesson} = await import('../lessons')

    const legacySlug = 'the-beginner-s-guide-to-react'
    const lesson = await loadLesson(legacySlug)

    expect(lesson.title).toBe('Correct Legacy Lesson Title')
    expect(lesson.slug).toBe(legacySlug)

    // Ensure mysql executed but did not run LIKE-based query for legacy slugs
    expect(execute).toHaveBeenCalledTimes(1)
    const [sql] = execute.mock.calls[0]
    expect(String(sql)).not.toContain('LIKE')
  })
})
