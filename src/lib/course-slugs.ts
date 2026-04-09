export const isWatchLaterCourseSlug = (slug?: string) =>
  Boolean(slug && /^watch-later-/i.test(slug))
