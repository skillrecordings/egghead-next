import * as mysql from 'mysql2/promise'
import {ConnectionOptions, RowDataPacket} from 'mysql2/promise'
import type {Post} from '@/pages/[post]'

const access: ConnectionOptions = {
  uri: process.env.COURSE_BUILDER_DATABASE_URL,
}

interface ParsedSlug {
  hashFromSlug: string
  originalSlug: string
}

function parseSlugForHash(rawSlug: string | string[]): ParsedSlug {
  if (!rawSlug) {
    throw new Error('Slug is required')
  }

  const slug = String(rawSlug)

  // Try to get hash from tilde-separated slug first
  const tildeSegments = slug.split('~')
  if (tildeSegments.length > 1) {
    return {
      hashFromSlug: tildeSegments[tildeSegments.length - 1],
      originalSlug: slug,
    }
  }

  // Fallback to dash-separated slug
  const dashSegments = slug.split('-')
  if (dashSegments.length === 0) {
    throw new Error('Invalid slug format')
  }

  return {
    hashFromSlug: dashSegments[dashSegments.length - 1],
    originalSlug: slug,
  }
}

interface VideoResourceWithTranscript {
  fields: {
    transcript?: string
    muxPlaybackId?: string
  }
}

// Type for the combined Course Builder lesson data
type CourseBuilderLessonData = {
  transcript?: string
  description?: string
  title?: string
}

/**
 * Gets combined lesson data (post + video) from the Course Builder database
 * @param slug - The lesson or post slug
 * @returns Promise<CourseBuilderLessonData | null> - The combined lesson data if available, null otherwise
 */
export async function getCourseBuilderLesson(
  slug: string,
): Promise<CourseBuilderLessonData | null> {
  if (!process.env.COURSE_BUILDER_DATABASE_URL) {
    console.warn(
      'COURSE_BUILDER_DATABASE_URL not configured, skipping Course Builder lookup',
    )
    return null
  }

  const {hashFromSlug} = parseSlugForHash(slug)
  const conn = await mysql.createConnection(access)

  try {
    const sql = `
      SELECT 
        cr_lesson.*,
        egh_user.name,
        egh_user.image,
        cr_video.fields as video_fields
      FROM egghead_ContentResource cr_lesson
      LEFT JOIN egghead_User egh_user ON cr_lesson.createdById = egh_user.id
      LEFT JOIN egghead_ContentResourceResource crr ON cr_lesson.id = crr.resourceOfId
      LEFT JOIN egghead_ContentResource cr_video ON crr.resourceId = cr_video.id AND cr_video.type = 'videoResource'
      WHERE (cr_lesson.id = ? OR JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.slug')) = ? OR cr_lesson.id LIKE ? OR JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.slug')) LIKE ?)
      AND cr_lesson.type IN ('post', 'lesson')
      LIMIT 1
    `
    const params = [slug, slug, `%${hashFromSlug}`, `%${hashFromSlug}`]
    const [lessonRows] = await conn.execute<RowDataPacket[]>(sql, params)

    const lessonRow = lessonRows[0]

    if (!lessonRow) {
      console.log(`No Course Builder lesson found for slug: ${slug}`)
      return null
    }

    console.log('lessonRow from getCourseBuilderLesson', lessonRow)

    // Parse fields if they are JSON strings
    const lessonFields =
      typeof lessonRow.fields === 'string'
        ? JSON.parse(lessonRow.fields)
        : lessonRow.fields

    // Parse video fields if they exist
    const videoFields = lessonRow.video_fields
      ? typeof lessonRow.video_fields === 'string'
        ? JSON.parse(lessonRow.video_fields)
        : lessonRow.video_fields
      : null

    // Build the combined lesson data
    const result: CourseBuilderLessonData = {}

    // Get title from lesson fields
    if (lessonFields?.title) {
      result.title = lessonFields.title
    }

    // Get description from lesson body (the actual content, not SEO description)
    if (lessonFields?.body) {
      result.description = lessonFields.body
    }

    // Get transcript from video resource
    if (videoFields?.transcript) {
      result.transcript = videoFields.transcript
    }

    if (Object.keys(result).length > 0) {
      console.log(
        `Found Course Builder lesson data for: ${slug}`,
        Object.keys(result).join(', '),
      )
      return result
    }

    console.log(`No Course Builder lesson data found for: ${slug}`)
    return null
  } catch (error) {
    console.error('Error fetching Course Builder post metadata:', error)
    return null
  } finally {
    await conn.end()
  }
}

/**
 * Gets the full video resource data (including transcript) for a lesson from Course Builder
 * @param slug - The lesson slug
 * @returns Promise<VideoResourceWithTranscript | null> - The video resource if available, null otherwise
 */
export async function getCourseBuilderVideoResource(
  slug: string,
): Promise<VideoResourceWithTranscript | null> {
  if (!process.env.COURSE_BUILDER_DATABASE_URL) {
    console.warn(
      'COURSE_BUILDER_DATABASE_URL not configured, skipping video resource lookup',
    )
    return null
  }

  const {hashFromSlug} = parseSlugForHash(slug)
  const conn = await mysql.createConnection(access)

  try {
    // Get video resource
    const [videoResourceRows] = await conn.execute<RowDataPacket[]>(
      `
      SELECT cr_video.fields
      FROM egghead_ContentResource cr_lesson
      JOIN egghead_ContentResourceResource crr ON cr_lesson.id = crr.resourceOfId
      JOIN egghead_ContentResource cr_video ON crr.resourceId = cr_video.id
      WHERE (cr_lesson.id = ? OR JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.slug')) = ? OR cr_lesson.id LIKE ? OR JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.slug')) LIKE ?)
      AND cr_video.type = 'videoResource'
      LIMIT 1
    `,
      [slug, slug, `%${hashFromSlug}`, `%${hashFromSlug}`],
    )

    const videoResource = videoResourceRows[0] as VideoResourceWithTranscript

    if (videoResource) {
      console.log(
        `Found Course Builder video resource for lesson: ${slug}`,
        videoResource.fields.transcript
          ? 'with transcript'
          : 'without transcript',
      )
      return videoResource
    }

    console.log(`No Course Builder video resource found for lesson: ${slug}`)
    return null
  } catch (error) {
    console.error('Error fetching Course Builder video resource:', error)
    return null
  } finally {
    await conn.end()
  }
}
