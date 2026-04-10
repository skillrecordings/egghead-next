describe('integration: loadResourcesForCourse (Course Builder backed)', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = {...originalEnv}
  })

  afterEach(() => {
    process.env = originalEnv
    jest.restoreAllMocks()
  })

  test('returns ordered lessons from Course Builder for a course slug', async () => {
    jest.doMock('@/lib/courses', () => ({
      __esModule: true,
      loadCourseMetadata: jest.fn(async () => null),
    }))

    jest.doMock('@/lib/lessons', () => ({
      __esModule: true,
      loadLesson: jest.fn(async () => null),
    }))

    jest.doMock('@/lib/load-course-builder-metadata-wrapper', () => ({
      __esModule: true,
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
    }))

    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})
    jest.spyOn(console, 'debug').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})

    const {loadResourcesForCourse} = await import('../course-resources')

    const lessons = await loadResourcesForCourse({
      slug: 'the-beginner-s-guide-to-react',
    })

    expect(lessons).toEqual([
      expect.objectContaining({
        id: 'react-lesson-1',
        slug: 'react-lesson-1',
        title: 'React Lesson One',
        path: '/lessons/react-lesson-1',
        duration: 61,
      }),
      expect.objectContaining({
        id: 'react-lesson-2',
        slug: 'react-lesson-2',
        title: 'React Lesson Two',
        path: '/lessons/react-lesson-2',
        duration: 62,
      }),
    ])
  })

  test('returns an empty list when Course Builder has no published lessons for the course', async () => {
    jest.doMock('@/lib/courses', () => ({
      __esModule: true,
      loadCourseMetadata: jest.fn(async () => null),
    }))

    jest.doMock('@/lib/lessons', () => ({
      __esModule: true,
      loadLesson: jest.fn(async () => null),
    }))

    jest.doMock('@/lib/load-course-builder-metadata-wrapper', () => ({
      __esModule: true,
      getCourseBuilderCourseLessons: jest.fn(async () => null),
    }))

    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})
    jest.spyOn(console, 'debug').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})

    const {loadResourcesForCourse} = await import('../course-resources')

    await expect(
      loadResourcesForCourse({slug: 'empty-course'}),
    ).resolves.toEqual([])
  })
})
