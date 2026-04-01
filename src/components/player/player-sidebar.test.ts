import {getCourseToDisplay} from './player-sidebar'

describe('getCourseToDisplay', () => {
  const initialCourse = {
    slug: 'simplify-react-apps-with-react-hooks',
    lessons: [{slug: 'intro-hooks'}],
  }

  const videoResource = {
    collection: initialCourse,
  } as any

  test('uses initial course lessons before filtered course loads', () => {
    expect(
      getCourseToDisplay({
        collectionIsEmpty: false,
        filteredCourse: null,
        videoResource,
      }),
    ).toEqual(initialCourse)
  })

  test('uses filtered course once it has loaded', () => {
    const filteredCourse = {
      slug: 'simplify-react-apps-with-react-hooks',
      lessons: [{slug: 'published-lesson-only'}],
    }

    expect(
      getCourseToDisplay({
        collectionIsEmpty: false,
        filteredCourse,
        videoResource,
      }),
    ).toEqual(filteredCourse)
  })

  test('returns null for non-collection lessons', () => {
    expect(
      getCourseToDisplay({
        collectionIsEmpty: true,
        filteredCourse: null,
        videoResource: {collection: null} as any,
      }),
    ).toBeNull()
  })
})
