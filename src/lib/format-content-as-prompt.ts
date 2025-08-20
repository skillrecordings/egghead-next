import {PostType} from '@/schemas/post'

interface LessonData {
  title: string
  description?: string | null
  transcript?: string | null
}

interface ContentData {
  title: string
  description?: string | null
  transcript?: string | null
  lessons?: LessonData[]
  contentType: PostType
}

/**
 * Safely gets text content, handling null/undefined values
 */
function getTextContent(value?: string | null): string {
  if (!value || value.trim().length === 0) {
    return ''
  }
  return value.trim()
}

/**
 * Formats lesson data as XML
 */
function formatLessonXML(lesson: LessonData, indent = '    '): string {
  const title = getTextContent(lesson.title)
  const description = getTextContent(lesson.description)
  const transcript = getTextContent(lesson.transcript)

  // Skip lessons with no meaningful content
  if (!title && !description && !transcript) {
    return ''
  }

  let xml = `${indent}<lesson>\n`

  if (title) {
    xml += `${indent}  <title>${title}</title>\n`
  }

  if (description) {
    xml += `${indent}  <description>${description}</description>\n`
  }

  if (transcript) {
    xml += `${indent}  <transcript>${transcript}</transcript>\n`
  }

  xml += `${indent}</lesson>`

  return xml
}

/**
 * Formats content data as XML prompt for LLM consumption
 */
export function formatContentAsPrompt(content: ContentData): string {
  const {title, description, transcript, lessons, contentType} = content

  const titleText = getTextContent(title)
  const descriptionText = getTextContent(description)
  const transcriptText = getTextContent(transcript)

  let xml = `<content type="${contentType}">\n`

  if (titleText) {
    xml += `  <title>${titleText}</title>\n`
  }

  if (descriptionText) {
    xml += `  <description>${descriptionText}</description>\n`
  }

  if (transcriptText) {
    xml += `  <transcript>${transcriptText}</transcript>\n`
  }

  // Add lessons for course content type
  if (contentType === 'course' && lessons && lessons.length > 0) {
    const validLessons = lessons
      .map((lesson) => formatLessonXML(lesson))
      .filter((lessonXml) => lessonXml.trim().length > 0)

    if (validLessons.length > 0) {
      xml += `  <lessons>\n`
      xml += validLessons.join('\n')
      xml += `\n  </lessons>\n`
    }
  }

  xml += `</content>`

  return xml
}

/**
 * Estimates the character count of formatted content
 */
export function estimateContentSize(content: ContentData): number {
  return formatContentAsPrompt(content).length
}

/**
 * Validates content data before formatting
 */
export function validateContentData(content: ContentData): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!content.title || content.title.trim().length === 0) {
    console.log('❌ Validation error: Title is required')
    errors.push('Title is required')
  }

  if (
    !['article', 'lesson', 'podcast', 'tip', 'course'].includes(
      content.contentType,
    )
  ) {
    console.log(
      '❌ Validation error: Invalid content type:',
      content.contentType,
    )
    errors.push('Invalid content type')
  }

  const result = {
    isValid: errors.length === 0,
    errors,
  }
  return result
}
