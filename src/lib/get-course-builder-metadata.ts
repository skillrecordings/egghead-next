import * as mysql from 'mysql2/promise'
import {ConnectionOptions, RowDataPacket, Pool} from 'mysql2/promise'
import type {Post} from '@/pages/[post]'

const access: ConnectionOptions = {
  uri: process.env.COURSE_BUILDER_DATABASE_URL,
}

function convertToSerializeForNextResponse(result: any) {
  if (!result) return null

  for (const resultKey in result) {
    if (result[resultKey] instanceof Date) {
      result[resultKey] = result[resultKey].toISOString()
    } else if (
      result[resultKey]?.constructor?.name === 'Decimal' ||
      result[resultKey]?.constructor?.name === 'i'
    ) {
      result[resultKey] = result[resultKey].toNumber()
    } else if (result[resultKey]?.constructor?.name === 'BigInt') {
      result[resultKey] = Number(result[resultKey])
    } else if (result[resultKey] instanceof Object) {
      result[resultKey] = convertToSerializeForNextResponse(result[resultKey])
    }
  }

  return result
}

// Create a connection pool for better performance and resource management
let connectionPool: Pool | null = null

function getConnectionPool(): Pool {
  if (!connectionPool) {
    connectionPool = mysql.createPool({
      ...access,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
  }
  return connectionPool
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
  // Map Course Builder `fields.github` to lesson `repo_url`
  repo_url?: string
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
  const pool = getConnectionPool()
  let conn

  try {
    conn = await pool.getConnection()
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

    // Map GitHub repo URL if present on the lesson fields
    if (lessonFields?.github) {
      result.repo_url = lessonFields.github
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
    if (conn) {
      conn.release()
    }
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
  const pool = getConnectionPool()
  let conn

  try {
    conn = await pool.getConnection()
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
    if (conn) {
      conn.release()
    }
  }
}

/**
 * Loads course metadata from the Course Builder database
 * @param slug - The course slug
 * @returns Promise<CourseBuilderMetadata | null> - The course metadata if available, null otherwise
 */
export async function loadCourseBuilderCourseMetadata(
  slug: string,
): Promise<Post | null> {
  if (!process.env.COURSE_BUILDER_DATABASE_URL) {
    console.warn(
      'COURSE_BUILDER_DATABASE_URL not configured, skipping Course Builder metadata lookup',
    )
    return null
  }

  const {hashFromSlug} = parseSlugForHash(slug)
  const pool = getConnectionPool()
  let conn

  try {
    conn = await pool.getConnection()

    // Get course data matching the pattern from [post].tsx
    const [courseRows] = await conn.execute<RowDataPacket[]>(
      `
      SELECT cr_course.*, egh_user.name, egh_user.image
      FROM egghead_ContentResource cr_course
      LEFT JOIN egghead_User egh_user ON cr_course.createdById = egh_user.id
      WHERE (cr_course.id = ? OR JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.slug')) = ? OR cr_course.id LIKE ? OR JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.slug')) LIKE ?)
      AND cr_course.type = 'post'
      AND JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.postType')) = 'course'
      LIMIT 1
    `,
      [slug, slug, `%${hashFromSlug}`, `%${hashFromSlug}`],
    )

    const courseRow = courseRows[0]

    if (!courseRow) {
      console.log(`No Course Builder course found for slug: ${slug}`)
      return null
    }

    // Parse fields if they are JSON strings
    const courseFields =
      typeof courseRow.fields === 'string'
        ? JSON.parse(courseRow.fields)
        : courseRow.fields

    // Convert to the Post type structure
    const post: Post = {
      id: courseRow.id,
      type: courseRow.type,
      createdById: courseRow.createdById,
      fields: courseFields,
      createdAt: new Date(courseRow.createdAt),
      updatedAt: new Date(courseRow.updatedAt),
      deletedAt: courseRow.deletedAt ? new Date(courseRow.deletedAt) : null,
      currentVersionId: courseRow.currentVersionId,
      organizationId: courseRow.organizationId,
      createdByOrganizationMembershipId:
        courseRow.createdByOrganizationMembershipId,
      name: courseRow.name,
      image: courseRow.image,
    }

    console.log(`Found Course Builder course metadata for: ${slug}`)
    return convertToSerializeForNextResponse(post)
  } catch (error) {
    console.error('Error fetching Course Builder course metadata:', error)
    return null
  } finally {
    if (conn) {
      conn.release()
    }
  }
}
