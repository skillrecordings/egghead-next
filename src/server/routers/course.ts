import {router, baseProcedure} from '../trpc'
import {z} from 'zod'
import {loadRatings} from '@/lib/ratings'
import {loadCourse} from '@/lib/courses'
import mysql, {RowDataPacket} from 'mysql2/promise'

const pool = mysql.createPool({
  uri: process.env.COURSE_BUILDER_DATABASE_URL!,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export const courseRouter = router({
  getRatings: baseProcedure
    .input(z.object({slug: z.string(), type: z.string()}))
    .query(async ({input}) => {
      return loadRatings(input.slug, input.type)
    }),
  getCourse: baseProcedure
    .input(z.object({slug: z.string()}))
    .query(async ({input, ctx}) => {
      return loadCourse(input.slug, ctx.userToken)
    }),
  getCourseByResourceId: baseProcedure
    .input(z.object({resourceId: z.string()}))
    .query(async ({input}) => {
      console.log({resourceId: input.resourceId})
      try {
        const conn = await pool.getConnection()
        try {
          // Find the course by its eggheadPlaylistId
          const [courseRows] = await conn.execute<RowDataPacket[]>(
            `SELECT
              JSON_UNQUOTE(JSON_EXTRACT(fields, '$.title')) AS title,
              JSON_UNQUOTE(JSON_EXTRACT(fields, '$.slug')) AS slug,
              id
            FROM egghead_ContentResource
            WHERE JSON_UNQUOTE(JSON_EXTRACT(fields, '$.eggheadPlaylistId')) = ?
            AND type = 'post'
            AND JSON_UNQUOTE(JSON_EXTRACT(fields, '$.postType')) = 'course'
            LIMIT 1`,
            [input.resourceId],
          )

          return courseRows?.[0] ?? null
        } finally {
          conn.release()
        }
      } catch (error) {
        console.error('Error fetching course by resource ID:', error)
        return null
      }
    }),
})
