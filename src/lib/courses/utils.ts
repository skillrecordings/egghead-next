/**
 * Utility functions for course-related operations
 */

/**
 * Determines if a course should show a "New Lessons" badge
 * @param courseCreatedAt - When the course was created (Date object or ISO string)
 * @param recentLessonsCount - Number of lessons added in the last 7 days
 * @param currentDate - Current date (optional, for testing)
 * @returns boolean indicating if badge should be shown
 */
export function shouldShowNewLessonsBadge(
  courseCreatedAt: Date | string,
  recentLessonsCount: number,
  currentDate: Date | string = new Date(),
): boolean {
  // Don't show badge if no recent lessons
  if (recentLessonsCount === 0) {
    return false
  }

  // Convert strings to Date objects if needed
  const courseDate =
    typeof courseCreatedAt === 'string'
      ? new Date(courseCreatedAt)
      : courseCreatedAt
  const current =
    typeof currentDate === 'string' ? new Date(currentDate) : currentDate

  // Calculate if course is older than 7 days
  const sevenDaysAgo = new Date(current)
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  // Only show badge if course itself is older than 7 days
  // (if course is new, everything is new, so no need for badge)
  return courseDate < sevenDaysAgo
}

/**
 * Converts a database result to be serializable for Next.js responses
 * @param result - The database result to convert
 * @returns Serializable version of the result
 */
export function convertToSerializable(result: any): any {
  if (!result) return null

  // Create a shallow copy to avoid mutating the original
  const serialized = Array.isArray(result) ? [...result] : {...result}

  for (const key in serialized) {
    if (serialized[key] instanceof Date) {
      serialized[key] = serialized[key].toISOString()
    } else if (serialized[key]?.constructor?.name === 'Decimal') {
      serialized[key] = serialized[key].toNumber()
    } else if (typeof serialized[key] === 'bigint') {
      serialized[key] = Number(serialized[key])
    } else if (serialized[key] instanceof Object) {
      serialized[key] = convertToSerializable(serialized[key])
    }
  }

  return serialized
}

/**
 * Formats a date for display
 * @param date - The date to format (Date object or ISO string)
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj)
}

/**
 * Gets a human-readable relative time string
 * @param date - The date to compare (Date object or ISO string)
 * @param currentDate - Current date (optional, for testing)
 * @returns Relative time string (e.g., "2 days ago", "1 week ago")
 */
export function getRelativeTime(
  date: Date | string,
  currentDate: Date | string = new Date(),
): string {
  // Convert strings to Date objects if needed
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const currentDateObj =
    typeof currentDate === 'string' ? new Date(currentDate) : currentDate

  const seconds = Math.floor(
    (currentDateObj.getTime() - dateObj.getTime()) / 1000,
  )

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  }

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit)
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`
    }
  }

  return 'just now'
}
