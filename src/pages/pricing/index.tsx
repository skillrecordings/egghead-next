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
import PlanTitle from '@/components/pricing/plan-title'
import PlanPrice from '@/components/pricing/plan-price'
import PlanFeatures from '@/components/pricing/plan-features'
import GetAccessButton from '@/components/pricing/get-access-button'
import PoweredByStripe from '@/components/pricing/powered-by-stripe'
import SelectPlanNew from '@/components/pricing/select-plan-new'
import ParityCouponMessage from '@/components/pricing/parity-coupon-message'
import {Coupon} from '@/types'
import {PopupButton} from '@typeform/embed-react'

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

const TeamContactCard = () => {
  return (
    <PricingCard className="mt-24 order-3">
      <div className="min-w-[300px] h-full">
        <div className="text-center">
          <PlanTitle className="text-center">Enterprise</PlanTitle>
          <p className="pt-4 self-stretch text-3xl font-extrabold ">
            For Teams
          </p>
          <p className="font-bold text-xl">of 20+</p>
        </div>
        <div className="justify-center my-6 w-full">
          <PopupButton
            className="w-full px-5 py-2 h-[60px] flex justify-center items-center font-semibold text-center text-white transition-all duration-300 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700 hover:scale-105"
            id="JWBc8Ohx"
            size={60}
          >
            Contact Us
          </PopupButton>
        </div>
        <div>
          <PlanFeatures
            planFeatures={[
              '20+ Seats',
              'Custom Learning Paths',
              'Onboarding Call',
              'Bulk Discounts',
              'Discounted Lifetime Licenses',
            ]}
          />
        </div>
      </div>
    </PricingCard>
  )
}

const Pricing: FunctionComponent<React.PropsWithChildren<PricingProps>> & {
  getLayout: any
} = () => {
  const router = useRouter()
  const {
    pppCouponIsApplied,
    pppCouponAvailable,
    pppCouponEligible,
    onApplyParityCoupon,
    onDismissParityCoupon,
    parityCoupon,
    countryName,
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
            <div className="flex sm:flex-row flex-col sm:mt-24">
              <PricingProvider>
                <PricingCard className="sm:order-1 order-2 opacity-90 hover:opacity-100 min-w-[300px] h-full mt-12">
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
                <PricingCard
                  className="sm:order-2 order-1 sm:scale-110 min-w-[300px] z-30 drop-shadow-2xl"
                  displayImage
                >
                  <div className="flex flex-col h-full">
                    <div className="flex flex-col items-center pt-12 pb-6">
                      <div className="bg-gray-100 py-1 px-3 text-xs rounded-full font-medium dark:bg-gray-700 mb-1">
                        BEST VALUE
                      </div>
                      <PlanTitle className="text-2xl">
                        Lifetime Membership
                      </PlanTitle>
                      <div className="pt-6">
                        <PlanPrice />
                      </div>
                      <GetAccessButton
                        className="bg-yellow-300 text-black"
                        hoverClassName="hover:bg-yellow-400 hover:scale-105"
                      />
                    </div>
                    <PlanFeatures
                      numberOfHighlightedFeatures={3}
                      highlightHexColor="#FDE046"
                    />
                  </div>
                </PricingCard>
              </LifetimePriceProvider>
              <TeamContactCard />
              <div className="w-0 h-0"></div>
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
