import {
  hasRenderableSections,
  isRenderableLesson,
  normalizeRenderableLessons,
  normalizeRenderableSections,
} from './collection-lessons-list'

describe('isRenderableLesson', () => {
  test('requires both slug and path', () => {
    expect(
      isRenderableLesson({slug: 'intro-hooks', path: '/lessons/intro'}),
    ).toBe(true)
    expect(isRenderableLesson({slug: 'intro-hooks', path: null})).toBe(false)
    expect(isRenderableLesson({slug: null, path: '/lessons/intro'})).toBe(false)
  })
})

describe('normalizeRenderableLessons', () => {
  test('drops invalid lessons and dedupes by slug', () => {
    expect(
      normalizeRenderableLessons([
        {slug: 'intro-hooks', path: '/lessons/intro-hooks'},
        {slug: 'intro-hooks', path: '/lessons/intro-hooks'},
        {slug: 'missing-path', path: null},
      ] as any),
    ).toEqual([{slug: 'intro-hooks', path: '/lessons/intro-hooks'}])
  })
})

describe('normalizeRenderableSections', () => {
  test('drops sections whose lessons are invalid', () => {
    expect(
      normalizeRenderableSections([
        {
          title: 'Bad section',
          lessons: [{slug: null, path: null}],
        },
        {
          title: 'Good section',
          lessons: [{slug: 'intro-hooks', path: '/lessons/intro-hooks'}],
        },
      ] as any),
    ).toEqual([
      {
        title: 'Good section',
        lessons: [{slug: 'intro-hooks', path: '/lessons/intro-hooks'}],
      },
    ])
  })
})

describe('hasRenderableSections', () => {
  test('returns false for missing sections', () => {
    expect(hasRenderableSections(null)).toBe(false)
    expect(hasRenderableSections({})).toBe(false)
  })

  test('returns false for empty sections arrays', () => {
    expect(hasRenderableSections({sections: []})).toBe(false)
  })

  test('returns false when sections only contain invalid lessons', () => {
    expect(
      hasRenderableSections({
        sections: [{title: 'Broken', lessons: [{slug: null, path: null}]}],
      }),
    ).toBe(false)
  })

  test('returns true when the course has section entries', () => {
    expect(
      hasRenderableSections({
        sections: [
          {
            title: 'Module 1',
            lessons: [{slug: 'intro-hooks', path: '/lessons/intro-hooks'}],
          },
        ],
      }),
    ).toBe(true)
  })
})
