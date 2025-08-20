import {createPool, Pool} from 'mysql2/promise'

let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    if (!process.env.COURSE_BUILDER_DATABASE_URL) {
      throw new Error(
        'COURSE_BUILDER_DATABASE_URL environment variable is not set',
      )
    }

    pool = createPool({
      uri: process.env.COURSE_BUILDER_DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
  }

  return pool
}
