import React, {FunctionComponent} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ProMemberFeatures from 'components/pro-member-features'
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
  >(viewer?.email ?? '')

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

  let primaryCtaText: string

  switch (true) {
    case !isEmpty(lesson.collection):
      primaryCtaText = `Level up with ${lesson.collection.title} right now.`
      break
    default:
      primaryCtaText = 'Ready to take your career to the next level?'
  }

  return (
    <div className="flex flex-col justify-center items-center w-full relative h-full">
      <div className="grid sm:grid-cols-2 grid-cols-1 p-4 sm:py-4 py-8 items-center max-w-screen-md sm:gap-16 gap-8">
        <form
          onSubmit={(_event) => {
            track('clicked join cta on blocked lesson', {
              lesson: lesson.slug,
              cta: primaryCtaText,
            })
            send({type: 'CONFIRM_PRICE', onClickCheckout})
          }}
          className="w-full h-full flex flex-col sm:items-stretch items-center"
        >
          <h2 className="text-xs uppercase leading-tighter tracking-wide font-medium text-center text-amber-400 pb-2">
            This lesson is for members only
          </h2>
          <h1 className="sm:text-2xl text-xl leading-tighter font-medium text-center sm:max-w-[17ch]">
            {primaryCtaText}
          </h1>
          <div className="flex w-full items-end justify-center py-5">
            <PlanPrice pricesLoading={pricesLoading} plan={currentPlan} />
            {!pricesLoading && <span className="pl-1 sm:text-lg">/ month</span>}
          </div>
          {isEmpty(viewer) && (
            <div className="relative flex items-center w-full text-gray-400 dark:text-white">
              <svg
                className="absolute w-5 h-5 left-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <input
                id="email"
                type="email"
                value={emailForCheckout}
                onChange={(e) => {
                  setEmailForCheckout(e.target.value)
                }}
                placeholder="you@company.com"
                className="block w-full py-3 pl-10 placeholder-gray-400 dark:bg-black bg-opacity-20 border-gray-600 rounded-md shadow-sm dark:text-white text-black focus:ring-indigo-500 focus:border-blue-500"
                required
              />
            </div>
          )}
          <button
            className="px-10 py-4 mt-5 font-medium text-center text-white transition-all duration-300 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700 hover:scale-105"
            type="submit"
          >
            Access this Course
          </button>
          <div className="flex justify-center">
            <Link href="/pricing" passHref>
              <a className="text-xs flex items-center group mt-4 py-1 opacity-80 hover:opacity-100 ease-in-out duration-200 transition-all">
                Pay yearly or quarterly{' '}
                <i
                  className="gg-arrow-right scale-75 group-hover:translate-x-1 transition-all ease-in-out duration-200"
                  aria-hidden
                />
              </a>
            </Link>
          </div>
        </form>
        <div className="w-full flex flex-col h-full">
          <ProMemberFeatures />
          <figure className="mt-5 py-2">
            <blockquote className="text-light italic opacity-80">
              ”Just following along with egghead tutorials, I got a new job and
              am now able to write an open source library.“
            </blockquote>
            <figcaption className="flex items-center text-sm italic opacity-50 pt-1">
              — Zhentian Wan
            </figcaption>
          </figure>
        </div>
      </div>
      {pppCouponAvailable && pppCouponEligible && (
        <div className="sm:p-5 xl:absolute bottom-0 max-w-screen-lg w-full">
          <SmallParityCouponMessage
            isLoading={pricesLoading}
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
