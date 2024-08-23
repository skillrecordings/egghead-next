import {get, filter} from 'lodash'
import * as React from 'react'
import slugify from 'slugify'
import BestValueStamp from '@/components/pricing/select-plan-new/assets/best-value-stamp'
import ColoredBackground from '@/components/pricing/select-plan-new/assets/colored-background'
import {keys} from 'lodash'
import Spinner from '@/components/spinner'
import Countdown from '@/components/pricing/countdown'
import {fromUnixTime} from 'date-fns'
import {Coupon, PricingPlan} from '@/types'
import {useCommerceMachine} from '@/hooks/use-commerce-machine'
import {PricingContext, usePPP} from '../pricing-provider'
import PlanFeatures from '@/components/pricing/plan-features'

const PlanTitle: React.FunctionComponent<React.PropsWithChildren<unknown>> = ({
  children,
}) => (
  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
    {children}
  </h2>
)

export const PlanPrice: React.FunctionComponent<
  React.PropsWithChildren<{
    plan: any
    pricesLoading: boolean
  }>
> = ({plan, pricesLoading}) => {
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

const PlanQuantitySelect: React.FunctionComponent<
  React.PropsWithChildren<{
    quantity: number
    onQuantityChanged: any
    plan: any
    pricesLoading: boolean
  }>
> = ({quantity, onQuantityChanged}) => {
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

const PlanIntervalsSwitch: React.FunctionComponent<
  React.PropsWithChildren<{
    planTypes: any[]
    disabled: boolean
    currentPlan: any
    setCurrentPlan: (plan: any) => void
  }>
> = ({planTypes, currentPlan, setCurrentPlan, disabled}) => {
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

const GetAccessButton: React.FunctionComponent<
  React.PropsWithChildren<{
    label: string
    handleClick: () => void
    loaderOn: boolean
    pricesLoading: boolean
  }>
> = ({label, handleClick, loaderOn, pricesLoading}) => {
  return (
    <button
      disabled={pricesLoading}
      className={`w-full px-5 py-2 h-[60px] flex justify-center items-center font-semibold text-center text-white transition-all duration-300 ease-in-out bg-blue-600 rounded-md ${
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

const PlanPercentageOff: React.FunctionComponent<
  React.PropsWithChildren<{interval: string}>
> = ({interval}) => {
  switch (interval) {
    case 'Yearly':
      return (
        <div className="max-w-2xl pt-4 text-sm font-light leading-tight text-gray-700 dark:text-gray-200">
          Best Value
        </div>
      )
    case 'Quarterly':
      return (
        <div className="max-w-2xl pt-4 text-sm font-light leading-tight text-gray-700 dark:text-gray-200">
          Save{' '}
          <strong className="dark:bg-amber-400 dark:text-black bg-blue-600 text-white px-px font-semibold">
            29%
          </strong>{' '}
          with yearly billing
        </div>
      )
    case 'Monthly':
      return (
        <div className="max-w-2xl pt-4 text-sm font-light leading-tight text-gray-700 dark:text-gray-200">
          Save{' '}
          <strong className="dark:bg-amber-400 dark:text-black bg-blue-600 text-white px-px font-semibold">
            50%
          </strong>{' '}
          with yearly billing
        </div>
      )
    default:
      return null
  }
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

const SelectPlanNew: React.FunctionComponent<
  React.PropsWithChildren<any>
> = () => {
  const {prices, send, currentPlan, quantity, state} = useCommerceMachine()
  const {onClickCheckout, planFeatures} = React.useContext(PricingContext)
  const {appliedCoupon, pppCouponIsApplied} = usePPP()

  const [pricesLoading, setPricesLoading] = React.useState(false)

  React.useEffect(() => {
    if (state.matches('loadingPrices')) {
      setPricesLoading(true)
    }

    if (state.matches('pricesLoaded')) {
      setPricesLoading(false)
    }

    if (state.matches('debouncingQuantityChange')) {
      setPricesLoading(true)
    }
  }, [state])

  const onQuantityChanged = (quantity: number) => {
    send({type: 'CHANGE_QUANTITY', quantity})
  }

  const onPriceChanged = (priceId: string) => {
    send({type: 'SWITCH_PRICE', priceId})
  }

  const handleClickGetAccess = () => {
    send({type: 'CONFIRM_PRICE', onClickCheckout})
  }

  const individualPlans = filter(prices, (plan: any) => true)

  const forTeams: boolean = quantity > 1
  const buttonLabel: string = forTeams ? 'Level Up My Team' : 'Become a Member'

  return (
    <div className="min-w-[300px] flex flex-col items-center">
      <div className="flex flex-col items-center">
        <PlanTitle>{currentPlan?.name}</PlanTitle>
        {!pppCouponIsApplied &&
          appliedCoupon?.coupon_expires_at &&
          !pricesLoading && (
            <Countdown
              label="Save on Yearly Memberships Price goes up in:"
              date={fromUnixTime(appliedCoupon.coupon_expires_at)}
            />
          )}
        <div className="py-6">
          <PlanPrice pricesLoading={pricesLoading} plan={currentPlan} />
        </div>
        <div className="h-9">
          {keys(prices).length > 1 && (
            <div>
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
        {!appliedCoupon && <PlanPercentageOff interval={currentPlan.name} />}
        <div className="mt-4">
          <PlanQuantitySelect
            quantity={quantity}
            plan={currentPlan}
            pricesLoading={pricesLoading}
            onQuantityChanged={(quantity: number) => {
              onQuantityChanged(quantity)
            }}
          />
        </div>
      </div>
      <div className="w-full my-6">
        <GetAccessButton
          label={buttonLabel}
          handleClick={handleClickGetAccess}
          loaderOn={false}
          pricesLoading={pricesLoading}
        />
      </div>
      <PlanFeatures planFeatures={planFeatures} />
    </div>
  )
}

export default SelectPlanNew
