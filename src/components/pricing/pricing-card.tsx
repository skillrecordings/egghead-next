import * as React from 'react'
import {FunctionComponent} from 'react'
import SelectPlanNew from '@/components/pricing/select-plan-new'
import ParityCouponMessage from '@/components/pricing/parity-coupon-message'
import {Coupon} from '@/types'
import {useCommerceMachine} from '@/hooks/use-commerce-machine'
import {get} from 'lodash'
import isEmpty from 'lodash/isEmpty'
import {PricingContext} from '@/components/pricing/pricing-provider'

interface PricingCardProps {}

const PricingCard: FunctionComponent<PricingCardProps> = () => {
  const {viewer, authToken, onClickCheckout, commerce, ppp} =
    React.useContext(PricingContext)
  const {prices, pricesLoading, send, currentPlan, quantity, availableCoupons} =
    commerce
  const {
    pppCouponIsApplied,
    pppCouponAvailable,
    pppCouponEligible,
    onApplyParityCoupon,
    onDismissParityCoupon,
    parityCoupon,
    countryCode,
    countryName,
    appliedCoupon,
  } = ppp

  return (
    <div className="relative p-2 bg-gray-100 rounded-md shadow-lg dark:bg-gray-800 dark:shadow-none">
      <SelectPlanNew
        prices={prices}
        pricesLoading={pricesLoading}
        handleClickGetAccess={() => {
          send({type: 'CONFIRM_PRICE', onClickCheckout})
        }}
        quantityAvailable={true}
        onQuantityChanged={(quantity: number) => {
          send({type: 'CHANGE_QUANTITY', quantity})
        }}
        onPriceChanged={(priceId: string) => {
          send({type: 'SWITCH_PRICE', priceId})
        }}
        currentPlan={currentPlan}
        currentQuantity={quantity}
        loaderOn={false}
        appliedCoupon={appliedCoupon}
        isPPP={pppCouponIsApplied}
      />
      {pppCouponAvailable && pppCouponEligible && (
        <div className="max-w-screen-md pb-5 mx-auto mt-4">
          <ParityCouponMessage
            coupon={parityCoupon as Coupon}
            countryName={countryName as string}
            onApply={onApplyParityCoupon}
            onDismiss={onDismissParityCoupon}
            isPPP={pppCouponIsApplied}
          />
        </div>
      )}
    </div>
  )
}

export default PricingCard
