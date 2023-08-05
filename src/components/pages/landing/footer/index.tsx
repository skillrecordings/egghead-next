import * as React from 'react'
import Link from 'next/link'
import {isEmpty, get, first} from 'lodash'
import toast from 'react-hot-toast'
import axios from 'axios'
import * as Yup from 'yup'
import {FormikProps, useFormik} from 'formik'
import {useCommerceMachine} from 'hooks/use-commerce-machine'
import {track} from 'utils/analytics'
import emailIsValid from 'utils/email-is-valid'
import {useViewer} from 'context/viewer-context'
import ParityCouponMessage from 'components/pricing/parity-coupon-message'
import {PlanPrice} from 'components/pricing/select-plan-new/index'
import {Coupon, StripeAccount} from 'types'
import stripeCheckoutRedirect from 'api/stripe/stripe-checkout-redirect'
import Countdown from 'components/pricing/countdown'
import {fromUnixTime} from 'date-fns'
import Join from '../join'
import Browse from '../browse'
import {useTheme} from 'next-themes'
import {isMember} from '../../../../utils/is-member'
import CreateAccount from '../create-account'
import title from 'title'

type FormikValues = {
  email: string
}

const PricingCta = () => {
  const {viewer, authToken} = useViewer()
  const {state, send, priceId, quantity, availableCoupons, currentPlan} =
    useCommerceMachine({initialPlan: 'monthlyPrice'})

  const formik: FormikProps<FormikValues> = useFormik<FormikValues>({
    initialValues: {
      email: viewer?.email ?? '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
    }),
    onSubmit: async () => {
      track('checkout: submit email on signup page', {location: 'signup page'})
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
    if (!formik.values.email) return

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

        track('checkout: existing pro account found', {
          email: formik.values.email,
          location: 'signup page',
        })

        // email is already associated with a pro account, return early instead
        // of sending the user to a Stripe Checkout Session.
        return
      }
    }

    if (emailIsValid(formik.values.email)) {
      await track('checkout: valid email present', {
        priceId: priceId,
        location: 'signup page',
      })
      await track('checkout: redirect to stripe', {
        priceId,
        location: 'signup page',
      })

      stripeCheckoutRedirect({
        priceId,
        email: formik.values.email,
        authToken,
        quantity,
        coupon: state.context.couponToApply?.couponCode,
      })
    } else {
      // we don't have a valid email for the checkout
      await track('checkout: unable to proceed, no valid email', {
        email: formik.values.email,
        location: 'signup page',
      })
    }
  }
  return (
    <div className="flex flex-col items-center w-full max-w-screen-sm">
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col items-center w-full h-full"
      >
        <h1 className="sm:text-2xl text-xl leading-tighter font-medium text-center sm:max-w-[17ch]">
          Ready to take your career to the next level?
        </h1>
        <div className="w-full max-w-md">
          {!pppCouponIsApplied &&
            !pricesLoading &&
            appliedCoupon?.coupon_expires_at && (
              <div className="w-full max-w-xs mx-auto">
                <Countdown
                  label="Save 40% on Yearly Memberships Price goes up in:"
                  date={fromUnixTime(appliedCoupon.coupon_expires_at)}
                />
              </div>
            )}
          <div className="flex items-end justify-center w-full py-5">
            <PlanPrice pricesLoading={pricesLoading} plan={currentPlan} />
            {!pricesLoading && <span className="pl-1 sm:text-lg">/ month</span>}
          </div>
          <div className="flex flex-col space-y-5 sm:flex-row sm:space-y-0">
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
                className="block w-full py-3 pl-10 text-black placeholder-gray-400 border-gray-300 rounded-md shadow-sm dark:border-gray-700 sm:rounded-r-none dark:bg-black bg-opacity-20 dark:text-white focus:ring-indigo-500 focus:border-blue-500 sm:border-r-0"
                required
              />
            </div>
            <button
              className="px-6 py-3 font-medium text-center text-white transition-all duration-300 ease-in-out bg-blue-600 rounded-md whitespace-nowrap hover:bg-blue-700 hover:scale-105 sm:border-l-0 sm:rounded-l-none"
              type="submit"
            >
              Become a Member
            </button>
          </div>
        </div>

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
        <ParityCouponMessage
          coupon={parityCoupon as Coupon}
          countryName={countryName as string}
          onApply={onApplyParityCoupon}
          onDismiss={onDismissParityCoupon}
          isPPP={pppCouponIsApplied}
          reduced
        />
      )}
    </div>
  )
}

const ProvideEmail: React.FC<React.PropsWithChildren<{topic?: string}>> = ({
  topic,
}) => (
  <div>
    <h2 className="text-xl py-12">Get Notified of New egghead Courses</h2>
    <CreateAccount location="homepage header" />
    <p className="max-w-sm pt-10 text-xs text-left sm:text-sm opacity-60">
      Enter your email to create an account and start learning from more than
      3,000 free {title(topic?.replace('_', ' ') ?? 'Full Stack')} lessons on
      egghead.
    </p>
  </div>
)

const Footer: React.FC<React.PropsWithChildren<{topic?: string}>> = ({
  topic,
}) => {
  const {viewer} = useViewer()
  const userPresent = Boolean(viewer)
  const userIsNonMember = userPresent && !isMember(viewer)

  let Offer = Browse
  //
  // switch (true) {
  //   case userIsNonMember:
  //     Offer = Join
  //     break
  //   case userPresent:
  //     Offer = Browse
  //     break
  //   default:
  //     Offer = ProvideEmail
  // }

  return (
    <section className="sm:min-h-[30vh] relative w-full flex flex-col items-center justify-center sm:py-32 py-24 px-5">
      <Offer topic={topic} />
    </section>
  )
}

export default Footer
