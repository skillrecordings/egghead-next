import {get, filter} from 'lodash'
import * as React from 'react'
import slugify from 'slugify'
import BestValueStamp from 'components/pricing/select-plan-new/assets/best-value-stamp'
import ColoredBackground from 'components/pricing/select-plan-new/assets/colored-background'
import {keys} from 'lodash'
import Spinner from 'components/spinner'
import Countdown from 'components/pricing/countdown'
import {fromUnixTime} from 'date-fns'
import {Coupon, PricingPlan} from 'types'

const PlanTitle: React.FunctionComponent = ({children}) => (
  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
    {children}
  </h2>
)

export const PlanPrice: React.FunctionComponent<{
  plan: any
  pricesLoading: boolean
}> = ({plan, pricesLoading}) => {
  const {price, price_discounted} = plan
  const priceToDisplay = price_discounted || price
  const discount_percentage = price_discounted
    ? Math.round(((price - price_discounted) * 100) / price)
    : null
  return (
    <div className="flex items-center">
      <div className="flex items-end leading-none">
        <span className="self-start mt-1">USD</span>
        <span className="text-4xl font-light">$</span>
        <span className="self-stretch text-4xl font-extrabold">
          {price_discounted ? (
            <div className="flex items-end">
              <div className={`relative ${pricesLoading ? 'opacity-60' : ''}`}>
                {pricesLoading && (
                  <Spinner className="absolute text-current" size={6} />
                )}
                {priceToDisplay}
              </div>
              <div className="flex flex-col items-start ml-2">
                <div className="relative text-xl opacity-90 before:h-[2px] before:rotate-[-19deg] before:absolute before:bg-current before:w-full flex justify-center items-center text-center">
                  &nbsp;{price}&nbsp;
                </div>
                <div className="text-sm font-semibold text-blue-600 uppercase dark:text-amber-400">
                  save {discount_percentage}%
                </div>
              </div>
            </div>
          ) : (
            <div className={`relative ${pricesLoading ? 'opacity-60' : ''}`}>
              {priceToDisplay}
              {pricesLoading && (
                <Spinner className="absolute text-current " size={6} />
              )}
            </div>
          )}
        </span>
      </div>
    </div>
  )
}

const PlanQuantitySelect: React.FunctionComponent<{
  quantity: number
  onQuantityChanged: any
  plan: any
  pricesLoading: boolean
}> = ({quantity, onQuantityChanged}) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <label className="flex items-center">
        <span className="pr-2 text-sm">Seats</span>
        <input
          className="w-20 bg-gray-100 border-none form-input dark:bg-gray-800"
          type="number"
          value={quantity}
          max={1000}
          min={1}
          onChange={(e) => onQuantityChanged(Number(e.currentTarget.value))}
        />
      </label>
    </div>
  )
}

