import {find, get, filter} from 'lodash'
import * as React from 'react'
import slugify from 'slugify'
import BestValueStamp from 'components/pricing/select-plan-new/assets/best-value-stamp'
import ColoredBackground from 'components/pricing/select-plan-new/assets/colored-background'
import {keys} from 'lodash'

const PlanTitle: React.FunctionComponent = ({children}) => (
  <h2 className="text-xl font-bold dark:text-white text-gray-900">
    {children}
  </h2>
)

const PlanPrice: React.FunctionComponent<{
  plan: any
  pricesLoading: boolean
}> = ({plan, pricesLoading}) => {
  const {price, interval, interval_count} = plan
  const intervalLabel = interval_count > 1 ? 'quarter' : interval
  return (
    <div className="flex flex-col items-center">
      <div className="py-6 flex items-end leading-none">
        <span className="mt-1 self-start">USD</span>
        <span className="text-4xl font-light">$</span>
        <span className="text-4xl font-extrabold">
          {pricesLoading ? (
            <div className="px-2 w-full h-full bg-gradient-to-t from-transparent dark:to-gray-700 to-gray-300 animate-pulse rounded-md">
              <span className="opacity-0">––</span>
            </div>
          ) : (
            price
          )}
        </span>
        <span className="text-lg font-light mb-1">/{intervalLabel}</span>
      </div>
    </div>
  )
}

const PlanQuantitySelect: React.FunctionComponent<{
  quantity: number
  onQuantityChanged: any
  plan: any
  pricesLoading: boolean
}> = ({quantity, onQuantityChanged, plan, pricesLoading}) => {
  const {price} = plan
  return (
    <div className="flex flex-col items-center space-y-2">
      <label>
        <span className="pr-2 text-sm">Seats</span>
        <input
          className="form-input dark:bg-gray-800 bg-gray-100 border-none"
          type="number"
          value={quantity}
          max={1000}
          min={1}
          onChange={(e) => onQuantityChanged(Number(e.currentTarget.value))}
        />
      </label>
      {quantity > 1 && (
        <div className="py-2">
          ${!pricesLoading ? price / quantity : '---'}/seat
        </div>
      )}
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
    <ul className="flex ">
      {plansToRender.map((plan: any, i: number) => {
        const {interval, interval_count} = plan
        const checked: boolean = plan === currentPlan
        const intervalLabel = interval_count > 1 ? 'quarter' : interval
        return (
          <li key={interval}>
            <button
              className={`${
                checked
                  ? 'dark:bg-white bg-gray-900 dark:text-gray-900 text-white dark:hover:bg-gray-200 hover:bg-gray-800'
                  : 'dark:bg-gray-800 bg-gray-100 dark:hover:bg-gray-700 hover:bg-gray-200'
              } ${i === 0 && 'rounded-l-md'} ${i === 2 && 'rounded-r-md'} ${
                plansToRender.length === 2 && i === 1 && 'rounded-r-md'
              } ${
                plansToRender.length === 1 && 'rounded-md'
              } capitalize block px-3 py-2 cursor-pointer text-sm font-medium transition-all ease-in-out duration-300`}
              onClick={() => setCurrentPlan(plan)}
              tabIndex={0}
              role="radio"
              aria-active={checked}
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
  'Full access to all premium courses and lessons',
  'RSS course feeds for your favorite podcast app',
  'Offline viewing',
  'Commenting and support',
  'Enhanced Transcripts',
  'Closed captions for every video',
]

const PlanFeatures: React.FunctionComponent<{
  planFeatures: string[]
}> = ({planFeatures = DEFAULT_FEATURES}) => {
  const CheckIcon = () => (
    <svg
      className="text-blue-500 inline-block flex-shrink-0 mt-1"
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
          <li className="py-2 font-medium flex" key={slugify(feature)}>
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
  handleClick: (event: any) => Promise<void>
}> = ({label, handleClick}) => {
  return (
    <button
      className="mt-8 px-5 py-4 text-center bg-blue-600 text-white font-semibold rounded-md w-full hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105"
      onClick={handleClick}
      type="button"
    >
      {label}
    </button>
  )
}

type SelectPlanProps = {
  prices: any
  pricesLoading: boolean
  defaultInterval?: string
  defaultQuantity?: number
  handleClickGetAccess: (event: any) => any
  quantityAvailable: boolean
  onQuantityChanged: (quantity: number) => void
  onPriceChanged: (priceId: string) => void
}

const SelectPlanNew: React.FunctionComponent<SelectPlanProps> = ({
  quantityAvailable = true,
  handleClickGetAccess,
  defaultInterval = 'annual',
  defaultQuantity = 1,
  pricesLoading,
  prices,
  onQuantityChanged,
  onPriceChanged,
}) => {
  const individualPlans = filter(prices, (plan: any) => true)

  const annualPlan = get(prices, 'annualPrice', {
    name: 'Pro Yearly',
    interval: 'year',
  })
  const monthlyPlan = get(prices, 'monthlyPrice')
  const quarterlyPlan = get(prices, 'quarterlyPrice')

  const pricesForInterval = (interval: any) => {
    switch (interval) {
      case 'year':
        return annualPlan
      case 'month':
        return monthlyPlan
      case 'quarter':
        return quarterlyPlan
      default:
        return annualPlan
    }
  }

  const [currentInterval] = React.useState<string>(defaultInterval)
  const [currentQuantity, setCurrentQuantity] = React.useState<number>(
    defaultQuantity,
  )

  const [currentPlan, setCurrentPlan] = React.useState<any>(
    pricesForInterval(currentInterval),
  )

  const forTeams: boolean = currentQuantity > 1
  const buttonLabel: string = forTeams ? 'Level Up My Team' : 'Become a Member'

  React.useEffect(() => {
    setCurrentPlan(annualPlan)
    onPriceChanged(annualPlan.stripe_price_id)
  }, [annualPlan])

  return (
    <>
      <div className="dark:text-white text-gray-900 dark:bg-gray-900 bg-white sm:px-12 sm:py-12 px-6 py-6 flex flex-col items-center max-w-sm relative z-10 rounded-sm">
        <PlanTitle>{currentPlan?.name}</PlanTitle>
        <PlanPrice pricesLoading={pricesLoading} plan={currentPlan} />
        {keys(prices).length > 1 && (
          <div className={quantityAvailable ? '' : 'pb-4'}>
            <PlanIntervalsSwitch
              disabled={false}
              currentPlan={currentPlan}
              setCurrentPlan={(newPlan: any) => {
                setCurrentPlan(newPlan)
                onPriceChanged(newPlan.stripe_price_id)
              }}
              planTypes={individualPlans}
            />
          </div>
        )}
        {quantityAvailable && (
          <div className="py-4">
            <PlanQuantitySelect
              quantity={currentQuantity}
              plan={currentPlan}
              pricesLoading={pricesLoading}
              onQuantityChanged={(quantity: number) => {
                setCurrentQuantity(quantity)
                onQuantityChanged(quantity)
              }}
            />
          </div>
        )}

        <PlanFeatures planFeatures={currentPlan?.features} />
        <GetAccessButton
          label={buttonLabel}
          handleClick={handleClickGetAccess}
        />
      </div>
      <ColoredBackground />
      {currentPlan.interval === 'year' && <BestValueStamp />}
    </>
  )
}

export default SelectPlanNew
