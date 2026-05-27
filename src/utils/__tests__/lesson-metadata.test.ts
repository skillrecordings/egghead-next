import {mergeLessonMetadata, deriveDataFromBaseValues} from '../lesson-metadata'

describe('mergeLessonMetadata()', () => {
  test('returns the graphql baseline plus a derived ogImage when no CB overrides', () => {
    const result = mergeLessonMetadata(
      {title: 'Ultimate React', duration: 123, slug: 'ultimate-react'},
      null,
    )

    expect(result).toEqual({
      title: 'Ultimate React',
      duration: 123,
      slug: 'ultimate-react',
      ogImage:
        'https://og-image-react-egghead.now.sh/lesson/ultimate-react?v=20201027',
    })
  })

  test('Course Builder overrides take precedence over graphql for populated fields', () => {
    const result = mergeLessonMetadata(
      {
        title: 'Rails Title',
        description: 'Rails description',
        slug: 'test-lesson',
        repo_url: 'https://rails.example/repo',
      },
      {
        title: 'CB Title',
        description: 'CB description',
        transcript: 'CB transcript',
        repo_url: 'https://cb.example/repo',
        download_url: 'https://cb.example/download',
        ogImage: 'https://cb.example/og.png',
      },
    )

    expect(result.title).toBe('CB Title')
    expect(result.description).toBe('CB description')
    expect(result.transcript).toBe('CB transcript')
    expect(result.repo_url).toBe('https://cb.example/repo')
    expect(result.download_url).toBe('https://cb.example/download')
    expect(result.ogImage).toBe('https://cb.example/og.png')
  })

  test('empty CB fields do not clobber graphql values', () => {
    const result = mergeLessonMetadata(
      {
        title: 'Rails Title',
        description: 'Rails description',
        slug: 'test-lesson',
      },
      {title: '', description: undefined},
    )

    expect(result.title).toBe('Rails Title')
    expect(result.description).toBe('Rails description')
  })

  test('falls back to a Course Builder OG image URL derived from slug when CB is present but no ogImage', () => {
    const previous = process.env.NEXT_PUBLIC_COURSE_BUILDER_DOMAIN
    process.env.NEXT_PUBLIC_COURSE_BUILDER_DOMAIN = 'https://cb.example'
    try {
      const result = mergeLessonMetadata(
        {title: 'Rails Title', slug: 'some-cb-lesson~abc12'},
        {},
      )

      expect(result.ogImage).toMatch(/\/api\/og\?resource=post_/)
    } finally {
      if (previous === undefined) {
        delete process.env.NEXT_PUBLIC_COURSE_BUILDER_DOMAIN
      } else {
        process.env.NEXT_PUBLIC_COURSE_BUILDER_DOMAIN = previous
      }
    }
  })

  test('falls back to legacy OG image URL when CB ogImage and CB domain are both missing', () => {
    const previous = process.env.NEXT_PUBLIC_COURSE_BUILDER_DOMAIN
    delete process.env.NEXT_PUBLIC_COURSE_BUILDER_DOMAIN
    try {
      const result = mergeLessonMetadata(
        {title: 'Rails Title', slug: 'some-cb-lesson~abc12'},
        {},
      )

      expect(result.ogImage).toBe(
        'https://og-image-react-egghead.now.sh/lesson/some-cb-lesson~abc12?v=20201027',
      )
    } finally {
      if (previous !== undefined) {
        process.env.NEXT_PUBLIC_COURSE_BUILDER_DOMAIN = previous
      }
    }
  })
})

describe('deriveDataFromBaseValues()', () => {
  test('it returns an empty object if path is blank', () => {
    expect(deriveDataFromBaseValues({path: undefined})).toEqual({})
  })

  test('it returns URLs when path is set', () => {
    const expectedResult = {
      http_url: expect.stringContaining('/lessons/some-slug'),
      lesson_view_url: expect.stringContaining(
        '/api/v1/lessons/some-slug/views',
      ),
      download_url: expect.stringContaining(
        '/api/v1/lessons/some-slug/signed_download',
      ),
    }

    const result = deriveDataFromBaseValues({path: '/lessons/some-slug'})

    expect(result).toMatchObject(expectedResult)
  })

  test('it throws an error when there is no leading slash', () => {
    expect(() => {
      deriveDataFromBaseValues({path: 'lessons/some-slug'})
    }).toThrow(/Invariant failed/)
  })
})
