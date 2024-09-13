import {Pool} from 'pg'
const connectionString = process.env.DATABASE_URL

const pool = new Pool({
  connectionString,
  ...(process.env.NODE_ENV === 'production'
    ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {}),
})

export const pgQuery = async (sql: string, params?: any[]) => {
  const start = Date.now()
  const res = await pool.query(sql, params)
  const duration = Date.now() - start
  console.log('executed query', {sql, duration, rows: res.rowCount})
  return res
}

export const getPostgresClient = async () => {
  return await pool.connect()
}
