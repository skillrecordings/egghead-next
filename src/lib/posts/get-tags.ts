'use server'

import {Connection, RowDataPacket} from 'mysql2/promise'

export async function getTagsForPost(
  postId: string,
  primaryTagId: string | null | undefined,
  conn: Connection,
) {
  // Get tags for a post
  const [tagRows] = await conn.execute<RowDataPacket[]>(
    `SELECT 
      egh_tag.id, 
      JSON_UNQUOTE(JSON_EXTRACT(egh_tag.fields, '$.name')) AS name, 
      JSON_UNQUOTE(JSON_EXTRACT(egh_tag.fields, '$.slug')) AS slug, 
      JSON_UNQUOTE(JSON_EXTRACT(egh_tag.fields, '$.label')) AS label,
      JSON_UNQUOTE(JSON_EXTRACT(egh_tag.fields, '$.image_url')) AS image_url
    FROM egghead_ContentResourceTag crt
    LEFT JOIN egghead_Tag egh_tag ON crt.tagId = egh_tag.id
    WHERE crt.contentResourceId = ?`,
    [postId],
  )

  // Get primary tag name if exists
  let primaryTagName = null
  if (primaryTagId) {
    const [primaryTagRows] = await conn.execute<RowDataPacket[]>(
      `SELECT JSON_UNQUOTE(JSON_EXTRACT(egh_tag.fields, '$.name')) AS name
       FROM egghead_Tag egh_tag
       WHERE egh_tag.id = ?`,
      [primaryTagId],
    )
    primaryTagName = primaryTagRows[0]?.name || null
  }

  return {
    tags: tagRows,
    primaryTagName,
  }
}
