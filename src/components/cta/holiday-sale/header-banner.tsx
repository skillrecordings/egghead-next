import * as React from 'react'
import Link from 'next/link'
import {track} from 'utils/analytics'
import {useCommerceMachine} from 'hooks/use-commerce-machine'
import get from 'lodash/get'

const HolidaySaleHeaderBanner = () => {
  const {state} = useCommerceMachine()
  const appliedCoupon = get(state.context.pricingData, 'applied_coupon')
  const percentOff = Math.round(appliedCoupon?.coupon_discount * 100)

  return appliedCoupon?.default ? (
    <Link href="/pricing">
      <a
        onClick={() => {
          track('clicked holiday banner', {
            category: 'holiday-sale',
            label: 'holiday-sale-header-banner',
          })
        }}
        className="group"
      >
        <div className="bg-gradient-to-r text-white sm:px-2 pl-2 sm:text-sm text-xs from-blue-500 to-indigo-500 flex justify-center">
          <div className="py-1 pr-3 leading-tight">
            <span aria-hidden="true">🌟</span> Holiday Sale:{' '}
            <span>
              Save {percentOff}% on egghead membership
              {appliedCoupon.coupon_expires_at &&
                ' for limited time only'}. <span aria-hidden="true">💫</span>
            </span>
          </div>
          <div className="flex items-center py-px px-2 bg-white dark:bg-opacity-100 bg-opacity-90 text-blue-600 flex-shrink-0">
            <span className="pr-1 font-medium">Become a Member</span>{' '}
            <span aria-hidden>→</span>
          </div>
        </div>
      </a>
    </Link>
  ) : null
}

export default HolidaySaleHeaderBanner
