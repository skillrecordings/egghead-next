'use server'

import {RowDataPacket} from 'mysql2/promise'
import {PostSchema} from '@/schemas/post'
import {parseSlugForHash} from './utils'
import {getTagsForPost} from './get-tags'
import {getCourseForPost} from './get-course'
import {getPool} from '../db'

export async function getPost(slug: string) {
  if (!process.env.COURSE_BUILDER_DATABASE_URL) {
    console.warn('COURSE_BUILDER_DATABASE_URL not configured, skipping getPost')
    return null
  }

  const {hashFromSlug} = parseSlugForHash(slug)
  const pool = getPool()
  const conn = await pool.getConnection()

  try {
    const hasCourseBuilderId = Boolean(hashFromSlug)

    // Get video resource query.
    // Only allow loose matching for Course Builder `~<id>` slugs. Legacy
    // slugs must use exact matching so random suffixes like `vite` don't match
    // unrelated posts such as `joe-previte` and crash the page.
    const videoResourceSql = hasCourseBuilderId
      ? `SELECT *
       FROM egghead_ContentResource cr_lesson
       JOIN egghead_ContentResourceResource crr ON cr_lesson.id = crr.resourceOfId
       JOIN egghead_ContentResource cr_video ON crr.resourceId = cr_video.id
       WHERE (cr_lesson.id = ? OR JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.slug')) = ?
              OR cr_lesson.id LIKE ? OR JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.slug')) LIKE ?)
       AND cr_lesson.type = 'post'
       AND cr_video.type = 'videoResource'
       LIMIT 1`
      : `SELECT *
       FROM egghead_ContentResource cr_lesson
       JOIN egghead_ContentResourceResource crr ON cr_lesson.id = crr.resourceOfId
       JOIN egghead_ContentResource cr_video ON crr.resourceId = cr_video.id
       WHERE (cr_lesson.id = ? OR JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.slug')) = ?)
       AND cr_lesson.type = 'post'
       AND cr_video.type = 'videoResource'
       LIMIT 1`
    const videoResourceParams = hasCourseBuilderId
      ? [slug, slug, `%${hashFromSlug}`, `%${hashFromSlug}`]
      : [slug, slug]
    const [videoResourceRows] = await conn.execute<RowDataPacket[]>(
      videoResourceSql,
      videoResourceParams,
    )

    // Get post data - filter by type='post' to avoid migrated lessons.
    const postSql = hasCourseBuilderId
      ? `SELECT cr_lesson.*, egh_user.name, egh_user.image
       FROM egghead_ContentResource cr_lesson
       LEFT JOIN egghead_User egh_user ON cr_lesson.createdById = egh_user.id
       WHERE (cr_lesson.id = ? OR JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.slug')) = ? 
              OR cr_lesson.id LIKE ? OR JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.slug')) LIKE ?)
       AND cr_lesson.type = 'post'
       LIMIT 1`
      : `SELECT cr_lesson.*, egh_user.name, egh_user.image
       FROM egghead_ContentResource cr_lesson
       LEFT JOIN egghead_User egh_user ON cr_lesson.createdById = egh_user.id
       WHERE (cr_lesson.id = ? OR JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.slug')) = ?)
       AND cr_lesson.type = 'post'
       LIMIT 1`
    const postParams = hasCourseBuilderId
      ? [slug, slug, `%${hashFromSlug}`, `%${hashFromSlug}`]
      : [slug, slug]
    const [postRows] = await conn.execute<RowDataPacket[]>(postSql, postParams)

    const videoResource = videoResourceRows[0]
    const postRow = postRows[0]

    if (!postRow) {
      console.log('No post found for slug:', slug)
      return null
    }

    // Validate post data
    const postData = PostSchema.safeParse(postRow)
    if (!postData.success) {
      console.error('Post validation failed:', postData.error)
      throw new Error(`Invalid post data: ${postData.error.message}`)
    }

    // Get related data
    const tags = await getTagsForPost(
      postData.data.id!,
      postData.data.fields.primaryTagId,
      conn,
    )
    const course = await getCourseForPost(postData.data.id!, conn)

    return {
      videoResource,
      post: postData.data,
      tags: tags.tags,
      primaryTagName: tags.primaryTagName,
      course,
    }
  } catch (error) {
    console.error('Error in getPost:', error)
    throw error
  } finally {
    conn.release()
  }
}

export async function getAllPostSlugs() {
  if (!process.env.COURSE_BUILDER_DATABASE_URL) {
    console.warn(
      'COURSE_BUILDER_DATABASE_URL not configured, skipping getAllPostSlugs',
    )
    return []
  }

  const pool = getPool()
  const conn = await pool.getConnection()

  try {
    const [postRows] = await conn.execute<RowDataPacket[]>(`
      SELECT * FROM egghead_ContentResource cr_lesson
      WHERE cr_lesson.type = 'post'
        AND COALESCE(
          JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.postType')),
          'lesson'
        ) IN (
          'article',
          'lesson',
          'podcast',
          'tip',
          'course'
        )
    `)

    return postRows.map((post: any) => ({
      slug: post.fields.slug,
    }))
  } finally {
    conn.release()
  }
}
