import * as React from 'react'
import {Coupon} from 'machines/commerce-machine'

type SmallParityCouponMessage = {
  coupon: Coupon
  countryName: string
  onApply: () => void
  onDismiss: () => void
  isPPP?: boolean
}

const SmallParityCouponMessage = ({
  coupon,
  countryName,
  onApply,
  onDismiss,
  isPPP,
}: SmallParityCouponMessage) => {
  const percentOff = coupon && coupon.coupon_discount * 100
  const [showFlag, setShowFlag] = React.useState<boolean>(false)

  return (
    <div className="max-w-screen-sm mx-auto p-4 m-5 shadow-lg rounded-lg text-left bg-white text-black dark:bg-gray-800">
      <h2 className="text-base mb-4 sm:text-left text-center">
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
      <div className="mt-4">
        <label
          className={`inline-flex items-center px-4 py-3 rounded-md  transition-all ease-in-out duration-150 cursor-pointer border hover:bg-gray-100 dark:hover:bg-gray-700 border-opacity-40 ${
            isPPP ? 'border-blue-500' : ' border-gray-300'
          }`}
        >
          <input
            className="form-checkbox"
            name="isPPPActivated"
            type="checkbox"
            checked={isPPP}
            onChange={isPPP ? onDismiss : onApply}
          />
          <span className="ml-4 leading-4 font-semibold">
            {isPPP
              ? `Activated ${percentOff}% off with regional pricing`
              : `Activate ${percentOff}% off with regional pricing`}
          </span>
        </label>
      </div>
    </div>
  )
}

export default SmallParityCouponMessage
