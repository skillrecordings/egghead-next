import 'server-only'
import {createPool, Pool} from 'mysql2/promise'
import {getCourseBuilderConnectionOptions} from './course-builder-db'

let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    pool = createPool({
      ...getCourseBuilderConnectionOptions(),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
  }

  return pool
}
