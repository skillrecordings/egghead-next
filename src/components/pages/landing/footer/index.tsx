import * as React from 'react'
import Link from 'next/link'
import {isEmpty, get, first} from 'lodash'
import toast from 'react-hot-toast'
import axios from 'axios'
import * as Yup from 'yup'
import {FormikProps, useFormik} from 'formik'
import {useCommerceMachine} from 'hooks/use-commerce-machine'
import {Coupon} from 'machines/commerce-machine'
import {track} from 'utils/analytics'
import emailIsValid from 'utils/email-is-valid'
import {useViewer} from 'context/viewer-context'

import SmallParityCouponMessage from 'components/pricing/small-parity-coupon-message'
import {PlanPrice} from 'components/pricing/select-plan-new/index'
import {StripeAccount} from 'types'
import stripeCheckoutRedirect from 'api/stripe/stripe-checkout-redirect'

import Join from '../join'
import PricingWidget from 'components/pricing/pricing-widget'
import CreateAccount from '../create-account'

type FormikValues = {
  email: string
}

const PricingCta = () => {
  const {viewer, authToken} = useViewer()
  const {state, send, priceId, quantity, availableCoupons, currentPlan} =
    useCommerceMachine({initialPlan: 'monthlyPrice'})

  let primaryCtaText: string

  const formik: FormikProps<FormikValues> = useFormik<FormikValues>({
    initialValues: {
      email: viewer?.email ?? '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
    }),
    onSubmit: async () => {
      track('clicked join cta on signup page', {
        cta: primaryCtaText,
      })
      send({type: 'CONFIRM_PRICE', onClickCheckout})
    },
  })

  React.useEffect(() => {
    if (!isEmpty(viewer?.email)) {
      formik.setFieldValue('email', viewer.email)
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
    if (!formik.values.email) return

    const account = first<StripeAccount>(get(viewer, 'accounts'))
    await track('checkout: selected plan', {
      priceId: priceId,
    })

    const emailRequiresAProCheck =
      !isEmpty(formik.values.email) && formik.values.email !== viewer?.email

    if (emailRequiresAProCheck) {
      const {hasProAccess} = await axios
        .post(`/api/users/check-pro-status`, {
          email: formik.values.email,
        })
        .then(({data}) => data)

      if (hasProAccess) {
        const message = `You've already got a pro account at ${formik.values.email}. Please sign in.`

        toast.error(message, {
          duration: 6000,
          icon: '❌',
        })

        track('cta overlay checkout: existing pro account found', {
          email: formik.values.email,
        })

        // email is already associated with a pro account, return early instead
        // of sending the user to a Stripe Checkout Session.
        return
      }
    }

    if (emailIsValid(formik.values.email)) {
      await track('checkout: valid email present', {
        priceId: priceId,
      })
      await track('checkout: redirect to stripe', {
        priceId,
      })

      stripeCheckoutRedirect({
        priceId,
        email: formik.values.email,
        stripeCustomerId: account?.stripe_customer_id,
        authToken,
        quantity,
        coupon: state.context.couponToApply?.couponCode,
      })
    } else {
      // we don't have a valid email for the checkout
      await track('checkout: unable to proceed, no valid email', {
        email: formik.values.email,
      })
    }
  }
  return (
    <div className="grid items-center max-w-screen-md grid-cols-1 gap-8 p-4 py-8 sm:grid-cols-2 sm:py-4 sm:gap-16">
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col items-center w-full h-full sm:items-stretch"
      >
        <h2 className="pb-2 text-xs font-medium tracking-wide text-center uppercase leading-tighter text-amber-400">
          This lesson is for members only
        </h2>
        <h1 className="sm:text-2xl text-xl leading-tighter font-medium text-center sm:max-w-[17ch]">
          Become a member
        </h1>
        <div className="flex items-end justify-center w-full py-5">
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
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="you@company.com"
              className="block w-full py-3 pl-10 text-black placeholder-gray-400 border-gray-600 rounded-md shadow-sm dark:bg-black bg-opacity-20 dark:text-white focus:ring-indigo-500 focus:border-blue-500"
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
            <a className="flex items-center py-1 mt-4 text-xs transition-all duration-200 ease-in-out group opacity-80 hover:opacity-100">
              Pay yearly or quarterly{' '}
              <i
                className="transition-all duration-200 ease-in-out scale-75 gg-arrow-right group-hover:translate-x-1"
                aria-hidden
              />
            </a>
          </Link>
        </div>
      </form>
      {pppCouponAvailable && pppCouponEligible && (
        <div className="bottom-0 w-full max-w-screen-lg sm:p-5 xl:absolute">
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

const FreeAccount = () => {
  return (
    <div>
      <h3 className="text-xl font-medium text-center">Create free account</h3>
      <p className="pb-8 text-center opacity-80">
        Start learning from hundreds of free lessons
      </p>
      <CreateAccount
        actionLabel="Create free account"
        location="homepage footer"
      />
    </div>
  )
}

const Footer = () => {
  const {viewer} = useViewer()
  return (
    <section className="flex flex-col items-center justify-center w-full max-w-screen-lg py-12 mx-auto md:flex-row sm:py-24">
      {/* {viewer ? (
        <PricingWidget />
      ) : (
        <>
          <FreeAccount />
          <hr className="md:px-16 md:my-0 my-12 w-full max-w-[60px] md:rotate-90 dark:border-gray-800 border-gray-100" />
          <Join />
        </>
      )} */}
      <PricingCta />
    </section>
  )
}

export default Footer
