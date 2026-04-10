describe('integration: loadPublicCourseShell (Course Builder backed)', () => {
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

  test('returns a Course Builder-backed public course shell without touching legacy GraphQL', async () => {
    const request = jest.fn(async () => {
      throw new Error('Legacy GraphQL should not be called for course shells')
    })

    jest.doMock('@/utils/configured-graphql-client', () => ({
      __esModule: true,
      getGraphQLClient: () => ({request}),
    }))

    jest.doMock('@/lib/load-course-builder-metadata-wrapper', () => ({
      __esModule: true,
      loadCourseBuilderMetadata: jest.fn(async () => ({
        id: 'course_123',
        type: 'post',
        createdById: 'user_1',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
        deletedAt: null,
        currentVersionId: null,
        organizationId: null,
        createdByOrganizationMembershipId: null,
        name: 'Kent C. Dodds',
        image: 'https://example.com/kent.png',
        fields: {
          title: 'The Beginner’s Guide to React',
          slug: 'the-beginner-s-guide-to-react',
          postType: 'course',
          body: 'Course Builder body',
          description: 'Course Builder description',
          state: 'published',
          visibility: 'public',
          access: 'pro',
          eggheadPlaylistId: 100,
          image: 'https://example.com/course-cover.png',
          ogImage: 'https://example.com/og-course.png',
        },
      })),
      getCourseBuilderLessonStates: jest.fn(async () => new Map()),
      getCourseBuilderCourseLessons: jest.fn(async () => [
        {
          title: 'React Lesson One',
          slug: 'react-lesson-1',
          type: 'lesson',
          path: '/lessons/react-lesson-1',
          duration: 61,
          state: 'published',
        },
        {
          title: 'React Lesson Two',
          slug: 'react-lesson-2',
          type: 'lesson',
          path: '/lessons/react-lesson-2',
          duration: 62,
          state: 'published',
        },
      ]),
      getAllCourseBuilderPublicCourseSlugs: jest.fn(async () => [
        'the-beginner-s-guide-to-react',
      ]),
    }))

    jest.doMock('@/lib/courses', () => ({
      __esModule: true,
      loadCourseMetadata: jest.fn(async () => ({
        title: 'The Beginner’s Guide to React',
        description: 'Sanity description',
        square_cover_480_url: 'https://example.com/course-cover.png',
        thumb_url: 'https://example.com/course-thumb.png',
        tags: [
          {
            name: 'react',
            label: 'React',
            image_url: 'https://example.com/react.png',
          },
        ],
        instructor: {
          full_name: 'Kent C. Dodds',
          slug: 'kent-c-dodds',
          avatar_url: 'https://example.com/kent.png',
          avatar_64_url: 'https://example.com/kent.png',
          bio_short: 'Teacher of fine JavaScript things',
          twitter: 'kentcdodds',
        },
        sections: [],
      })),
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

    expect(playlist).toMatchObject({
      slug: 'the-beginner-s-guide-to-react',
      title: 'The Beginner’s Guide to React',
      path: '/courses/the-beginner-s-guide-to-react',
      description: 'Course Builder body',
      access_state: 'pro',
      visibility_state: 'public',
      state: 'published',
      duration: 123,
      square_cover_480_url: 'https://example.com/course-cover.png',
      image_thumb_url: 'https://example.com/course-cover.png',
      instructor: {
        full_name: 'Kent C. Dodds',
      },
      courseBuilderLessons: [
        expect.objectContaining({slug: 'react-lesson-1'}),
        expect.objectContaining({slug: 'react-lesson-2'}),
      ],
    })
    expect(playlist?.items).toHaveLength(2)
    expect(playlist?.items?.[0]).toMatchObject({
      slug: 'react-lesson-1',
      path: '/lessons/react-lesson-1',
    })
    expect(request).not.toHaveBeenCalled()
  })

  test('returns a legacy migrated Course Builder course shell using legacy playlist fields', async () => {
    jest.doMock('@/utils/configured-graphql-client', () => ({
      __esModule: true,
      getGraphQLClient: () => ({request: jest.fn()}),
    }))

    jest.doMock('@/lib/load-course-builder-metadata-wrapper', () => ({
      __esModule: true,
      loadCourseBuilderMetadata: jest.fn(async () => ({
        id: 'legacy_course_123',
        type: 'course',
        createdById: 'system_user',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
        fields: {
          title: 'Legacy React Course',
          slug: 'legacy-react-course',
          description: 'Migrated from Rails',
          state: 'published',
          visibility: 'pro',
          legacyRailsPlaylistId: 482799,
          image: 'legacy-react-cover.png',
        },
      })),
      getCourseBuilderLessonStates: jest.fn(async () => null),
      getCourseBuilderCourseLessons: jest.fn(async () => [
        {
          title: 'Legacy Lesson One',
          slug: 'legacy-lesson-1',
          type: 'lesson',
          path: '/lessons/legacy-lesson-1',
          duration: 90,
          state: 'published',
        },
      ]),
      getAllCourseBuilderPublicCourseSlugs: jest.fn(async () => [
        'legacy-react-course',
      ]),
    }))

    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})
    jest.spyOn(console, 'debug').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})

    const {loadPublicCourseShell} = await import('../playlists')

    const playlist = await loadPublicCourseShell('legacy-react-course')

    expect(playlist).toMatchObject({
      slug: 'legacy-react-course',
      title: 'Legacy React Course',
      description: 'Migrated from Rails',
      access_state: 'pro',
      visibility_state: 'pro',
      state: 'published',
      duration: 90,
      square_cover_480_url:
        'https://images.example.com/playlists/square_covers/000/482/799/square_480/legacy-react-cover.png',
      image_thumb_url:
        'https://images.example.com/playlists/square_covers/000/482/799/thumb/legacy-react-cover.png',
      instructor: null,
      courseBuilderLessons: [
        expect.objectContaining({slug: 'legacy-lesson-1'}),
      ],
    })
  })

  test('returns null when Course Builder has no matching public course', async () => {
    jest.doMock('@/utils/configured-graphql-client', () => ({
      __esModule: true,
      getGraphQLClient: () => ({request: jest.fn()}),
    }))

    jest.doMock('@/lib/load-course-builder-metadata-wrapper', () => ({
      __esModule: true,
      loadCourseBuilderMetadata: jest.fn(async () => null),
      getCourseBuilderLessonStates: jest.fn(async () => null),
      getCourseBuilderCourseLessons: jest.fn(async () => null),
      getAllCourseBuilderPublicCourseSlugs: jest.fn(async () => []),
    }))

    jest.doMock('@/lib/courses', () => ({
      __esModule: true,
      loadCourseMetadata: jest.fn(async () => null),
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

    await expect(
      loadPublicCourseShell('missing-course-slug'),
    ).resolves.toBeNull()
  })

  test('fails soft to anonymous course bits when an implicit token gets a 401', async () => {
    jest.doMock('@/utils/get-access-token-from-cookie', () => ({
      __esModule: true,
      default: jest.fn(() => 'stale-cookie-token'),
    }))

    jest.doMock('@/utils/configured-graphql-client', () => ({
      __esModule: true,
      getGraphQLClient: jest.fn(() => ({
        request: jest.fn(async () => {
          const error = new Error('Unauthorized') as Error & {
            response?: {status: number}
          }
          error.response = {status: 401}
          throw error
        }),
      })),
    }))

    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})
    jest.spyOn(console, 'debug').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})

    const {loadAuthedCourseBits} = await import('../playlists')

    await expect(
      loadAuthedCourseBits('the-beginner-s-guide-to-react'),
    ).resolves.toBeNull()
  })
})
