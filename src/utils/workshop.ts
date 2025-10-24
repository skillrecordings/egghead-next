import {LiveWorkshop} from '@/types'

/**
 * Checks if early bird pricing is currently active based on the earlyBirdEndDate.
 * Early bird ends at 11:59 PM Pacific time on the specified date.
 * Falls back to the isEarlyBird boolean if earlyBirdEndDate is not set.
 *
 * @param workshop - The workshop data containing early bird information
 * @returns true if early bird pricing is active, false otherwise
 */
export function isEarlyBirdActive(workshop?: LiveWorkshop): boolean {
  if (!workshop) return false

  // If earlyBirdEndDate is set, use date-based logic
  if (workshop.earlyBirdEndDate) {
    try {
      const now = new Date()

      // Parse timezone offset from workshop data
      // Expected format: "UTC+H", "UTC-H", "UTC+HH", "UTC-HH"
      let offsetString = '+00:00' // Default to UTC
      const offsetMatch = workshop.utcOffset?.match(/UTC([+-])(\d{1,2})/i)
      if (offsetMatch) {
        const sign = offsetMatch[1]
        const hours = parseInt(offsetMatch[2], 10)
        offsetString = `${sign}${String(hours).padStart(2, '0')}:00`
      }

      // Parse the early bird end date
      const tempDate = new Date(workshop.earlyBirdEndDate)
      if (isNaN(tempDate.getTime())) {
        console.warn('Invalid earlyBirdEndDate:', workshop.earlyBirdEndDate)
        return workshop.isEarlyBird || false
      }

      const year = tempDate.getFullYear()
      const month = String(tempDate.getMonth() + 1).padStart(2, '0')
      const day = String(tempDate.getDate()).padStart(2, '0')

      // Set to 11:59 PM (23:59:00)
      const isoDateTimeString = `${year}-${month}-${day}T23:59:00${offsetString}`
      const earlyBirdEndDateTime = new Date(isoDateTimeString)

      if (isNaN(earlyBirdEndDateTime.getTime())) {
        console.warn('Failed to create early bird end date:', isoDateTimeString)
        return workshop.isEarlyBird || false
      }

      // Check if current time is before the end date
      return now < earlyBirdEndDateTime
    } catch (error) {
      console.error('Error checking early bird status:', error)
      return workshop.isEarlyBird || false
    }
  }

  // Fall back to boolean if earlyBirdEndDate is not set
  return workshop.isEarlyBird || false
}
