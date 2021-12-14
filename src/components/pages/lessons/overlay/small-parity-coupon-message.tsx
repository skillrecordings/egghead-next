import * as React from 'react'
import {ParityCouponMessageProps} from 'types'

const SmallParityCouponMessage = ({
  coupon,
  countryName,
  onApply,
  onDismiss,
  isPPP,
  isLoading,
}: ParityCouponMessageProps) => {
  const percentOff = coupon && Math.round(coupon.coupon_discount * 100)
  const [showFlag, setShowFlag] = React.useState<boolean>(false)

  return (
    <div className="items-center p-3 text-sm text-left rounded-md sm:flex bg-gray-1000 dark:bg-opacity-100 bg-opacity-40">
      <h2 className="inline text-center sm:text-left">
        It looks like you're in{' '}
        <img
          loading="lazy"
          width={showFlag ? 18 : 0}
          onLoad={() => setShowFlag(true)}
          alt={coupon.coupon_region_restricted_to}
          className={`inline-block ${showFlag ? 'mr-1' : ''}`}
          src={`https://hardcore-golick-433858.netlify.app/image?code=${coupon.coupon_region_restricted_to}`}
        />
        {countryName}. 👋 To support global learning, we'd like to offer you a
        discount of <strong>{percentOff}%</strong> to account for differences in
        currencies. If that is something that you need:
      </h2>
      <label
        className={`flex-shrink-0 inline-flex items-center p-3 rounded-md transition-all ease-in-out duration-150 cursor-pointer border hover:bg-gray-700 dark:bg-gray-900 border-opacity-40 ${
          isPPP ? 'border-blue-500' : ' border-gray-300 dark:border-gray-800'
        }
        ${isLoading ? 'cursor-wait' : ''}`}
      >
        <input
          className="bg-gray-200 rounded-sm dark:bg-gray-700"
          name="isPPPActivated"
          type="checkbox"
          checked={isPPP}
          onChange={isPPP ? onDismiss : onApply}
        />
        <span className="ml-2 font-medium leading-3">
          Activate {percentOff}% off with regional pricing
        </span>
      </label>
    </div>
  )
}

export default SmallParityCouponMessage