const PlanIntervalsSwitch: React.FunctionComponent<{
  planTypes: any[]
  disabled: boolean
  currentPlan: any
  setCurrentPlan: (plan: any) => void
}> = ({planTypes, currentPlan, setCurrentPlan, disabled}) => {
  const plansToRender = disabled ? [currentPlan] : planTypes
  return (
    <ul className="flex">
      {plansToRender.map((plan: any, i: number) => {
        const {interval, interval_count} = plan
        const checked: boolean = plan === currentPlan
        const intervalLabel = interval_count > 1 ? 'quarter' : interval

        const buttonStyles = `${
          checked
            ? 'dark:bg-white bg-gray-900 dark:text-gray-900 text-white dark:hover:bg-gray-200 hover:bg-gray-800'
            : 'dark:bg-gray-800 bg-gray-100 dark:hover:bg-gray-700 hover:bg-gray-200'
        } ${i === 0 && 'rounded-l-md'} ${i === 2 && 'rounded-r-md'} ${
          plansToRender.length === 2 && i === 1 && 'rounded-r-md'
        } ${
          plansToRender.length === 1 && 'rounded-md'
        } capitalize block px-3 py-2 cursor-pointer text-sm font-medium transition-all ease-in-out duration-300`

        return (
          <li key={`${interval}-${interval_count}`}>
            <button
              className={buttonStyles}
              onClick={() => setCurrentPlan(plan)}
              tabIndex={0}
              role="radio"
              aria-checked={checked}
            >
              {intervalLabel}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

const DEFAULT_FEATURES = [
  'Full access to all the premium courses',
  'Download courses for offline viewing',
  'Closed captions for every video',
  'Commenting and support',
  'Enhanced Transcripts',
  'RSS course feeds',
]

const PlanFeatures: React.FunctionComponent<{
  planFeatures?: string[]
}> = ({planFeatures = DEFAULT_FEATURES}) => {
  const CheckIcon = () => (
    <svg
      className="flex-shrink-0 inline-block mt-1 text-blue-500"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <path
        fill="currentColor"
        d="M6.00266104,15 C5.73789196,15 5.48398777,14.8946854 5.29679603,14.707378 L0.304822855,9.71382936 C0.0452835953,9.46307884 -0.0588050485,9.09175514 0.0325634765,8.74257683 C0.123932001,8.39339851 0.396538625,8.12070585 0.745606774,8.02930849 C1.09467492,7.93791112 1.46588147,8.04203262 1.71655287,8.30165379 L5.86288579,12.4482966 L14.1675324,0.449797837 C14.3666635,0.147033347 14.7141342,-0.0240608575 15.0754425,0.00274388845 C15.4367507,0.0295486344 15.7551884,0.250045268 15.9074918,0.578881992 C16.0597953,0.907718715 16.0220601,1.29328389 15.8088932,1.58632952 L6.82334143,14.5695561 C6.65578773,14.8145513 6.38796837,14.9722925 6.09251656,15 C6.06256472,15 6.03261288,15 6.00266104,15 Z"
      />
    </svg>
  )

  return (
    <ul>
      {planFeatures.map((feature: string) => {
        return (
          <li className="flex py-2 font-medium" key={slugify(feature)}>
            <CheckIcon />
            <span className="ml-2 leading-tight">{feature}</span>
          </li>
        )
      })}
    </ul>
  )
}

const GetAccessButton: React.FunctionComponent<{
  label: string
  handleClick: () => void
  loaderOn: boolean
  pricesLoading: boolean
}> = ({label, handleClick, loaderOn, pricesLoading}) => {
  return (
    <button
      disabled={pricesLoading}
      className={`w-full px-5 py-2 h-[60px] flex justify-center items-center mt-8 font-semibold text-center text-white transition-all duration-300 ease-in-out bg-blue-600 rounded-md ${
        pricesLoading
          ? 'opacity-60 cursor-default'
          : 'hover:bg-blue-700 hover:scale-105'
      }`}
      onClick={(event) => {
        event.preventDefault()
        handleClick()
      }}
      type="button"
    >
      {loaderOn || pricesLoading ? (
        <Spinner className="absolute text-white" size={6} />
      ) : (
        label
      )}
    </button>
  )
}

type SelectPlanProps = {
  prices: any
  pricesLoading: boolean
  defaultInterval?: string
  defaultQuantity?: number
  handleClickGetAccess: () => void
  quantityAvailable: boolean
  onQuantityChanged: (quantity: number) => void
  onPriceChanged: (priceId: string) => void
  currentPlan: PricingPlan & {features?: string[]}
  currentQuantity: number
  loaderOn: boolean
  appliedCoupon: Coupon
  isPPP: boolean
}

const SelectPlanNew: React.FunctionComponent<SelectPlanProps> = ({
  quantityAvailable = true,
  handleClickGetAccess,
  pricesLoading,
  prices,
  onQuantityChanged,
  onPriceChanged,
  currentPlan,
  currentQuantity,
  loaderOn,
  appliedCoupon,
  isPPP,
}) => {
  const individualPlans = filter(prices, (plan: any) => true)

  const forTeams: boolean = currentQuantity > 1
  const buttonLabel: string = forTeams ? 'Level Up My Team' : 'Become a Member'

  return (
    <>
      <div className="relative z-10 flex flex-col items-center max-w-sm px-5 py-5 text-gray-900 bg-white rounded-sm dark:text-white dark:bg-gray-900 sm:px-8 sm:py-12">
        <PlanTitle>{currentPlan?.name}</PlanTitle>
        {!isPPP && appliedCoupon?.coupon_expires_at && !pricesLoading && (
          <Countdown
            label="Save 40% on Yearly Memberships Price goes up in:"
            date={fromUnixTime(appliedCoupon.coupon_expires_at)}
          />
        )}
        <div className="py-6">
          <PlanPrice pricesLoading={pricesLoading} plan={currentPlan} />
        </div>
        <div className="h-9">
          {keys(prices).length > 1 && (
            <div className={quantityAvailable ? '' : 'mb-4'}>
              <PlanIntervalsSwitch
                disabled={false}
                currentPlan={currentPlan}
                setCurrentPlan={(newPlan: any) => {
                  onPriceChanged(newPlan.stripe_price_id)
                }}
                planTypes={individualPlans}
              />
            </div>
          )}
        </div>
        {quantityAvailable && (
          <div className="my-4">
            <PlanQuantitySelect
              quantity={currentQuantity}
              plan={currentPlan}
              pricesLoading={pricesLoading}
              onQuantityChanged={(quantity: number) => {
                onQuantityChanged(quantity)
              }}
            />
          </div>
        )}

        <PlanFeatures planFeatures={currentPlan?.features} />
        <GetAccessButton
          label={buttonLabel}
          handleClick={handleClickGetAccess}
          loaderOn={loaderOn}
          pricesLoading={pricesLoading}
        />
      </div>
      <ColoredBackground />
      {currentPlan.interval === 'year' && <BestValueStamp />}
    </>
  )
}

export default SelectPlanNew
