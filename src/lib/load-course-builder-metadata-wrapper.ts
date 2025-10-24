import type {Post} from '@/schemas/post'

/**
 * Client-safe wrapper for loadCourseBuilderMetadata
 * This function can be safely imported in client components
 * The actual implementation with mysql2 is only loaded server-side
 */
export async function loadCourseBuilderMetadata(
  slug: string,
): Promise<Post | null> {
  // Only load on server-side to avoid mysql2 client bundle issues
  if (typeof window === 'undefined') {
    const {loadCourseBuilderCourseMetadata: loadMetadata} = await import(
      './get-course-builder-metadata'
    )
    return loadMetadata(slug)
  }

  return null
}

/**
 * Client-safe wrapper for getCourseBuilderLessonStates
 * This function can be safely imported in client components
 * The actual implementation with mysql2 is only loaded server-side
 */
export async function getCourseBuilderLessonStates(
  slug: string,
): Promise<Map<string, string> | null> {
  // Only load on server-side to avoid mysql2 client bundle issues
  if (typeof window === 'undefined') {
    const {getCourseBuilderLessonStates: getStates} = await import(
      './get-course-builder-metadata'
    )
    return getStates(slug)
  }

  return null
}

/**
 * Type for Course Builder lesson data
 */
export type CourseBuilderLesson = {
  title: string
  slug: string
  type: string
  path: string
  duration?: number | null
  state?: string
}

/**
 * Client-safe wrapper for getCourseBuilderCourseLessons
 * This function can be safely imported in client components
 * The actual implementation with mysql2 is only loaded server-side
 */
export async function getCourseBuilderCourseLessons(
  slug: string,
): Promise<CourseBuilderLesson[] | null> {
  // Only load on server-side to avoid mysql2 client bundle issues
  if (typeof window === 'undefined') {
    const {getCourseBuilderCourseLessons: getLessons} = await import(
      './get-course-builder-metadata'
    )
    return getLessons(slug)
  }

  return null
}
