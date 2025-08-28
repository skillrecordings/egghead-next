'use client'

import * as React from 'react'
import Link from 'next/link'
import analytics from '@/utils/analytics'
import {usePathname} from 'next/navigation'
import {trpc} from '@/app/_trpc/client'

const WorkshopEarlyBirdHeaderBanner: React.FC = () => {
  const {data: isEarlyBirdSaleBannerEnabled} =
    trpc.featureFlag.isEarlyBirdWorkshopSale.useQuery({
      flag: 'featureFlagCursorWorkshopSale',
    })
  const pathname = usePathname()

  return isEarlyBirdSaleBannerEnabled ? (
    <Link
      href="/workshop/cursor"
      onClick={() => {
        analytics.events.activityInternalLinkClick(
          'sale',
          pathname ?? '',
          'workshop-early-bird-sale-banner',
        )
      }}
      className="group"
    >
      <div className="flex flex-col sm:flex-row items-center justify-center pl-2 text-xs text-white bg-gradient-to-r sm:px-2 sm:text-sm from-blue-500 to-indigo-500 py-1 print:hidden">
        <div className="flex sm:flex-row flex-col items-center gap-1 py-1 leading-tight">
          <div className="flex items-center gap-1">
            <span role="img" aria-hidden="true">
              🌟
            </span>{' '}
            Early Bird Discount Available:
          </div>
          <span>Live Cursor Workshop with John Lindquist</span>
        </div>
        <div className="flex items-center flex-shrink-0 px-2 py-px text-white underline">
          <span className="pr-1 font-medium">Claim your Spot</span>{' '}
          <span role="img" aria-hidden="true">
            →
          </span>
        </div>
      </div>
    </Link>
  ) : null
}

export default WorkshopEarlyBirdHeaderBanner
