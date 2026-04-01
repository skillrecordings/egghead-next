import {hasRenderableSections} from './collection-lessons-list'

describe('hasRenderableSections', () => {
  test('returns false for missing sections', () => {
    expect(hasRenderableSections(null)).toBe(false)
    expect(hasRenderableSections({})).toBe(false)
  })

  test('returns false for empty sections arrays', () => {
    expect(hasRenderableSections({sections: []})).toBe(false)
  })

  test('returns true when the course has section entries', () => {
    expect(
      hasRenderableSections({
        sections: [{title: 'Module 1', lessons: [{slug: 'intro-hooks'}]}],
      }),
    ).toBe(true)
  })
})
