import type {Post} from '@/pages/[post]'

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
