const INSTRUCTOR_SLUG_ALIASES: Record<string, string> = {
  kentcdodds: 'kent-c-dodds',
}

export const normalizeInstructorSlug = (slug = '') => {
  return INSTRUCTOR_SLUG_ALIASES[slug] ?? slug
}
