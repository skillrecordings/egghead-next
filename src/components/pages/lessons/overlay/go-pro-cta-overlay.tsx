import React, {FunctionComponent} from 'react'
import Link from 'next/link'
import {LessonResource} from 'types'
import {track} from 'utils/analytics'
import {useCommerceMachine} from 'hooks/use-commerce-machine'
import {PlanPrice} from 'components/pricing/select-plan-new/index'
import SmallParityCouponMessage from './small-parity-coupon-message'
import {Coupon} from 'machines/commerce-machine'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import first from 'lodash/first'
import {useViewer} from 'context/viewer-context'
import emailIsValid from 'utils/email-is-valid'
import axios from 'axios'
import stripeCheckoutRedirect from 'api/stripe/stripe-checkout-redirect'
import toast from 'react-hot-toast'
import {StripeAccount} from 'types'

type JoinCTAProps = {
  lesson: LessonResource
}

const GoProCtaOverlay: FunctionComponent<JoinCTAProps> = ({lesson}) => {
  const {viewer, authToken} = useViewer()
  const {state, send, priceId, quantity, availableCoupons, currentPlan} =
    useCommerceMachine({initialPlan: 'monthlyPrice'})

  const [emailForCheckout, setEmailForCheckout] = React.useState<
    string | undefined
  >(viewer?.email)

  React.useEffect(() => {
    if (!isEmpty(viewer?.email)) {
      setEmailForCheckout(viewer.email)
    }
  }, [viewer?.email])

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

  // handlers
  const onApplyParityCoupon = () => {
    send('APPLY_PPP_COUPON')
  }

  const onDismissParityCoupon = () => {
    send('REMOVE_PPP_COUPON')
  }

  const onClickCheckout = async () => {
    if (!priceId) return
    if (!emailForCheckout) return

    const account = first<StripeAccount>(get(viewer, 'accounts'))
    await track('checkout: selected plan', {
      priceId: priceId,
    })

    const emailRequiresAProCheck =
      !isEmpty(emailForCheckout) && emailForCheckout !== viewer?.email

    if (emailRequiresAProCheck) {
      const {hasProAccess} = await axios
        .post(`/api/users/check-pro-status`, {
          email: emailForCheckout,
        })
        .then(({data}) => data)

      if (hasProAccess) {
        const message = `You've already got a pro account at ${emailForCheckout}. Please sign in.`

        toast.error(message, {
          duration: 6000,
          icon: '❌',
        })

        track('cta overlay checkout: existing pro account found', {
          email: emailForCheckout,
        })

        // email is already associated with a pro account, return early instead
        // of sending the user to a Stripe Checkout Session.
        return
      }
    }

    if (emailIsValid(emailForCheckout)) {
      await track('checkout: valid email present', {
        priceId: priceId,
      })
      await track('checkout: redirect to stripe', {
        priceId,
      })

      stripeCheckoutRedirect({
        priceId,
        email: emailForCheckout,
        stripeCustomerId: account?.stripe_customer_id,
        authToken,
        quantity,
        coupon: state.context.couponToApply?.couponCode,
      })
    } else {
      // we don't have a valid email for the checkout
      await track('checkout: unable to proceed, no valid email', {
        email: emailForCheckout,
      })
    }
  }

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="sm:text-lg text-sm uppercase leading-tighter tracking-tight font-light text-center">
        This lesson is for members only
      </h2>
      <h1 className="sm:text-2xl text-xl leading-tighter tracking-tight font-light text-center">
        Ready to take your career to the next level?
      </h1>
      <PlanPrice pricesLoading={pricesLoading} plan={currentPlan} />
      {isEmpty(viewer) && (
        <input
          id="email"
          type="email"
          value={emailForCheckout}
          onChange={(e) => {
            setEmailForCheckout(e.target.value)
          }}
          placeholder="you@company.com"
          className="py-3 text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-blue-500 block w-full pl-10 border-gray-300 rounded-md"
          required
        />
      )}
      <button
        className="w-full px-5 py-4 mt-8 font-semibold text-center text-white transition-all duration-300 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700 hover:scale-105"
        onClick={(_event) => {
          track('clicked join cta on blocked lesson', {
            lesson: lesson.slug,
          })
          send({type: 'CONFIRM_PRICE', onClickCheckout})
        }}
        type="button"
        disabled={isEmpty(emailForCheckout)}
      >
        Become a Member
      </button>
      {pppCouponAvailable && pppCouponEligible && (
        <div className="mt-4 pb-5 max-w-screen-md mx-auto">
          <SmallParityCouponMessage
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

export default GoProCtaOverlay
