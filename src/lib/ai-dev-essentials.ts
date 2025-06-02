import * as mysql from 'mysql2/promise'
import {ConnectionOptions, RowDataPacket} from 'mysql2/promise'
import {PostSchema, type Post} from '@/pages/[post]'
import {z} from 'zod'

const access: ConnectionOptions = {
  uri: process.env.COURSE_BUILDER_DATABASE_URL,
}
function convertToSerializeForNextResponse(result: any): any {
  if (!result) return null

  // Create a shallow copy to avoid mutating the original
  const serialized = Array.isArray(result) ? [...result] : {...result}

  for (const resultKey in serialized) {
    if (serialized[resultKey] instanceof Date) {
      serialized[resultKey] = serialized[resultKey].toISOString()
    } else if (serialized[resultKey]?.constructor?.name === 'Decimal') {
      serialized[resultKey] = serialized[resultKey].toNumber()
    } else if (typeof serialized[resultKey] === 'bigint') {
      serialized[resultKey] = Number(serialized[resultKey])
    } else if (serialized[resultKey] instanceof Object) {
      serialized[resultKey] = convertToSerializeForNextResponse(
        serialized[resultKey],
      )
    }
  }

  return serialized
}

export async function getAIDevEssentialsPosts(): Promise<Post[]> {
  if (!process.env.COURSE_BUILDER_DATABASE_URL) {
    throw new Error(
      'COURSE_BUILDER_DATABASE_URL environment variable is required',
    )
  }

  const conn = await mysql.createConnection(access)

  try {
    console.log('INFO: Fetching AI Dev Essentials posts')

    const [postRows] = await conn.execute<RowDataPacket[]>(
      `
      SELECT cr_lesson.*, egh_user.name, egh_user.image
      FROM egghead_ContentResource cr_lesson
      LEFT JOIN egghead_User egh_user ON cr_lesson.createdById = egh_user.id
      WHERE JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.title')) LIKE '%AI Dev Essentials%'
      AND cr_lesson.type = 'post'
      ORDER BY cr_lesson.createdAt DESC
      `,
    )

    const posts: Post[] = []

    for (const postRow of postRows) {
      const postData = PostSchema.safeParse(postRow)
      if (postData.success) {
        posts.push(convertToSerializeForNextResponse(postData.data))
      } else {
        console.error(
          'Post validation failed for AI Dev Essentials post:',
          postData.error,
        )
      }
    }

    console.log(
      `INFO: Fetching AI Dev Essentials posts, found ${posts.length} posts matching criteria`,
    )

    return posts
  } catch (error) {
    console.error('Error in getAIDevEssentialsPosts:', error)
    throw error
  } finally {
    await conn.end()
  }
}
