describe('integration: loadPublicCourseShell (direct PG core + nested playlists)', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = {
      ...originalEnv,
      CLOUDFRONT_IMAGES_DOMAIN: 'images.example.com',
    }
  })

  afterEach(() => {
    process.env = originalEnv
    jest.restoreAllMocks()
  })

  test('returns a PG-backed public course shell without calling legacy GraphQL', async () => {
    const pgQuery = jest
      .fn()
      .mockResolvedValueOnce({
        rows: [
          {
            id: 100,
            slug: 'the-beginner-s-guide-to-react',
            title: 'The Beginner’s Guide to React',
            description: 'React course shell',
            access_state: 'pro',
            visibility_state: 'indexed',
            state: 'published',
            created_at: '2024-01-01T00:00:00.000Z',
            updated_at: '2024-01-02T00:00:00.000Z',
            published_at: '2024-01-03T00:00:00.000Z',
            owner_id: 42,
            owner_full_name: 'Kent C. Dodds',
            owner_avatar_url: 'https://example.com/kent.png',
            instructor_id: 7,
            instructor_full_name: 'Kent C. Dodds',
            instructor_slug: 'kent-c-dodds',
            instructor_avatar_url: 'https://example.com/kent.png',
            instructor_bio_short: 'Teacher of fine JavaScript things',
            instructor_twitter: 'kentcdodds',
            square_cover_file_name: 'course-cover.png',
            average_rating_out_of_5: 4.7,
            rating_count: 12,
            watched_count: 345,
            duration: 999,
            tags: [
              {
                id: 9,
                name: 'react',
                label: 'React',
                http_url: 'https://egghead.io/browse/frameworks/react',
                image_file_name: 'react.png',
              },
            ],
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            row_order: 1,
            tracklistable_type: 'Lesson',
            lesson_id: 11,
            lesson_slug: 'react-lesson-1',
            lesson_title: 'React Lesson One',
            lesson_description: 'One',
            lesson_duration: 61,
            lesson_thumb_url: 'https://example.com/lesson-1.png',
            lesson_created_at: '2024-01-01T00:00:00.000Z',
            lesson_updated_at: '2024-01-02T00:00:00.000Z',
            lesson_published_at: '2024-01-03T00:00:00.000Z',
            lesson_type: 'lesson',
            playlist_id: null,
            playlist_slug: null,
            playlist_title: null,
            playlist_description: null,
            playlist_square_cover_file_name: null,
            playlist_duration: null,
            playlist_lessons: null,
          },
          {
            row_order: 2,
            tracklistable_type: 'Playlist',
            lesson_id: null,
            lesson_slug: null,
            lesson_title: null,
            lesson_description: null,
            lesson_duration: null,
            lesson_thumb_url: null,
            lesson_created_at: null,
            lesson_updated_at: null,
            lesson_published_at: null,
            lesson_type: null,
            playlist_id: 200,
            playlist_slug: 'react-module-2',
            playlist_title: 'React Module Two',
            playlist_description: 'Nested module',
            playlist_square_cover_file_name: 'module-cover.png',
            playlist_duration: 125,
            playlist_lessons: [
              {
                lesson_id: 12,
                lesson_slug: 'react-lesson-2',
                lesson_title: 'React Lesson Two',
                lesson_description: 'Two',
                lesson_duration: 62,
                lesson_thumb_url: 'https://example.com/lesson-2.png',
                lesson_created_at: '2024-01-04T00:00:00.000Z',
                lesson_updated_at: '2024-01-05T00:00:00.000Z',
                lesson_published_at: '2024-01-06T00:00:00.000Z',
                lesson_type: 'lesson',
              },
            ],
          },
        ],
      })

    const request = jest.fn(async () => {
      throw new Error('Legacy GraphQL should not be called when PG succeeds')
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

    jest.doMock('@/lib/load-course-builder-metadata-wrapper', () => ({
      __esModule: true,
      loadCourseBuilderMetadata: jest.fn(async () => null),
      getCourseBuilderLessonStates: jest.fn(async () => new Map()),
      getCourseBuilderCourseLessons: jest.fn(async () => []),
    }))

    jest.doMock('@/lib/sanity-allowlist', () => ({
      __esModule: true,
      sanityAllowlistAllowsCourse: jest.fn(async () => ({
        ready: false,
        allowed: true,
        reason: 'not-configured',
      })),
    }))

    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})
    jest.spyOn(console, 'debug').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})

    const {loadPublicCourseShell} = await import('../playlists')

    const playlist = await loadPublicCourseShell(
      'the-beginner-s-guide-to-react',
    )

    expect(playlist?.slug).toBe('the-beginner-s-guide-to-react')
    expect(playlist?.title).toBe('The Beginner’s Guide to React')
    expect(playlist?.path).toBe('/courses/the-beginner-s-guide-to-react')
    expect(playlist?.owner?.id).toBe(42)
    expect(playlist?.instructor?.slug).toBe('kent-c-dodds')
    expect(playlist?.items).toHaveLength(2)
    expect(playlist?.items?.[0]?.slug).toBe('react-lesson-1')
    expect(playlist?.items?.[1]?.type).toBe('playlist')
    expect(playlist?.items?.[1]?.lessons?.[0]?.slug).toBe('react-lesson-2')
    expect(playlist?.tags?.[0]?.name).toBe('react')
    expect(playlist?.square_cover_480_url).toContain(
      '/playlists/square_covers/000/000/100/square_480/course-cover.png',
    )

    expect(pgQuery).toHaveBeenCalledTimes(2)
    expect(request).not.toHaveBeenCalled()
  })
})
