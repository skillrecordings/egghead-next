import {LessonResource} from '@/types'
import {mergeLessonMetadata, deriveDataFromBaseValues} from '../lesson-metadata'

describe('mergeLessonMetadata()', () => {
  test('top-level data from Sanity overrides graphql', () => {
    const graphqlMetadata = {
      title: 'Ultimate React',
      duration: 123,
      slug: 'ultimate-react',
    } as LessonResource
    const sanityMetadata = {
      title: 'Xtreme React',
      path: '/path/to/lesson',
    } as LessonResource

    const expectedResult = {
      collection: undefined,
      instructor: undefined,
      tags: undefined,
      title: 'Xtreme React',
      duration: 123,
      path: '/path/to/lesson',
      slug: 'ultimate-react',
      ogImage:
        'https://og-image-react-egghead.now.sh/lesson/ultimate-react?v=20201027',
    }

    const result = mergeLessonMetadata(graphqlMetadata, sanityMetadata, null)

    expect(result).toEqual(expectedResult)
  })

  test('Sanity tags override graphql tags when present', () => {
    const graphqlMetadata = {
      tags: [{name: 'Vue'}],
      slug: 'test-lesson',
    } as LessonResource

    const sanityMetadata = {
      tags: [{name: 'React'}],
    } as LessonResource

    const expectedResult = {
      collection: undefined,
      instructor: undefined,
      tags: [{name: 'React'}],
      slug: 'test-lesson',
      ogImage:
        'https://og-image-react-egghead.now.sh/lesson/test-lesson?v=20201027',
    }

    const result = mergeLessonMetadata(graphqlMetadata, sanityMetadata, null)

    expect(result).toEqual(expectedResult)
  })

  test('graphql tags override Sanity tags if Sanity tags are not present', () => {
    const graphqlMetadata = {
      tags: [{name: 'Vue'}],
      slug: 'test-lesson',
    } as LessonResource

    const sanityMetadata = {
      tags: [] as Array<{}>,
    } as LessonResource

    const expectedResult = {
      collection: undefined,
      instructor: undefined,
      tags: [{name: 'Vue'}],
      slug: 'test-lesson',
      ogImage:
        'https://og-image-react-egghead.now.sh/lesson/test-lesson?v=20201027',
    }

    const result = mergeLessonMetadata(graphqlMetadata, sanityMetadata, null)

    expect(result).toEqual(expectedResult)
  })

  test('Sanity instructor takes precedence to graphql instructor', () => {
    const graphqlMetadata = {
      instructor: {name: 'Zac Jones'},
      slug: 'test-lesson',
    } as LessonResource

    const sanityMetadata = {
      instructor: {name: 'Ian Jones'},
    } as LessonResource

    const expectedResult = {
      collection: undefined,
      instructor: {name: 'Ian Jones'},
      tags: undefined,
      slug: 'test-lesson',
      ogImage:
        'https://og-image-react-egghead.now.sh/lesson/test-lesson?v=20201027',
    }

    const result = mergeLessonMetadata(graphqlMetadata, sanityMetadata, null)

    expect(result).toEqual(expectedResult)
  })

  test('graphql instructor is used when Sanity instructor is not present', () => {
    const graphqlMetadata = {
      instructor: {name: 'Zac Jones'},
      slug: 'test-lesson',
    } as LessonResource

    const sanityMetadata = {
      instructor: {},
    } as LessonResource

    const expectedResult = {
      collection: undefined,
      instructor: {name: 'Zac Jones'},
      tags: undefined,
      slug: 'test-lesson',
      ogImage:
        'https://og-image-react-egghead.now.sh/lesson/test-lesson?v=20201027',
    }

    const result = mergeLessonMetadata(graphqlMetadata, sanityMetadata, null)

    expect(result).toEqual(expectedResult)
  })

  test('Sanity collection takes precedence to graphql collection', () => {
    const graphqlMetadata = {
      collection: {title: 'Xtreme React Course', lessons: [4, 5, 6]},
      slug: 'test-lesson',
    } as LessonResource

    // a collection needs to include some course metadata and a non-empty list of
    // lessons to be considered present.
    const sanityMetadata = {
      collection: {title: 'Ultimate React Course', lessons: [1, 2, 3]},
    } as LessonResource

    const expectedResult = {
      collection: {title: 'Ultimate React Course', lessons: [1, 2, 3]},
      instructor: undefined,
      tags: undefined,
      slug: 'test-lesson',
      ogImage:
        'https://og-image-react-egghead.now.sh/lesson/test-lesson?v=20201027',
    }

    const result = mergeLessonMetadata(graphqlMetadata, sanityMetadata, null)

    expect(result).toEqual(expectedResult)
  })

  test('graphql collection is used if Sanity collection is not present', () => {
    const graphqlMetadata = {
      collection: {title: 'Xtreme React Course', lessons: [4, 5, 6]},
      slug: 'test-lesson',
    } as LessonResource

    // a collection needs to include some course metadata and a non-empty list of
    // lessons to be considered present.
    const sanityMetadata = {
      collection: {title: 'Ultimate React Course', lessons: [] as Array<{}>},
    } as LessonResource

    const expectedResult = {
      collection: {title: 'Xtreme React Course', lessons: [4, 5, 6]},
      instructor: undefined,
      tags: undefined,
      slug: 'test-lesson',
      ogImage:
        'https://og-image-react-egghead.now.sh/lesson/test-lesson?v=20201027',
    }

    const result = mergeLessonMetadata(graphqlMetadata, sanityMetadata, null)

    expect(result).toEqual(expectedResult)
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
