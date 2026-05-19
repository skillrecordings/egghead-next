import type {CourseBuilderTag} from './types'

export type {CourseBuilderTag} from './types'
export {composeTagImageUrl} from './compose-image-url'

export async function getCourseBuilderTagBySlug(
  slug: string,
): Promise<CourseBuilderTag | null> {
  if (typeof window === 'undefined') {
    const mod = await import('./get-tag-by-slug')
    return mod.getCourseBuilderTagBySlug(slug)
  }
  return null
}

export async function getCourseBuilderTagsBySlugs(
  slugs: readonly string[],
): Promise<Map<string, CourseBuilderTag>> {
  if (typeof window === 'undefined') {
    const mod = await import('./get-tag-by-slug')
    return mod.getCourseBuilderTagsBySlugs(slugs)
  }
  return new Map()
}

export async function listAllCourseBuilderTags(opts?: {
  context?: string
  limit?: number
}): Promise<CourseBuilderTag[]> {
  if (typeof window === 'undefined') {
    const mod = await import('./get-tag-by-slug')
    return mod.listAllCourseBuilderTags(opts)
  }
  return []
}
