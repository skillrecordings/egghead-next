import type {Guide} from '@/lib/guides'

/**
 * Client-safe wrapper for getGuidesFromCourseBuilder.
 * The actual implementation with mysql2 is only loaded server-side.
 */
export async function loadGuides(): Promise<Guide[]> {
  if (typeof window === 'undefined') {
    const {getGuidesFromCourseBuilder} = await import(
      './guides-from-course-builder'
    )
    return getGuidesFromCourseBuilder()
  }
  return []
}

/**
 * Client-safe wrapper for getGuideFromCourseBuilder.
 * The actual implementation with mysql2 is only loaded server-side.
 */
export async function loadGuide(slug: string): Promise<Guide | null> {
  if (typeof window === 'undefined') {
    const {getGuideFromCourseBuilder} = await import(
      './guides-from-course-builder'
    )
    return getGuideFromCourseBuilder(slug)
  }
  return null
}
