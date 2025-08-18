/**
 * Extracts the course builder ID SHA from a course builder slug
 * @param slug - The course builder slug (e.g., "foundation-building-ai-memory-with-mcp-and-cursor~duu9m")
 * @returns The course builder ID SHA (e.g., "duu9m")
 */
export function extractCourseBuilderIdSHA(slug: string) {
  const tildeIndex = slug.lastIndexOf('~')

  if (tildeIndex === -1) {
    return undefined
  }

  return slug.substring(tildeIndex + 1)
}
