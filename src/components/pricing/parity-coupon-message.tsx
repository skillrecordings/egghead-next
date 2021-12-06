import * as React from 'react'
import {ParityCouponMessageProps} from 'interfaces/parity_coupon_message'

const ParityCouponMessage = ({
  coupon,
  countryName,
  onApply,
  onDismiss,
  isPPP,
  reduced,
}: ParityCouponMessageProps & {reduced?: boolean}) => {
  const percentOff = coupon && Math.round(coupon.coupon_discount * 100)
  const [showFlag, setShowFlag] = React.useState<boolean>(false)

  return (
    <div className="max-w-screen-lg p-8 m-5 mx-auto text-left bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-800">
      <h2 className="text-base">
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
        currencies.
      </h2>
      {!reduced && (
        <div className="mt-4">
          <p className="text-base font-semibold">
            The following restrictions apply:
          </p>
          <ul className="mt-2 ml-4 list-disc">
            <li>Downloads and bonuses are not included.</li>
            <li>
              The discount is not valid in conjunction with other promotions.
            </li>
            <li>
              Members-only content will only be available while browsing from{' '}
              {countryName}.
            </li>
            <li>
              The discount is only valid for single-user accounts and does not
              apply to team accounts.
            </li>
          </ul>
        </div>
      )}
      <p className="inline-block mt-5 text-base">
        If that sounds good, you can apply the discount below before continuing.
      </p>
      <div className="flex flex-col items-center mt-4">
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
          <span className="ml-4 font-semibold leading-4">
            {isPPP
              ? `Activated ${percentOff}% off with regional pricing`
              : `Activate ${percentOff}% off with regional pricing`}
          </span>
        </label>
        {isPPP && (
          <div className="mt-4">
            🛑 You currently have a Purchasing Power Parity coupon applied. You
            will have the opportunity to upgrade to a full license at a later
            time if you choose to do so.
          </div>
        )}
      </div>
      {reduced && (
        <p className="mt-4 text-sm text-gray-600">
          *The discount is not valid in conjunction with other promotions.
        </p>
      )}
    </div>
  )
}

export default ParityCouponMessage
