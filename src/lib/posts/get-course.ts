'use server'

import {Connection, RowDataPacket} from 'mysql2/promise'

export async function getCourseForPost(postId: string, conn: Connection) {
  const [courseRows] = await conn.execute<RowDataPacket[]>(
    `SELECT 
      JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.title')) AS title,
      JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.slug')) AS slug,
      JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.image')) AS image,
      JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.description')) AS description,
      cr_course.id AS id,
      crr.position AS position,
      (SELECT COUNT(*) FROM egghead_ContentResourceResource lesson_crr
       JOIN egghead_ContentResource cr_lesson ON lesson_crr.resourceId = cr_lesson.id
       WHERE lesson_crr.resourceOfId = cr_course.id
         AND (cr_lesson.type <> 'post' OR (
           JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.state')) = 'published'
           AND cr_lesson.deletedAt IS NULL
         ))) as totalLessons
    FROM egghead_ContentResourceResource crr
    INNER JOIN egghead_ContentResource cr_course ON crr.resourceOfId = cr_course.id
    WHERE crr.resourceId = ?
      AND (cr_course.type <> 'post' OR (
        JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.state')) = 'published'
        AND cr_course.deletedAt IS NULL
      ))
    LIMIT 1`,
    [postId],
  )

  return courseRows?.[0] ?? null
}
