'use client'
import Link from 'next/link'
import {motion} from 'framer-motion'
import {fadeInUp, scaleIn} from './animations'
import {useState, useEffect} from 'react'
import './styles.css'
import Image from 'next/image'
import {Button} from '@/ui'
import TimeAndLocation from './time-and-location'
import {WorkshopDateAndTime} from '@/types'

export interface SignUpFormRef {
  focus: () => void
}

const phrases = [
  'Conquer the Complexity of',
  'Turn Failures into Fuel with',
  'Accelerate Your Workflow in',
  'Master Agents in',
]

const flags = ['🇪🇺', '🇬🇧', '🇫🇷', '🇩🇪', '🇪🇸', '🇳🇱', '🇵🇹', '🇧🇪']

// Helper function to parse date/time string with a specific offset
// Assumes dateStr is like "Month Day, Year"
// Assumes timeStr is like "H:mm AM/PM"
// Assumes inputTimeZoneOffset is like -7 (for UTC-7)
export function parseDateTimeWithOffset(
  dateStr: string,
  timeStr: string,
  inputTimeZoneOffset: number,
): Date | null {
  // Combine date and time for initial parsing (might guess local timezone initially)
  const initialDate = new Date(`${dateStr} ${timeStr}`)
  if (isNaN(initialDate.getTime())) {
    console.error(
      'Could not parse initial date/time string:',
      `${dateStr} ${timeStr}`,
    )
    return null // Invalid date/time format
  }

  // Extract date components (use UTC methods to avoid local timezone influence)
  const year = initialDate.getFullYear() // Use getFullYear assuming the date string is correct
  const month = initialDate.getMonth() // Use getMonth assuming the date string is correct
  const day = initialDate.getDate() // Use getDate assuming the date string is correct

  // Parse time components again to be sure
  const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  if (!timeMatch) {
    console.error('Could not parse time string format:', timeStr)
    return null // Handle invalid time format
  }

  let hours = parseInt(timeMatch[1], 10)
  const minutes = parseInt(timeMatch[2], 10)
  const ampm = timeMatch[3].toUpperCase()

  if (ampm === 'PM' && hours < 12) hours += 12
  if (ampm === 'AM' && hours === 12) hours = 0 // Midnight case

  // Format offset correctly (+HH:mm or -HH:mm)
  const offsetSign = inputTimeZoneOffset >= 0 ? '+' : '-'
  const absOffsetHours = Math.abs(Math.trunc(inputTimeZoneOffset))
  const absOffsetMinutes = Math.abs(Math.round((inputTimeZoneOffset % 1) * 60)) // Use round for minutes
  const formattedOffset = `${offsetSign}${String(absOffsetHours).padStart(
    2,
    '0',
  )}:${String(absOffsetMinutes).padStart(2, '0')}`

  // Construct the full ISO string using extracted components and the explicit offset
  const isoString = `${year}-${String(month + 1).padStart(2, '0')}-${String(
    day,
  ).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(
    minutes,
  ).padStart(2, '0')}:00${formattedOffset}`

  try {
    // Create the final Date object from the ISO string with the correct offset
    const finalDate = new Date(isoString)
    if (isNaN(finalDate.getTime())) {
      // Double check final date
      console.error(
        'Failed to create final Date object from ISO string:',
        isoString,
      )
      return null
    }
    return finalDate
  } catch (e) {
    console.error('Error creating final Date object:', e)
    return null
  }
}

