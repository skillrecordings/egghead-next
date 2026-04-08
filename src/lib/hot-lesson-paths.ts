import hotLessonPaths from '@/data/hot-lesson-paths.json'

export const HOT_LESSON_PATHS_GENERATED_AT = hotLessonPaths.generatedAt
export const HOT_LESSON_PATHS_SOURCE_GENERATED_AT =
  hotLessonPaths.sourceGeneratedAt
export const HOT_LESSON_PATHS_WINDOW = hotLessonPaths.window
export const HOT_LESSON_PATHS_REQUESTED_COUNT = hotLessonPaths.requestedCount
export const HOT_LESSON_PATHS_CANONICAL_COUNT = hotLessonPaths.canonicalCount
export const HOT_LESSON_PATHS_ALIAS_COUNT = hotLessonPaths.aliasCount
export const HOT_LESSON_PATHS_UNRESOLVED_COUNT = hotLessonPaths.unresolvedCount

export const HOT_LESSON_PATHS = hotLessonPaths.canonicalLessons as Array<{
  slug: string
  path: string
}>

export const HOT_LESSON_ALIAS_PATHS = hotLessonPaths.aliasLessons as Array<{
  slug: string
  canonicalSlug: string
  canonicalPath: string
}>

export const HOT_LESSON_UNRESOLVED_SLUGS =
  hotLessonPaths.unresolvedSlugs as string[]
