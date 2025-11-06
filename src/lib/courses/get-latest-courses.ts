'use server'

import {RowDataPacket} from 'mysql2/promise'
import {getPool} from '@/lib/db'
import {LatestCourse, LatestCourseRow} from './types'
import {convertToSerializable} from './utils'

/**
 * Gets the latest courses sorted by most recent activity
 * Activity is defined as either course creation or lesson addition
 * @param limit - Number of courses to return (default: 4)
 * @returns Array of latest courses with activity tracking
 */
export async function getLatestCourses(
  limit: number = 4,
): Promise<LatestCourse[]> {
  const pool = getPool()
  const conn = await pool.getConnection()

  try {
    // Query to get courses with their latest activity
    // This query:
    // 1. Gets all published courses
    // 2. Joins with lessons to count total and recent lessons
    // 3. Calculates the last activity date (course creation or latest lesson)
    // 4. Orders by last activity date descending
    const [courseRows] = await conn.execute<RowDataPacket[]>(
      `
      SELECT
        cr_course.*,
        JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.title')) AS title,
        JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.slug')) AS slug,
        JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.image')) AS image,
        JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.description')) AS description,
        egh_user.name,
        egh_user.image AS user_image,
        COUNT(DISTINCT cr_lesson.id) AS total_lessons,
        MAX(cr_lesson.createdAt) AS latest_lesson_date,
        SUM(
          CASE
            WHEN cr_lesson.createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            THEN 1
            ELSE 0
          END
        ) AS recent_lessons_count,
        GREATEST(
          cr_course.createdAt,
          COALESCE(MAX(cr_lesson.createdAt), cr_course.createdAt)
        ) AS last_activity_date
      FROM egghead_ContentResource cr_course
      LEFT JOIN egghead_User egh_user ON cr_course.createdById = egh_user.id
      LEFT JOIN egghead_ContentResourceResource crr
        ON cr_course.id = crr.resourceOfId
      LEFT JOIN egghead_ContentResource cr_lesson
        ON crr.resourceId = cr_lesson.id
        AND cr_lesson.type = 'post'
        AND JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.state')) = 'published'
      WHERE
        cr_course.type = 'post'
        AND JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.postType')) = 'course'
        AND JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.state')) = 'published'
        AND cr_course.deletedAt IS NULL
      GROUP BY cr_course.id
      ORDER BY last_activity_date DESC
      LIMIT ?
      `,
      [limit],
    )

    // Transform the database rows into our LatestCourse type
    const courses: LatestCourse[] = (courseRows as LatestCourseRow[]).map(
      (row) => {
        // Parse fields if they are JSON strings
        const fields =
          typeof row.fields === 'string' ? JSON.parse(row.fields) : row.fields

        return {
          id: row.id,
          title: row.title || fields.title || 'Untitled Course',
          slug: row.slug || fields.slug || row.id,
          description: row.description || fields.description || null,
          image: row.image || fields.image || null,
          createdAt: new Date(row.createdAt),
          updatedAt: new Date(row.updatedAt),
          totalLessons: Number(row.total_lessons) || 0,
          recentLessonsCount: Number(row.recent_lessons_count) || 0,
          latestLessonDate: row.latest_lesson_date
            ? new Date(row.latest_lesson_date)
            : null,
          lastActivityDate: new Date(row.last_activity_date),
          instructor:
            row.name || row.user_image
              ? {
                  name: row.name || 'Unknown Instructor',
                  image: row.user_image || null,
                }
              : null,
        }
      },
    )

    console.log(`Found ${courses.length} latest courses with activity tracking`)

    // Convert to serializable format for Next.js
    return convertToSerializable(courses)
  } catch (error) {
    console.error('Error fetching latest courses:', error)
    return []
  } finally {
    conn.release()
  }
}

/**
 * Gets a single course with activity tracking by slug
 * @param slug - The course slug
 * @returns The course with activity tracking or null if not found
 */
export async function getCourseWithActivity(
  slug: string,
): Promise<LatestCourse | null> {
  const pool = getPool()
  const conn = await pool.getConnection()

  try {
    const [courseRows] = await conn.execute<RowDataPacket[]>(
      `
      SELECT
        cr_course.*,
        JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.title')) AS title,
        JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.slug')) AS slug,
        JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.image')) AS image,
        JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.description')) AS description,
        egh_user.name,
        egh_user.image AS user_image,
        COUNT(DISTINCT cr_lesson.id) AS total_lessons,
        MAX(cr_lesson.createdAt) AS latest_lesson_date,
        SUM(
          CASE
            WHEN cr_lesson.createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            THEN 1
            ELSE 0
          END
        ) AS recent_lessons_count,
        GREATEST(
          cr_course.createdAt,
          COALESCE(MAX(cr_lesson.createdAt), cr_course.createdAt)
        ) AS last_activity_date
      FROM egghead_ContentResource cr_course
      LEFT JOIN egghead_User egh_user ON cr_course.createdById = egh_user.id
      LEFT JOIN egghead_ContentResourceResource crr
        ON cr_course.id = crr.resourceOfId
      LEFT JOIN egghead_ContentResource cr_lesson
        ON crr.resourceId = cr_lesson.id
        AND cr_lesson.type = 'post'
        AND JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.state')) = 'published'
      WHERE
        (cr_course.id = ? OR JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.slug')) = ?)
        AND cr_course.type = 'post'
        AND JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.postType')) = 'course'
        AND JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.state')) = 'published'
        AND cr_course.deletedAt IS NULL
      GROUP BY cr_course.id
      LIMIT 1
      `,
      [slug, slug],
    )

    if (courseRows.length === 0) {
      return null
    }

    const row = courseRows[0] as LatestCourseRow
    const fields =
      typeof row.fields === 'string' ? JSON.parse(row.fields) : row.fields

    const course: LatestCourse = {
      id: row.id,
      title: row.title || fields.title || 'Untitled Course',
      slug: row.slug || fields.slug || row.id,
      description: row.description || fields.description || null,
      image: row.image || fields.image || null,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      totalLessons: Number(row.total_lessons) || 0,
      recentLessonsCount: Number(row.recent_lessons_count) || 0,
      latestLessonDate: row.latest_lesson_date
        ? new Date(row.latest_lesson_date)
        : null,
      lastActivityDate: new Date(row.last_activity_date),
      instructor:
        row.name || row.user_image
          ? {
              name: row.name || 'Unknown Instructor',
              image: row.user_image || null,
            }
          : null,
    }

    return convertToSerializable(course)
  } catch (error) {
    console.error('Error fetching course with activity:', error)
    return null
  } finally {
    conn.release()
  }
}
