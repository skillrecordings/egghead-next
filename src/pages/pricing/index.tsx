import * as React from 'react'
import {FunctionComponent} from 'react'
import {track} from '@/utils/analytics'
import {useRouter} from 'next/router'
import Testimonials from '@/components/pricing/testimonials'
import testimonialsData from '@/components/pricing/testimonials/data'
import Layout from '@/components/app/layout'
import {NextSeo} from 'next-seo'
import PricingCard from '@/components/pricing/pricing-card'
import PricingProvider, {usePPP} from '@/components/pricing/pricing-provider'
import LifetimePriceProvider from '@/components/pricing/lifetime-price-provider'
import LifetimePriceCard from '@/components/pricing/lifetime-price-card'
import PlanTitle from '@/components/pricing/plan-title'
import PlanPrice from '@/components/pricing/plan-price'
import PlanFeatures from '@/components/pricing/plan-features'
import GetAccessButton from '@/components/pricing/get-access-button'
import PoweredByStripe from '@/components/pricing/powered-by-stripe'
import Countdown from '@/components/pricing/countdown'
import {PlanPrice as SubscriptionPlanPrice} from '@/components/pricing/select-plan-new'
import {useCommerceMachine} from '@/hooks/use-commerce-machine'
import {fromUnixTime} from 'date-fns'
import SelectPlanNew from '@/components/pricing/select-plan-new'
import ParityCouponMessage from '@/components/pricing/parity-coupon-message'
import {Coupon} from '@/types'

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

const Pricing: FunctionComponent<React.PropsWithChildren<PricingProps>> & {
  getLayout: any
} = () => {
  const router = useRouter()
  const {currentPlan} = useCommerceMachine()
  const {
    pppCouponIsApplied,
    pppCouponAvailable,
    pppCouponEligible,
    onApplyParityCoupon,
    onDismissParityCoupon,
    parityCoupon,
    countryName,
    appliedCoupon,
  } = usePPP()

  React.useEffect(() => {
    track('visited pricing')
    if (router?.query?.stripe === 'cancelled') {
      track('checkout: cancelled from stripe')
    }
  }, [])

  const displayPPPMessage = pppCouponAvailable && pppCouponEligible

  return (
    <>
      <div className="text-gray-900 dark:bg-gray-900 bg-gray-50 dark:text-white">
        <header className="container flex flex-col items-center py-16 mt-5 text-center">
          <h1 className="max-w-screen-lg text-2xl font-extrabold md:text-4xl leading-tighter">
            Stay Current with{' '}
            <span className="text-blue-600 dark:text-yellow-300">
              Modern Full-Stack Courses
            </span>{' '}
            for Professional Web Developers
          </h1>
          <h2 className="max-w-2xl pt-8 text-lg font-light leading-tight text-gray-700 dark:text-gray-200">
            Learn the skills you and your team need to build real-world business
            focused professional web applications.
          </h2>
        </header>
        <main className="container flex flex-col items-center">
          <div className="flex flex-col items-center">
            <div className="flex sm:flex-row flex-col items-center py-24 sm:space-x-5 sm:space-y-0 space-y-5">
              <PricingProvider>
                <PricingCard>
                  <SelectPlanNew />
                  {displayPPPMessage && (
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
                </PricingCard>
              </PricingProvider>
              <LifetimePriceProvider>
                <PricingCard>
                  <PlanTitle>Lifetime Membership</PlanTitle>
                  <div className="py-6">
                    <PlanPrice />
                  </div>
                  <PlanFeatures />
                  <GetAccessButton />
                </PricingCard>
              </LifetimePriceProvider>
            </div>
            <div className="flex sm:flex-row flex-col items-center py-24 sm:space-x-5 sm:space-y-0 space-y-5">
              <PoweredByStripe />
              <div className="text-sm">30 day money back guarantee</div>
            </div>
          </div>
          <Testimonials testimonials={testimonialsData} />
        </main>
      </div>
    </>
  )
}

Pricing.getLayout = (Page: any, pageProps: any) => {
  return (
    <Layout>
      <NextSeo
        title="Pricing"
        canonical={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/pricing`}
        openGraph={{
          url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/pricing`,
          site_name: 'egghead',
        }}
      />

      <Page {...pageProps} />
    </Layout>
  )
}

export default Pricing