// Helper function to format Date into "H:mm A" in a specific timezone
export function formatTimeInTimeZone(date: Date, timeZone: string): string {
  try {
    return date.toLocaleTimeString('en-US', {
      timeZone: timeZone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  } catch (e) {
    console.error(`Error formatting time for timezone ${timeZone}:`, e)
    // Fallback or default value if timezone is invalid
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }
}

const AnimatedPhrase = ({text}: {text: string}) => (
  <motion.span
    key={text}
    initial={{opacity: 0, y: -20}}
    animate={{opacity: [0, 1, 1, 0], y: 0}}
    exit={{opacity: 0, y: 20}}
    transition={{duration: 2.5, times: [0, 0.1, 0.9, 1]}}
    className="absolute left-0 right-0"
  >
    {text}
  </motion.span>
)

function scrollToSignup(
  e: React.MouseEvent<HTMLAnchorElement>,
  formRef: React.RefObject<SignUpFormRef>,
) {
  e.preventDefault()
  document.querySelector('#signup')?.scrollIntoView({behavior: 'smooth'})
  setTimeout(() => {
    formRef.current?.focus()
  }, 500)
}

interface HeroProps {
  formRef: React.RefObject<SignUpFormRef>
  saleisActive: boolean
  dateAndTime: WorkshopDateAndTime
}

export default function Hero({formRef, saleisActive, dateAndTime}: HeroProps) {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [flagIndex, setFlagIndex] = useState(0)

  useEffect(() => {
    const phraseTimer = setInterval(() => {
      setPhraseIndex((current) => (current + 1) % phrases.length)
    }, 3000)
    const flagTimer = setInterval(() => {
      setFlagIndex((current) => (current + 1) % flags.length)
    }, 2000)
    return () => {
      clearInterval(phraseTimer)
      clearInterval(flagTimer)
    }
  }, [])

  // Calculate European times
  const workshopDateObj = dateAndTime
    ? parseDateTimeWithOffset(dateAndTime.date, dateAndTime.startTime, -7)
    : null
  const londonTime = workshopDateObj
    ? formatTimeInTimeZone(workshopDateObj, 'Europe/London')
    : 'Error'
  const parisBerlinTime = workshopDateObj
    ? formatTimeInTimeZone(workshopDateObj, 'Europe/Paris')
    : 'Error'

  return (
    <section className="sm:py-12 py-8 bg-white dark:bg-gray-900 md:py-10 text-center  overflow-hidden">
      <div className="absolute inset-0 pattern-dots" />
      <div
        aria-hidden="true"
        className="absolute inset-0 w-full h-full bg-gradient-to-b dark:from-gray-900/90 dark:to-gray-900/70 from-gray-50 to-transparent"
      />
      <motion.div {...scaleIn} className="relative max-w-4xl mx-auto px-6">
        <Image
          className="mx-auto mb-5 sm:px-0 px-10"
          quality={100}
          src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1739447750/cursor-workshop-perspective_2x_h5fvrr.png"
          alt="Cursor IDE"
          width={1027 / 2.5}
          height={601 / 2.5}
        />
        <motion.h1
          {...fadeInUp}
          className="lg:text-5xl sm:text-4xl text-xl flex flex-col relative mb-6 font-extrabold tracking-tight dark:text-white leading-tight"
        >
          <span className="relative h-[1em] block mb-2">
            <AnimatedPhrase key={phraseIndex} text={phrases[phraseIndex]} />
          </span>
          <span className="">Cursor</span>
        </motion.h1>

        <motion.p
          {...fadeInUp}
          transition={{delay: 0.1}}
          className="relative mb-8 sm:text-lg md:text-lg dark:text-gray-200 text-gray-700 max-w-3xl mx-auto leading-relaxed "
        >
          Join{' '}
          <span className="text-gray-900 pl-2 inline-flex items-baseline md:gap-2 gap-1 dark:text-white font-medium">
            <Image
              src={
                'https://egghead.io/_next/image?url=https%3A%2F%2Fd2eip9sf3oo6c2.cloudfront.net%2Finstructors%2Favatars%2F000%2F000%2F005%2Fsquare_64%2Favatar-500x500.jpg&w=96&q=75'
              }
              alt="John Lindquist"
              width={40}
              height={40}
              className="rounded-full relative md:translate-y-3 translate-y-2 md:w-10 w-7"
            />{' '}
            John Lindquist
          </span>
          , founder of egghead.io, for an immersive workshop designed to help
          you conquer the frustration of getting stuck with complex AI tools.
          You'll learn how to turn failures into successes by mastering{' '}
          <span className="text-gray-900 dark:text-white font-medium">
            Agents, Ask, and Custom Modes
          </span>{' '}
          —plus powerful strategies for multi-file analysis. Streamline your
          development cycle and unlock Cursor's full potential.
        </motion.p>

        <motion.div
          {...fadeInUp}
          transition={{delay: 0.3, type: 'spring', stiffness: 200}}
          className="relative"
        >
          <div className="mt-12 flex flex-col gap-4 justify-center items-center">
            {saleisActive && dateAndTime && (
              <div className="">
                <TimeAndLocation
                  date={dateAndTime.date}
                  startTime={dateAndTime.startTime}
                  timeZone={dateAndTime.timeZone}
                  endTime={dateAndTime.endTime}
                  iconSize={6}
                  className="text-lg gap-2 text-muted-foreground flex md:flex-row md:gap-6"
                />
                {dateAndTime.isEuFriendly && (
                  <div className="relative mb-8 max-w-md mx-auto">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4 shadow-lg transform rotate-0 hover:rotate-1 transition-transform">
                      <div className="flex items-center gap-3">
                        <div className="flex space-x-1 h-[1.5em] items-center min-w-[24px]">
                          <motion.span
                            key={flagIndex}
                            className="text-xl"
                            initial={{opacity: 0}}
                            animate={{opacity: [0, 1, 1, 0]}}
                            transition={{duration: 2, times: [0, 0.2, 0.8, 1]}}
                          >
                            {flags[flagIndex]}
                          </motion.span>
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-white">
                            Europe-Friendly Time!
                          </p>
                          <p className="text-sm text-white/90">
                            That's {londonTime} in London, {parisBerlinTime} in
                            Paris & Berlin
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <Button
              asChild
              size="lg"
              className=" sm:mt-5 dark:bg-white dark:text-black bg-black text-white text-lg font-semibold w-fit"
            >
              <Link href="#signup" onClick={(e) => scrollToSignup(e, formRef)}>
                Register Now
                {/* <ArrowCircleDownIcon className="group-hover:scale-105 w-8 h-8 transition-all duration-200" /> */}
              </Link>
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
