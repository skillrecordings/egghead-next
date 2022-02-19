import * as React from 'react'
import {FunctionComponent} from 'react'
import {useViewer} from 'context/viewer-context'
import stripeCheckoutRedirect from 'api/stripe/stripe-checkout-redirect'
import emailIsValid from 'utils/email-is-valid'
import {track} from 'utils/analytics'
import {useCommerceMachine} from 'hooks/use-commerce-machine'
import {first, get} from 'lodash'
import {Coupon, StripeAccount} from 'types'
import {useRouter} from 'next/router'
import SelectPlanNew from 'components/pricing/select-plan-new'
import PoweredByStripe from 'components/pricing/powered-by-stripe'
import ParityCouponMessage from 'components/pricing/parity-coupon-message'
import isEmpty from 'lodash/isEmpty'
import axios from 'axios'
import toast from 'react-hot-toast'

const PricingWidget: FunctionComponent<{}> = () => {
  const {viewer, authToken} = useViewer()
  const router = useRouter()
  const [loaderOn, setLoaderOn] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (router?.query?.stripe === 'cancelled') {
      track('checkout: cancelled from stripe')
    } else {
      track('visited pricing')
    }
  }, [])

  const {
    state,
    send,
    priceId,
    quantity,
    prices,
    availableCoupons,
    currentPlan,
  } = useCommerceMachine()

  // machine-derived states
  const pricesLoading = !state.matches('pricesLoaded')
  const pppCouponIsApplied =
    state.matches('pricesLoaded.withPPPCoupon') ||
    (pricesLoading && state.context?.couponToApply?.couponType === 'ppp')

  // machine-derived data
  const parityCoupon = availableCoupons?.['ppp']

  const countryCode = get(parityCoupon, 'coupon_region_restricted_to')
  const countryName = get(parityCoupon, 'coupon_region_restricted_to_name')

  const pppCouponAvailable =
    !isEmpty(countryName) && !isEmpty(countryCode) && !isEmpty(parityCoupon)
  const pppCouponEligible = quantity === 1

  const appliedCoupon = get(state.context.pricingData, 'applied_coupon')

  // handlers
  const onApplyParityCoupon = () => {
    send('APPLY_PPP_COUPON')
  }

  const onDismissParityCoupon = () => {
    send('REMOVE_PPP_COUPON')
  }

  const onClickCheckout = async () => {
    if (!priceId) return
    await track('checkout: selected plan', {
      priceId: priceId,
    })

    if (emailIsValid(viewer?.email)) {
      const {hasProAccess} = await axios
        .post(`/api/users/check-pro-status`, {
          email: viewer?.email,
        })
        .then(({data}) => data)

      if (hasProAccess) {
        const message = `You already have pro access with this account (${viewer?.email}). Please contact support@egghead.io if you need help with your subscription.`

        toast.error(message, {
          duration: 6000,
          icon: '❌',
        })

        // email is already associated with a pro account, return early instead
        // of sending the user to a Stripe Checkout Session.
        return
      }

      // the user doesn't have pro access, proceed to checkout
      await track('checkout: valid email present', {
        priceId: priceId,
      })
      await track('checkout: redirect to stripe', {
        priceId,
      })
      stripeCheckoutRedirect({
        priceId,
        email: viewer.email,
        authToken,
        quantity,
        coupon: state.context.couponToApply?.couponCode,
      })
    } else {
      await track('checkout: get email', {
        priceId: priceId,
      })

      const couponCode = state.context.couponToApply?.couponCode

      router.push({
        pathname: '/pricing/email',
        query: {
          priceId,
          quantity,
          ...(couponCode && {coupon: couponCode}),
        },
      })
      setLoaderOn(true)
    }
  }

  return (
    <div className="flex flex-col items-center">
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
          loaderOn={loaderOn}
          appliedCoupon={appliedCoupon}
          isPPP={pppCouponIsApplied}
        />
      </div>
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
      <div className="flex sm:flex-row flex-col items-center py-24 sm:space-x-5 sm:space-y-0 space-y-5">
        <PoweredByStripe />
        <div className="text-sm">30 day money back guarantee</div>
      </div>
    </div>
  )
}

export default PricingWidget
