import type {RowDataPacket} from 'mysql2/promise'
import * as mysql from 'mysql2/promise'
import {getCourseBuilderConnectionOptions} from '@/lib/course-builder-db'
import type {CourseBuilderTag} from './types'
import {composeTagImageUrl} from './compose-image-url'

let pool: mysql.Pool | null = null
function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      ...getCourseBuilderConnectionOptions(),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
  }
  return pool
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function parseFields(raw: unknown): Record<string, unknown> {
  if (!raw) return {}
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      return isRecord(parsed) ? parsed : {}
    } catch {
      return {}
    }
  }
  return isRecord(raw) ? raw : {}
}

function asString(v: unknown): string | null {
  return typeof v === 'string' && v.length > 0 ? v : null
}

function asNumber(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null
}

function asFirstString(v: unknown): string | null {
  if (!Array.isArray(v)) return null
  const first = v.find((item) => typeof item === 'string')
  return typeof first === 'string' ? first : null
}

function normalizeRow(row: RowDataPacket): CourseBuilderTag {
  const fields = parseFields(row.fields)
  const rowId = typeof row.id === 'string' ? row.id : String(row.id)
  const slug = asString(fields.slug) ?? rowId
  const explicitLegacyId = asNumber(fields.legacyId)
  const legacyIdFromTagId = /^tag_\d+$/.test(rowId)
    ? Number(rowId.slice(4))
    : null
  const legacyId =
    explicitLegacyId ??
    (legacyIdFromTagId !== null && Number.isFinite(legacyIdFromTagId)
      ? legacyIdFromTagId
      : null)

  const rawImageUrl = asString(fields.imageUrl) ?? asString(fields.image_url)
  const image_480_url = composeTagImageUrl({
    imageUrl: rawImageUrl,
    legacyId,
    size: 'square_480',
  })
  const image_url = composeTagImageUrl({
    imageUrl: rawImageUrl,
    legacyId,
    size: 'thumb',
  })

  return {
    id: rowId,
    name: asString(fields.name) ?? slug,
    slug,
    label: asString(fields.label),
    description: asString(fields.description),
    image_url,
    image_480_url,
    path: asString(fields.path) ?? `/q/${slug}`,
    url: asString(fields.url),
    context: asString(fields.context) ?? asFirstString(fields.contexts),
    taggingsCount: asNumber(fields.taggingsCount),
    popularityOrder:
      asNumber(fields.popularityOrder) ?? asNumber(fields.popularity_order),
    legacyId,
  }
}

export async function getCourseBuilderTagBySlug(
  slug: string,
): Promise<CourseBuilderTag | null> {
  if (!process.env.COURSE_BUILDER_DATABASE_URL) return null
  if (!slug) return null

  let conn
  try {
    conn = await getPool().getConnection()
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT id, fields
       FROM egghead_Tag
       WHERE deletedAt IS NULL
         AND (
           JSON_UNQUOTE(JSON_EXTRACT(fields, '$.slug')) = ?
           OR JSON_UNQUOTE(JSON_EXTRACT(fields, '$.name')) = ?
         )
       ORDER BY
         CASE WHEN JSON_UNQUOTE(JSON_EXTRACT(fields, '$.slug')) = ? THEN 0 ELSE 1 END,
         CAST(COALESCE(JSON_UNQUOTE(JSON_EXTRACT(fields, '$.taggingsCount')), '0') AS UNSIGNED) DESC
       LIMIT 1`,
      [slug, slug, slug],
    )
    const row = rows[0]
    if (!row) return null
    return normalizeRow(row)
  } catch (error) {
    console.error('Error fetching Course Builder tag by slug:', error)
    return null
  } finally {
    if (conn) conn.release()
  }
}

export async function getCourseBuilderTagsBySlugs(
  slugs: readonly string[],
): Promise<Map<string, CourseBuilderTag>> {
  const result = new Map<string, CourseBuilderTag>()
  if (!process.env.COURSE_BUILDER_DATABASE_URL) return result
  const deduped = Array.from(
    new Set(slugs.filter((s): s is string => Boolean(s))),
  )
  if (deduped.length === 0) return result

  let conn
  try {
    conn = await getPool().getConnection()
    const placeholders = deduped.map(() => '?').join(',')
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT id, fields
       FROM egghead_Tag
       WHERE deletedAt IS NULL
         AND (
           JSON_UNQUOTE(JSON_EXTRACT(fields, '$.slug')) IN (${placeholders})
           OR JSON_UNQUOTE(JSON_EXTRACT(fields, '$.name')) IN (${placeholders})
         )`,
      [...deduped, ...deduped],
    )
    const normalizedRows = rows.map(normalizeRow)
    const slugKeys = new Set(normalizedRows.map((tag) => tag.slug))

    for (const normalized of normalizedRows) {
      if (!result.has(normalized.slug)) result.set(normalized.slug, normalized)
    }

    for (const normalized of normalizedRows) {
      if (
        normalized.name &&
        !slugKeys.has(normalized.name) &&
        !result.has(normalized.name)
      ) {
        result.set(normalized.name, normalized)
      }
    }
    return result
  } catch (error) {
    console.error('Error fetching Course Builder tags by slugs:', error)
    return result
  } finally {
    if (conn) conn.release()
  }
}

export async function listAllCourseBuilderTags(opts?: {
  context?: string
  limit?: number
}): Promise<CourseBuilderTag[]> {
  if (!process.env.COURSE_BUILDER_DATABASE_URL) return []

  const limit =
    typeof opts?.limit === 'number' &&
    Number.isFinite(opts.limit) &&
    opts.limit > 0
      ? Math.floor(opts.limit)
      : null
  const context = opts?.context ?? null

  let conn
  try {
    conn = await getPool().getConnection()
    const where: string[] = ['deletedAt IS NULL']
    const params: (string | number)[] = []
    if (context) {
      where.push(
        `(JSON_UNQUOTE(JSON_EXTRACT(fields, '$.context')) = ? OR JSON_CONTAINS(JSON_EXTRACT(fields, '$.contexts'), JSON_QUOTE(?)))`,
      )
      params.push(context, context)
    }
    const limitClause = limit ? `LIMIT ${limit}` : ''
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT id, fields
       FROM egghead_Tag
       WHERE ${where.join(' AND ')}
       ORDER BY
         CAST(COALESCE(JSON_UNQUOTE(JSON_EXTRACT(fields, '$.taggingsCount')), '0') AS UNSIGNED) DESC,
         JSON_UNQUOTE(JSON_EXTRACT(fields, '$.name')) ASC
       ${limitClause}`,
      params,
    )
    return rows.map(normalizeRow)
  } catch (error) {
    console.error('Error listing Course Builder tags:', error)
    return []
  } finally {
    if (conn) conn.release()
  }
}
