import * as React from 'react'
import {Coupon} from 'machines/commerce-machine'

type ParityCouponMessage = {
  coupon: Coupon
  countryName: string
  onApply: () => void
  onDismiss: () => void
  isPPP?: boolean
}

const ParityCouponMessage = ({
  coupon,
  countryName,
  onApply,
  onDismiss,
  isPPP,
}: ParityCouponMessage) => {
  const percentOff = coupon && coupon.coupon_discount * 100
  const [showFlag, setShowFlag] = React.useState<boolean>(false)
  return (
    <div className="max-w-screen-lg mx-auto p-7 shadow-lg rounded-lg border border-cool-gray-50 text-left">
      <h2 className="text-lg font-semibold mb-4 sm:text-left text-center">
        We noticed that you're from{' '}
        <img
          loading="lazy"
          width={showFlag ? 18 : 0}
          onLoad={() => setShowFlag(true)}
          alt={coupon.coupon_region_restricted_to}
          className={`inline-block ${showFlag ? 'mr-1' : ''}`}
          src={`https://hardcore-golick-433858.netlify.app/image?code=${coupon.coupon_region_restricted_to}`}
        />
        {countryName}. 👋 To help facilitate global learning, we are offering
        purchasing power parity pricing.
      </h2>
      <p className="text-base">
        Please note that you will only be able to view content from within{' '}
        {countryName}, and{' '}
        <strong>no downloads/bonuses will be provided</strong>.
      </p>
      <p className="text-base inline-block mt-5">
        If that is something that you need:
      </p>
      <div className="mt-4">
        <label
          className={`inline-flex items-center px-4 py-3 rounded-md  transition-all ease-in-out duration-150 cursor-pointer border ${
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
          <span className="ml-2 font-semibold">
            {isPPP
              ? `Activated ${percentOff}% off with regional pricing`
              : `Activate ${percentOff}% off with regional pricing`}
          </span>
        </label>
        {isPPP && (
          <div className="mt-4">
            🛑 You currently have a Purchasing Power Parity coupon applied. With
            this discount your purchase will be restricted to your country
            region/country. You will have the opportunity to upgrade to a full
            license at a later time if you choose to do so.
          </div>
        )}
      </div>
    </div>
  )
}

export default ParityCouponMessage
