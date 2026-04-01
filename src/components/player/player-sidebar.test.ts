import {getCourseToDisplay, normalizeCourseForSidebar} from './player-sidebar'

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

describe('normalizeCourseForSidebar', () => {
  test('filters out null sections and falls back to lessons when none are valid', () => {
    const course = {
      sections: [null, null],
      courseBuilderLessons: [],
      lessons: [],
      items: [
        {type: 'lesson', slug: 'intro-hooks'},
        {type: 'playlist', slug: 'nested-module'},
      ],
    }

    expect(normalizeCourseForSidebar(course)).toEqual({
      ...course,
      sections: [],
      lessons: [{type: 'lesson', slug: 'intro-hooks'}],
    })
  })

  test('keeps valid sections for sectioned courses', () => {
    const course = {
      sections: [
        null,
        {
          title: 'Module 1',
          lessons: [{slug: 'intro-hooks'}],
        },
      ],
      lessons: [{slug: 'flat-lesson'}],
    }

    expect(normalizeCourseForSidebar(course)).toEqual({
      ...course,
      sections: [
        {
          title: 'Module 1',
          lessons: [{slug: 'intro-hooks'}],
        },
      ],
    })
  })
})
