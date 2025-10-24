import {format} from 'date-fns'
import {formatInTimeZone} from 'date-fns-tz'
import type {Event} from '@/schemas/event'
import type {LiveWorkshop} from '@/types'

/**
 * Get timezone display name
 */
function getTimeZoneName(tz: string): string {
  const mapping: Record<string, string> = {
    'America/Los_Angeles': 'Pacific Time (PST)',
    'America/New_York': 'Eastern Time (EST)',
    'America/Chicago': 'Central Time (CST)',
    'America/Denver': 'Mountain Time (MST)',
    'Europe/London': 'British Time (GMT)',
    'Europe/Paris': 'Central European Time (CET)',
    'Europe/Berlin': 'Central European Time (CET)',
  }
  return mapping[tz] || tz
}

/**
 * Get UTC offset for a timezone at a specific date
 */
function getUtcOffset(tz: string, date: Date): string {
  try {
    const offset = formatInTimeZone(date, tz, 'XXX')
    return `UTC${offset}`
  } catch (error) {
    console.error('Error getting UTC offset:', error)
    return 'UTC-8' // Default fallback
  }
}

/**
 * Check if workshop timing is EU-friendly
 * EU friendly if starting between 5 PM - 11 PM local time (roughly 9 AM - 3 PM CET)
 */
function isEuFriendlyTime(startDate: Date, tz: string): boolean {
  try {
    const hour = parseInt(formatInTimeZone(startDate, tz, 'H'))
    return hour >= 9 && hour <= 15
  } catch (error) {
    console.error('Error checking EU friendly time:', error)
    return false
  }
}

/**
 * Transform Event from Course Builder database to LiveWorkshop format
 * for use in existing workshop components
 */
export function transformEventToWorkshop(
  event: Event,
): LiveWorkshop | undefined {
  try {
    const {fields} = event

    // Parse dates
    const startDate = new Date(fields.startsAt)
    const endDate = fields.endsAt ? new Date(fields.endsAt) : null

    // Validate dates
    if (isNaN(startDate.getTime())) {
      console.error('Invalid start date:', fields.startsAt)
      return undefined
    }

    const workshop: LiveWorkshop = {
      date: format(startDate, 'yyyy-MM-dd'),
      startTime: formatInTimeZone(startDate, fields.timezone, 'h:mm a'),
      endTime: endDate
        ? formatInTimeZone(endDate, fields.timezone, 'h:mm a')
        : '',
      timeZone: getTimeZoneName(fields.timezone),
      utcOffset: getUtcOffset(fields.timezone, startDate),
      isSaleLive: fields.isSaleLive ?? fields.state === 'published',
      isEuFriendly: isEuFriendlyTime(startDate, fields.timezone),
      isEarlyBird: fields.isEarlyBird ?? false,
      productId: fields.stripeProductId ?? '',
      workshopPrice: fields.workshopPrice ?? '',
      stripePaymentLink: fields.stripePaymentLink ?? '',
      stripeEarlyBirdMemberCouponCode: fields.coupons?.earlyBirdMember ?? '',
      stripeMemberCouponCode: fields.coupons?.member ?? '',
      stripeEarlyBirdCouponCode: fields.coupons?.earlyBird ?? '',
      stripeEarlyBirdMemberDiscount: fields.discounts?.earlyBirdMember ?? '',
      stripeMemberDiscount: fields.discounts?.member ?? '',
      stripeEarlyBirdNonMemberDiscount: fields.discounts?.earlyBird ?? '',
    }

    return workshop
  } catch (error) {
    console.error('Error transforming event to workshop:', error)
    return undefined
  }
}
