'use client'

import * as React from 'react'
import Link from 'next/link'
import analytics from '@/utils/analytics'
import {usePathname} from 'next/navigation'
import CountdownTimer from './countdown-timer'
import {isEarlyBirdActive} from '@/utils/workshop'
import type {LiveWorkshop} from '@/types'

interface WorkshopSaleHeaderBannerProps {
  isEnabled?: boolean
  workshopDateAndTime?: LiveWorkshop
  workshopPath: string
  workshopTitle: string
  // When true, show the workshop date instead of a live countdown timer.
  displayDate?: boolean
}

// Builds a short, readable date label from the workshop fields. These come
// from the feature flag already formatted for display (e.g. "Friday, June 26"),
// so we render them as-is rather than parsing them as timestamps.
function buildDateLabel(workshop?: LiveWorkshop): string {
  if (!workshop) return ''
  const time = workshop.startTime
    ? workshop.timeZone
      ? `${workshop.startTime} ${workshop.timeZone}`
      : workshop.startTime
    : ''
  return [workshop.date, time].filter(Boolean).join(' · ')
}

// Pill that shows the workshop date, styled to sit alongside the banner text in
// place of the countdown timer.
const WorkshopDateBadge: React.FC<{label: string}> = ({label}) => (
  <span className="flex items-center flex-shrink-0 gap-1 px-2 py-px text-xs font-semibold text-white rounded bg-white/20 w-fit whitespace-nowrap">
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
    {label}
  </span>
)

const WorkshopSaleHeaderBanner: React.FC<WorkshopSaleHeaderBannerProps> = ({
  isEnabled,
  workshopDateAndTime,
  workshopPath,
  workshopTitle,
  displayDate = false,
}) => {
  const pathname = usePathname()

  const isEarlyBird = isEarlyBirdActive(workshopDateAndTime)

  // Create modified workshop object for early bird countdown
  const countdownData =
    isEarlyBird && workshopDateAndTime?.earlyBirdEndDate
      ? {
          ...workshopDateAndTime,
          date: workshopDateAndTime.earlyBirdEndDate,
          startTime: '11:59 PM',
        }
      : workshopDateAndTime

  const dateLabel = buildDateLabel(workshopDateAndTime)
  const showDateBadge = displayDate && Boolean(dateLabel)

  // Either the live countdown or a static date badge, depending on the banner.
  const timing = showDateBadge ? (
    <WorkshopDateBadge label={dateLabel} />
  ) : (
    <CountdownTimer targetDate={countdownData} />
  )

  return isEnabled ? (
    <Link
      href={workshopPath}
      onClick={() => {
        analytics.events.activityInternalLinkClick(
          'sale',
          pathname ?? '',
          'workshop-sale-banner',
        )
      }}
      className="group"
    >
      <div className="flex flex-col sm:flex-row items-center justify-center pl-2 text-xs text-white bg-gradient-to-r sm:px-2 sm:text-sm from-blue-500 to-indigo-500 py-1 print:hidden">
        <div className="flex sm:flex-row flex-col items-center gap-1 py-1 leading-tight">
          <div className="flex items-center gap-1">
            {isEarlyBird && workshopDateAndTime?.earlyBirdBannerMessage ? (
              <div className="flex items-center gap-1">
                <span className="text-balance w-fit">
                  {workshopDateAndTime.earlyBirdBannerMessage}
                </span>{' '}
                {timing}
              </div>
            ) : workshopDateAndTime?.bannerMessage ? (
              <div className="flex flex-col sm:flex-row items-center gap-1">
                <span className="text-balance w-fit">
                  {workshopDateAndTime.bannerMessage}
                </span>{' '}
                {timing}
              </div>
            ) : workshopDateAndTime ? (
              <div className="flex  items-center gap-1">
                <span>
                  Sign up for the {workshopTitle}
                  {showDateBadge ? ' —' : " — you've got"}
                </span>{' '}
                {timing}
              </div>
            ) : (
              'Sale:'
            )}{' '}
          </div>
        </div>
        <div className="flex items-center flex-shrink-0 px-2 py-px text-white underline">
          <span className="pr-1 font-medium">to Claim your Spot</span>{' '}
          <span role="img" aria-hidden="true">
            →
          </span>
        </div>
      </div>
    </Link>
  ) : null
}

export default WorkshopSaleHeaderBanner
