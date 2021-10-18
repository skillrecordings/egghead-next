import * as React from 'react'
import {FunctionComponent} from 'react'
import {useViewer} from 'context/viewer-context'
import stripeCheckoutRedirect from 'api/stripe/stripe-checkout-redirect'
import emailIsValid from 'utils/email-is-valid'
import {track} from 'utils/analytics'
// TODO: Remove usePricing from here, stories, and impl
import {usePricing} from 'hooks/use-pricing'
import {useCommerceMachine} from 'hooks/use-commerce-machine'
import {first, get} from 'lodash'
import {StripeAccount} from 'types'
import {useRouter} from 'next/router'
import SelectPlanNew from 'components/pricing/select-plan-new'
import PoweredByStripe from 'components/pricing/powered-by-stripe'
import Testimonials from 'components/pricing/testimonials'
import testimonialsData from 'components/pricing/testimonials/data'
import ParityCouponMessage from 'components/pricing/parity-coupon-message'
import isEmpty from 'lodash/isEmpty'
import {Coupon} from 'machines/commerce-machine'

type PricingProps = {
  annualPrice: {
    id: string
    recurring: {
      interval: 'year'
    }
    unit_amount: number
  }
  redirectURL?: string
}

const Pricing: FunctionComponent<PricingProps> & {getLayout: any} = () => {
  const {viewer, authToken} = useViewer()
  const router = useRouter()

  React.useEffect(() => {
    track('visited pricing')
    if (router?.query?.stripe === 'cancelled') {
      track('checkout: cancelled from stripe')
    }
  }, [])

  const {state, send, priceId, quantity, prices, availableCoupons} =
    useCommerceMachine()

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

  // handlers
  const onApplyParityCoupon = () => {
    send('APPLY_PPP_COUPON')
  }

  const onDismissParityCoupon = () => {
    send('REMOVE_PPP_COUPON')
  }

  const onClickCheckout = async () => {
    if (!priceId) return
    const account = first<StripeAccount>(get(viewer, 'accounts'))
    await track('checkout: selected plan', {
      priceId: priceId,
    })

    if (emailIsValid(viewer?.email)) {
      await track('checkout: valid email present', {
        priceId: priceId,
      })
      await track('checkout: redirect to stripe', {
        priceId,
      })
      stripeCheckoutRedirect({
        priceId,
        email: viewer.email,
        stripeCustomerId: account?.stripe_customer_id,
        authToken,
        quantity,
        coupon: state.context.couponToApply?.couponCode,
      })
    } else {
      await track('checkout: get email', {
        priceId: priceId,
      })
      router.push({
        pathname: '/pricing/email',
        query: {
          priceId,
          quantity,
          coupon: state.context.couponToApply?.couponCode,
        },
      })
    }
  }

  return (
    <>
      <div className="dark:bg-gray-900 bg-gray-50 dark:text-white text-gray-900 px-5">
        <header className="text-center py-16 flex flex-col items-center">
          <h1 className="md:text-4xl text-2xl font-extrabold leading-tighter max-w-screen-md">
            Build your Developer Project Portfolio and{' '}
            <span className="dark:text-yellow-300 text-yellow-500">
              Get a Better Job
            </span>{' '}
            as a Web Developer
          </h1>
          <h2 className="text-lg font-light max-w-2xl pt-8 leading-tight dark:text-gray-200 text-gray-700">
            Learn the skills you need to advance your career and build
            real-world business focused professional projects on the job and for
            your portfolio
          </h2>
        </header>
        <main className="flex flex-col items-center">
          <div className="p-2 relative dark:bg-gray-800 bg-gray-100 rounded-md dark:shadow-none shadow-lg">
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
            />
          </div>
          {pppCouponAvailable && pppCouponEligible && (
            <div className="mt-4 pb-5 max-w-screen-sm mx-auto">
              <ParityCouponMessage
                coupon={parityCoupon as Coupon}
                countryName={countryName as string}
                onApply={onApplyParityCoupon}
                onDismiss={onDismissParityCoupon}
                isPPP={pppCouponIsApplied}
              />
            </div>
          )}
          <div className="py-24 flex items-center space-x-5">
            <PoweredByStripe />
            <div className="text-sm">30 day money back guarantee</div>
          </div>
          <Testimonials testimonials={testimonialsData} />
        </main>
      </div>
    </>
  )
}

Pricing.getLayout = (Page: any, pageProps: any) => {
  return <Page {...pageProps} />
}

export default Pricing
