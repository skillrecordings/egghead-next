import * as React from 'react'
import {LifetimePriceContext} from './lifetime-price-provider'
import Spinner from '../spinner'

const PlanPrice: React.FC<
  React.PropsWithChildren<{
    className?: string
  }>
> = ({className = ''}) => {
  const {pricesLoading, lifetimePlan} = React.useContext(LifetimePriceContext)
  const {price, price_discounted} = lifetimePlan
  const priceToDisplay = price_discounted || price
  const discount_percentage = price_discounted
    ? Math.round(((price - price_discounted) * 100) / price)
    : null
  return (
    <div className={`flex items-center ${className}`}>
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
              {priceToDisplay && (
                <>
                  {priceToDisplay}
                  <span className="inline-block text-sm text-gray-500 -translate-y-7 translate-x-1">
                    00
                  </span>
                </>
              )}
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

export default PlanPrice
