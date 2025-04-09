'use client'

import * as React from 'react'
import Link from 'next/link'
import analytics from '@/utils/analytics'
import {usePathname} from 'next/navigation'
import {trpc} from '@/app/_trpc/client'
import CountdownTimer from './countdown-timer'

const WorkshopSaleHeaderBanner: React.FC = () => {
  const {data: workshopDateAndTime} =
    trpc.featureFlag.getWorkshopDateAndTime.useQuery({
      flag: 'featureFlagCursorWorkshopSale',
    })
  const {data: isSaleBannerEnabled} =
    trpc.featureFlag.isLiveWorkshopSale.useQuery({
      flag: 'featureFlagCursorWorkshopSale',
    })
  const pathname = usePathname()

  return isSaleBannerEnabled ? (
    <Link
      href="/workshop/cursor"
      onClick={() => {
        analytics.events.activityInternalLinkClick(
          'sale',
          pathname ?? '',
          'workshop-sale-banner',
        )
      }}
      className="group"
    >
      <div className="flex flex-col sm:flex-row items-center justify-center pl-2 text-xs text-white bg-gradient-to-r sm:px-2 sm:text-sm from-blue-500 to-indigo-500 py-1">
        <div className="flex sm:flex-row flex-col items-center gap-1 py-1 leading-tight">
          <div className="flex items-center gap-1">
            <span role="img" aria-hidden="true">
              🌟
            </span>{' '}
            {workshopDateAndTime ? (
              <div className="flex  items-center gap-1">
                <span>Sale ends in</span>{' '}
                <CountdownTimer targetDate={workshopDateAndTime} />
              </div>
            ) : (
              'Sale:'
            )}{' '}
          </div>
          <span>Live Cursor Workshop with John Lindquist</span>
        </div>
        <div className="flex items-center flex-shrink-0 px-2 py-px text-white underline dark:text-blue-600">
          <span className="pr-1 font-medium">Claim your Spot</span>{' '}
          <span role="img" aria-hidden="true">
            →
          </span>
        </div>
      </div>
    </Link>
  ) : null
}

export default WorkshopSaleHeaderBanner
