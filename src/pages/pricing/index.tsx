import * as React from 'react'
import {FunctionComponent} from 'react'
import {track} from 'utils/analytics'
import {useRouter} from 'next/router'
import Testimonials from 'components/pricing/testimonials'
import testimonialsData from 'components/pricing/testimonials/data'
import PricingWidget from 'components/pricing/pricing-widget'
import Layout from 'components/app/layout'
import {NextSeo} from 'next-seo'

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
  const router = useRouter()

  React.useEffect(() => {
    track('visited pricing')
    if (router?.query?.stripe === 'cancelled') {
      track('checkout: cancelled from stripe')
    }
  }, [])

  return (
    <>
      <div className="text-gray-900 dark:bg-gray-900 bg-gray-50 dark:text-white">
        <header className="container flex flex-col items-center py-16 mt-5 text-center">
          <h1 className="max-w-screen-md text-2xl font-extrabold md:text-4xl leading-tighter">
            Build your Developer Project Portfolio and{' '}
            <span className="text-blue-600 dark:text-yellow-300">
              Get a Better Job
            </span>{' '}
            as a Web Developer
          </h1>
          <h2 className="max-w-2xl pt-8 text-lg font-light leading-tight text-gray-700 dark:text-gray-200">
            Learn the skills you need to advance your career and build
            real-world business focused professional projects on the job and for
            your portfolio
          </h2>
        </header>
        <main className="container flex flex-col items-center">
          <PricingWidget />
          <Testimonials testimonials={testimonialsData} />
        </main>
      </div>
    </>
  )
}

Pricing.getLayout = (Page: any, pageProps: any) => {
  return (
    <Layout>
      <NextSeo title="Pricing" />
      <Page {...pageProps} />
    </Layout>
  )
}

export default Pricing
