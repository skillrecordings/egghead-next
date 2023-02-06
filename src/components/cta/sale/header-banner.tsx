import * as React from 'react'
import Link from 'next/link'
import {track} from 'utils/analytics'
import {useCommerceMachine} from 'hooks/use-commerce-machine'
import get from 'lodash/get'

const SaleHeaderBanner = () => {
  const {state} = useCommerceMachine()
  const appliedCoupon = get(state.context.pricingData, 'applied_coupon')
  const percentOff = Math.round(appliedCoupon?.coupon_discount * 100)

  return appliedCoupon?.default ? (
    <Link href="/pricing">
      <a
        onClick={() => {
          track('clicked flash sale banner', {
            category: 'flash-sale',
            label: 'flash-sale-header-banner',
          })
        }}
        className="group"
      >
        <div className="flex justify-center pl-2 text-xs text-white bg-gradient-to-r sm:px-2 sm:text-sm from-blue-500 to-indigo-500">
          <div className="py-1 pr-3 leading-tight">
            <span role="img" aria-hidden="true">
              🌟
            </span>{' '}
            Sale:{' '}
            <span>
              Save <strong>{percentOff}%</strong> on yearly memberships
              {appliedCoupon.coupon_expires_at && ' for limited time'}.{' '}
            </span>
          </div>
          <div className="flex items-center flex-shrink-0 px-2 py-px text-white bg-black dark:bg-white dark:bg-opacity-100 bg-opacity-20 dark:text-blue-600">
            <span className="pr-1 font-medium">Become a Member</span>{' '}
            <span role="img" aria-hidden="true">
              →
            </span>
          </div>
        </div>
      </a>
    </Link>
  ) : null
}

export default SaleHeaderBanner
