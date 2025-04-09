'use client'
import * as React from 'react'
import {WorkshopDateAndTime} from '@/types'

interface CountdownTimerProps {
  targetDate: WorkshopDateAndTime
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

// Calculates the time remaining until the target date.
function calculateTimeLeft(targetDate: Date | null): TimeLeft | null {
  if (!targetDate) return null
  const difference = +targetDate - +new Date()
  let timeLeft: TimeLeft | null = null

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  }

  return timeLeft
}

function createDateWithOffset(
  dateStr?: string,
  timeStr?: string,
  tzStr?: string,
) {
  if (!dateStr || !timeStr || !tzStr) return null
  // 1. Parse the TimeZone Offset
  // Expected format: "UTC+H", "UTC-H", "UTC+HH", "UTC-HH"
  // Convert to ISO format +/-HH:mm
  let offsetString = '+00:00' // Default to UTC if parsing fails
  const offsetMatch = tzStr.match(/UTC([+-])(\d{1,2})/i)
  if (offsetMatch) {
    const sign = offsetMatch[1]
    const hours = parseInt(offsetMatch[2], 10)
    // Format as +/-HH:00 (ISO 8601 requires two digits for hours)
    offsetString = `${sign}${String(hours).padStart(2, '0')}:00`
  } else {
    console.warn(
      `Could not parse timezone offset: ${tzStr}. Defaulting to UTC.`,
    )
    // Handle cases like just "UTC" or invalid formats if needed
    if (tzStr.toUpperCase() === 'UTC') {
      offsetString = '+00:00' // Explicitly handle "UTC" as +00:00
    }
  }

  // 2. Parse Date string to get Year, Month, Day reliably
  // We create a temporary date object just to extract components.
  // This assumes the date string format is parseable by Date constructor
  // BUT ignores its timezone interpretation for this step.
  const tempDate = new Date(dateStr)
  if (isNaN(tempDate.getTime())) {
    console.error('Error parsing date part:', dateStr)
    return null // Indicate failure
  }
  const year = tempDate.getFullYear()
  const month = tempDate.getMonth() // 0-indexed (0 = Jan, 1 = Feb, etc.)
  const day = tempDate.getDate()

  // 3. Parse Time string (AM/PM) into 24-hour format
  const timeParts = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  if (!timeParts) {
    console.error('Error parsing time part:', timeStr)
    return null // Indicate failure
  }
  let hours = parseInt(timeParts[1], 10)
  const minutes = parseInt(timeParts[2], 10)
  const ampm = timeParts[3].toUpperCase()

  if (ampm === 'PM' && hours < 12) {
    hours += 12
  } else if (ampm === 'AM' && hours === 12) {
    // Midnight case
    hours = 0
  }
  // Ensure hours and minutes are two digits for ISO string
  const isoHours = String(hours).padStart(2, '0')
  const isoMinutes = String(minutes).padStart(2, '0')

  // 4. Construct the ISO 8601-like String
  // Format: YYYY-MM-DDTHH:mm:ssOFFSET
  // We'll use 00 for seconds.
  // Month needs +1 because getMonth() is 0-indexed.
  const isoMonth = String(month + 1).padStart(2, '0')
  const isoDay = String(day).padStart(2, '0')

  const isoDateTimeString = `${year}-${isoMonth}-${isoDay}T${isoHours}:${isoMinutes}:00${offsetString}`

  // 5. Create the final Date object using the reliable string format
  const finalDate = new Date(isoDateTimeString)

  // 6. Validate the final date
  if (isNaN(finalDate.getTime())) {
    console.error('Error creating final date from string:', isoDateTimeString)
    return null // Indicate failure
  }

  return finalDate
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({targetDate}) => {
  const targetDateWithOffset = createDateWithOffset(
    targetDate?.date,
    targetDate?.startTime,
    targetDate?.utcOffset,
  )

  // Initialize state directly with the calculation to avoid initial null state flicker
  const [timeLeft, setTimeLeft] = React.useState<TimeLeft | null>(() =>
    calculateTimeLeft(targetDateWithOffset),
  )

  React.useEffect(() => {
    // If the initial calculation resulted in null (date passed), don't start timer.
    if (!timeLeft) return

    // Set up the timer to update the timeLeft state every second.
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(targetDateWithOffset))
    }, 1000)

    // Clear the timer if the component unmounts or the timeLeft becomes null.
    return () => clearTimeout(timer)
  }, [timeLeft, targetDateWithOffset]) // Depend on timeLeft to re-run the effect each second

  // If timeLeft is null (countdown finished or invalid date), render nothing.
  if (!timeLeft) {
    return null
  }

  // Helper to format time parts with leading zeros.
  const formatPart = (value: number) => String(value).padStart(2, '0')

  // Build the display string parts.
  const parts = [
    formatPart(timeLeft.hours),
    formatPart(timeLeft.minutes),
    formatPart(timeLeft.seconds),
  ]
  // Prepend days only if there are any days left.
  if (timeLeft.days > 0) {
    parts.unshift(`${timeLeft.days}`)
  }

  // Render the formatted time string.
  return (
    <div className="flex items-center flex-shrink-0 px-2 py-px font-mono text-xs text-white bg-black dark:bg-white dark:bg-opacity-100 bg-opacity-20 dark:text-blue-600 w-fit">
      {parts.join(':')}
    </div>
  )
}

export default CountdownTimer
