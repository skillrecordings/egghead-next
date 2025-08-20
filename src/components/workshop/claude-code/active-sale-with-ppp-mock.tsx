import React from 'react'
import ActiveSale from './active-sale'

// Since we can't mock the hook directly, we'll create a wrapper that
// simulates the PPP scenario by showing what would happen
const MockedActiveSale = ({pppCoupon, ...props}: any) => {
  // We'll show the regular component with a note about PPP availability
  return (
    <div>
      <ActiveSale {...props} />
      {pppCoupon && (
        <div className="max-w-screen-md pb-5 mx-auto mt-4">
          <div className="p-4 border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
              ℹ️ In production, this PPP coupon would be auto-detected:
            </p>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>Country: {pppCoupon.coupon_region_restricted_to_name}</p>
              <p>Discount: {Math.round(pppCoupon.coupon_discount * 100)}%</p>
              <p>Code: {pppCoupon.coupon_code}</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              When user clicks "Apply PPP discount", the tiered pricing above
              would be replaced with a single PPP price.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default MockedActiveSale
