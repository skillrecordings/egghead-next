import {getConnectionPool} from '../get-course-builder-metadata'
import {RowDataPacket} from 'mysql2/promise'

export type EventCoupon = {
  id: string
  code: string | null
  percentageDiscount: number
  expires: Date | null
  maxUses: number
  usedCount: number
  restrictedToProductId: string | null
  fields: Record<string, any>
  // Derived field to identify coupon type
  couponType?: 'earlyBirdMember' | 'member' | 'earlyBird'
}

/**
 * Fetches coupons for a specific event from Course Builder database
 * Coupons are linked to events via the product relationship:
 * Event -> resourceProducts -> Product <- restrictedToProductId in Coupon
 */
export async function getEventCoupons(eventId: string): Promise<EventCoupon[]> {
  if (!process.env.COURSE_BUILDER_DATABASE_URL) {
    console.warn(
      'COURSE_BUILDER_DATABASE_URL not configured, skipping coupon lookup',
    )
    return []
  }

  const pool = getConnectionPool()
  let conn

  try {
    conn = await pool.getConnection()

    // First, get the product IDs associated with this event
    const [productRows] = await conn.execute<RowDataPacket[]>(
      `
      SELECT crp.productId
      FROM egghead_ContentResourceProduct crp
      WHERE crp.resourceId = ?
    `,
      [eventId],
    )

    if (productRows.length === 0) {
      console.log(`No products found for event: ${eventId}`)
      return []
    }

    const productIds = productRows.map((row) => row.productId)

    // Now fetch coupons restricted to these products
    const placeholders = productIds.map(() => '?').join(',')
    const [couponRows] = await conn.execute<RowDataPacket[]>(
      `
      SELECT
        c.id,
        c.code,
        c.percentageDiscount,
        c.expires,
        c.maxUses,
        c.usedCount,
        c.restrictedToProductId,
        c.fields
      FROM egghead_Coupon c
      WHERE c.restrictedToProductId IN (${placeholders})
        AND c.status = 1
      ORDER BY c.percentageDiscount DESC
    `,
      productIds,
    )

    const coupons: EventCoupon[] = couponRows.map((row) => {
      // Parse fields if they are JSON strings
      const fields =
        typeof row.fields === 'string' ? JSON.parse(row.fields) : row.fields

      return {
        id: row.id,
        code: row.code,
        percentageDiscount: Number(row.percentageDiscount),
        expires: row.expires ? new Date(row.expires) : null,
        maxUses: row.maxUses,
        usedCount: row.usedCount,
        restrictedToProductId: row.restrictedToProductId,
        fields: fields || {},
        couponType: determineCouponType(fields),
      }
    })

    console.log(`Found ${coupons.length} coupons for event: ${eventId}`)
    return coupons
  } catch (error) {
    console.error('Error fetching event coupons:', error)
    return []
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

/**
 * Determines the coupon type based on fields metadata
 * This helps match coupons to their purpose (early bird, member, etc.)
 */
function determineCouponType(
  fields: Record<string, any>,
): EventCoupon['couponType'] {
  const type = fields?.type || fields?.couponType

  if (type === 'earlyBirdMember' || type === 'early-bird-member') {
    return 'earlyBirdMember'
  }
  if (type === 'earlyBird' || type === 'early-bird') {
    return 'earlyBird'
  }
  if (type === 'member') {
    return 'member'
  }

  return undefined
}

/**
 * Helper to get specific coupon codes by type
 */
export function getCouponCodesByType(coupons: EventCoupon[]) {
  return {
    earlyBirdMember:
      coupons.find((c) => c.couponType === 'earlyBirdMember')?.code || '',
    member: coupons.find((c) => c.couponType === 'member')?.code || '',
    earlyBird: coupons.find((c) => c.couponType === 'earlyBird')?.code || '',
  }
}

/**
 * Helper to get discount amounts by type
 */
export function getDiscountsByType(coupons: EventCoupon[]) {
  return {
    earlyBirdMember:
      coupons
        .find((c) => c.couponType === 'earlyBirdMember')
        ?.percentageDiscount.toString() || '',
    member:
      coupons
        .find((c) => c.couponType === 'member')
        ?.percentageDiscount.toString() || '',
    earlyBird:
      coupons
        .find((c) => c.couponType === 'earlyBird')
        ?.percentageDiscount.toString() || '',
  }
}
