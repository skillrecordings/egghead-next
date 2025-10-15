'use server'

import {RowDataPacket} from 'mysql2/promise'
import {EventSchema, type Event} from '@/schemas/event'
import {getPool} from '../db'

/**
 * Parse event fields JSON
 */
function parseEventFields(row: RowDataPacket): any {
  if (!row.fields) return {}
  return typeof row.fields === 'string' ? JSON.parse(row.fields) : row.fields
}

/**
 * Get event by ID
 */
export async function getEventById(id: string): Promise<Event | null> {
  const pool = getPool()
  const conn = await pool.getConnection()

  try {
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT * FROM egghead_ContentResource
       WHERE type = 'event' AND id = ?
       LIMIT 1`,
      [id],
    )

    if (!rows[0]) {
      console.log('No event found for ID:', id)
      return null
    }

    const row = rows[0]
    const eventData = {
      ...row,
      fields: parseEventFields(row),
    }

    const result = EventSchema.safeParse(eventData)
    if (!result.success) {
      console.error('Event validation failed:', result.error)
      throw new Error(`Invalid event data: ${result.error.message}`)
    }

    return result.data
  } catch (error) {
    console.error('Error in getEventById:', error)
    throw error
  } finally {
    conn.release()
  }
}

/**
 * Get event by slug
 */
export async function getEventBySlug(slug: string): Promise<Event | null> {
  const pool = getPool()
  const conn = await pool.getConnection()

  try {
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT * FROM egghead_ContentResource
       WHERE type = 'event'
       AND JSON_UNQUOTE(JSON_EXTRACT(fields, '$.slug')) = ?
       LIMIT 1`,
      [slug],
    )

    if (!rows[0]) {
      console.log('No event found for slug:', slug)
      return null
    }

    const row = rows[0]
    const eventData = {
      ...row,
      fields: parseEventFields(row),
    }

    const result = EventSchema.safeParse(eventData)
    if (!result.success) {
      console.error('Event validation failed:', result.error)
      return null
    }

    return result.data
  } catch (error) {
    console.error('Error in getEventBySlug:', error)
    return null
  } finally {
    conn.release()
  }
}

/**
 * Get all published workshops for static generation
 */
export async function getAllWorkshops(): Promise<Event[]> {
  const pool = getPool()
  const conn = await pool.getConnection()

  try {
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT * FROM egghead_ContentResource
       WHERE type = 'event'
       -- AND JSON_UNQUOTE(JSON_EXTRACT(fields, '$.state')) = 'published'
       -- AND JSON_UNQUOTE(JSON_EXTRACT(fields, '$.visibility')) = 'public'
       ORDER BY JSON_EXTRACT(fields, '$.startsAt') DESC`,
    )

    const events: Event[] = []
    for (const row of rows) {
      const eventData = {
        ...row,
        fields: parseEventFields(row),
      }
      const result = EventSchema.safeParse(eventData)
      if (result.success) {
        events.push(result.data)
      }
    }

    return events
  } catch (error) {
    console.error('Error in getAllWorkshops:', error)
    return []
  } finally {
    conn.release()
  }
}

/**
 * Get the featured/primary workshop
 * Returns the featured workshop if available, otherwise the next upcoming workshop
 */
export async function getPrimaryWorkshop(
  slugPattern?: string,
): Promise<Event | null> {
  const pool = getPool()
  const conn = await pool.getConnection()

  try {
    // First try to get featured workshop
    const slugCondition = slugPattern
      ? `AND JSON_UNQUOTE(JSON_EXTRACT(fields, '$.slug')) LIKE ?`
      : ''

    const params = slugPattern ? [slugPattern] : []

    const [featuredRows] = await conn.execute<RowDataPacket[]>(
      `SELECT * FROM egghead_ContentResource
       WHERE type = 'event'
       -- AND JSON_UNQUOTE(JSON_EXTRACT(fields, '$.state')) = 'published'
       -- AND JSON_UNQUOTE(JSON_EXTRACT(fields, '$.visibility')) = 'public'
       AND JSON_UNQUOTE(JSON_EXTRACT(fields, '$.featured')) = 'true'
       ${slugCondition}
       ORDER BY JSON_EXTRACT(fields, '$.startsAt') DESC
       LIMIT 1`,
      params,
    )

    if (featuredRows[0]) {
      const eventData = {
        ...featuredRows[0],
        fields: parseEventFields(featuredRows[0]),
      }
      const result = EventSchema.safeParse(eventData)
      if (result.success) {
        return result.data
      }
    }

    // If no featured workshop, get next upcoming one
    const [upcomingRows] = await conn.execute<RowDataPacket[]>(
      `SELECT * FROM egghead_ContentResource
       WHERE type = 'event'
       -- AND JSON_UNQUOTE(JSON_EXTRACT(fields, '$.state')) = 'published'
       -- AND JSON_UNQUOTE(JSON_EXTRACT(fields, '$.visibility')) = 'public'
       AND STR_TO_DATE(JSON_UNQUOTE(JSON_EXTRACT(fields, '$.startsAt')), '%Y-%m-%dT%H:%i:%s') >= NOW()
       ${slugCondition}
       ORDER BY JSON_EXTRACT(fields, '$.startsAt') ASC
       LIMIT 1`,
      params,
    )

    if (!upcomingRows[0]) {
      return null
    }

    const eventData = {
      ...upcomingRows[0],
      fields: parseEventFields(upcomingRows[0]),
    }

    const result = EventSchema.safeParse(eventData)
    if (!result.success) {
      console.error('Event validation failed:', result.error)
      return null
    }

    return result.data
  } catch (error) {
    console.error('Error in getPrimaryWorkshop:', error)
    return null
  } finally {
    conn.release()
  }
}

/**
 * Get active workshop by slug pattern
 * Useful for getting specific workshop types (e.g., 'claude-code%', 'cursor%')
 */
export async function getActiveWorkshopBySlugPattern(
  pattern: string,
): Promise<Event | null> {
  const pool = getPool()
  const conn = await pool.getConnection()

  try {
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT * FROM egghead_ContentResource
       WHERE type = 'event'
       AND JSON_UNQUOTE(JSON_EXTRACT(fields, '$.slug')) LIKE ?
       -- AND JSON_UNQUOTE(JSON_EXTRACT(fields, '$.state')) = 'published'
       -- AND JSON_UNQUOTE(JSON_EXTRACT(fields, '$.visibility')) = 'public'
       AND (JSON_UNQUOTE(JSON_EXTRACT(fields, '$.isActive')) = 'true'
            OR JSON_UNQUOTE(JSON_EXTRACT(fields, '$.isSaleLive')) = 'true')
       ORDER BY JSON_EXTRACT(fields, '$.startsAt') DESC
       LIMIT 1`,
      [pattern],
    )

    if (!rows[0]) {
      console.log('No active workshop found for pattern:', pattern)
      return null
    }

    const eventData = {
      ...rows[0],
      fields: parseEventFields(rows[0]),
    }

    const result = EventSchema.safeParse(eventData)
    if (!result.success) {
      console.error('Event validation failed:', result.error)
      return null
    }

    return result.data
  } catch (error) {
    console.error('Error in getActiveWorkshopBySlugPattern:', error)
    return null
  } finally {
    conn.release()
  }
}
