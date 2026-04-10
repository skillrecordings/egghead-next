import {isWatchLaterCourseSlug} from '../course-slugs'

describe('isWatchLaterCourseSlug', () => {
  test('matches watch later playlist slugs', () => {
    expect(isWatchLaterCourseSlug('watch-later-e2fc46cb042205b1')).toBe(true)
    expect(isWatchLaterCourseSlug('WATCH-LATER-deadbeef')).toBe(true)
  })

  test('ignores normal course slugs', () => {
    expect(isWatchLaterCourseSlug('the-beginner-s-guide-to-react')).toBe(false)
    expect(isWatchLaterCourseSlug(undefined)).toBe(false)
  })
})
