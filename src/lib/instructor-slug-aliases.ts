const INSTRUCTOR_SLUG_ALIASES: Record<string, string> = {
  hiro: 'hiroko',
  'hiro-nishimura': 'hiroko-nishimura',
  kentcdodds: 'kent-c-dodds',
  'matias-francisco-hernandez-arellano': 'matias-hernandez',
}

export const normalizeInstructorSlug = (slug = '') => {
  return INSTRUCTOR_SLUG_ALIASES[slug] ?? slug
}
