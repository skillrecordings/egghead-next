'use client'
import * as React from 'react'
import {FunctionComponent} from 'react'
import {useViewer} from '@/context/viewer-context'
import {useRouter, useSearchParams} from 'next/navigation'
import {track} from '@/utils/analytics'
import {handleCheckout} from '@/utils/checkout'
import {useCommerceMachine} from '@/hooks/use-commerce-machine'
import {get} from 'lodash'
import isEmpty from 'lodash/isEmpty'

export const PricingContext = React.createContext<any>({
  viewer: null,
  authToken: null,
  onClickCheckout: (
    priceId: string,
    quantity: number,
    couponCode?: string,
  ) => {},
  commerce: {
    state: null,
    send: null,
    priceId: null,
    quantity: null,
    prices: null,
    availableCoupons: null,
    currentPlan: null,
  },
  ppp: {
    pppCouponIsApplied: null,
    pppCouponAvailable: null,
    pppCouponEligible: null,
    onApplyParityCoupon: null,
    onDismissParityCoupon: null,
    parityCoupon: null,
    countryCode: null,
    countryName: null,
    appliedCoupon: null,
  },
})

const PricingProvider: FunctionComponent<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const {viewer, authToken} = useViewer()

  const router = useRouter()
  const params = useSearchParams()
  const stripeParam = params?.get('stripe')

  const [loaderOn, setLoaderOn] = React.useState<boolean>(false)

  const {
    state,
    send,
    priceId = '',
    quantity,
    prices,
    availableCoupons,
    currentPlan,
  } = useCommerceMachine()

  const pricesLoading = !state.matches('pricesLoaded')
  const pppCouponIsApplied =
    state.matches('pricesLoaded.withPPPCoupon') ||
    (pricesLoading && state.context?.couponToApply?.couponType === 'ppp')

  const parityCoupon = availableCoupons?.['ppp']
  const countryCode = get(parityCoupon, 'coupon_region_restricted_to')
  const countryName = get(parityCoupon, 'coupon_region_restricted_to_name')

  const pppCouponAvailable =
    !isEmpty(countryName) && !isEmpty(countryCode) && !isEmpty(parityCoupon)
  const pppCouponEligible = quantity === 1

  const appliedCoupon = get(state.context.pricingData, 'applied_coupon')

  const onApplyParityCoupon = () => {
    send('APPLY_PPP_COUPON')
  }

  const onDismissParityCoupon = () => {
    send('REMOVE_PPP_COUPON')
  }

  React.useEffect(() => {
    if (stripeParam === 'cancelled') {
      track('checkout: cancelled from stripe')
    } else {
      track('visited pricing')
    }
  }, [stripeParam])

  const onClickCheckout = async () => {
    await handleCheckout(
      priceId,
      quantity,
      viewer,
      authToken,
      router,
      setLoaderOn,
      false,
      state.context.couponToApply?.couponCode,
    )
  }

  return (
    <PricingContext.Provider
      value={{
        viewer,
        authToken,
        onClickCheckout,
        commerce: {
          state,
          send,
          priceId,
          quantity,
          prices,
          availableCoupons,
          currentPlan,
        },
        ppp: {
          pppCouponIsApplied,
          pppCouponAvailable,
          pppCouponEligible,
          onApplyParityCoupon,
          onDismissParityCoupon,
          parityCoupon,
          countryCode,
          countryName,
          appliedCoupon,
        },
      }}
    >
      {children}
    </PricingContext.Provider>
  )
}

export default PricingProvider
