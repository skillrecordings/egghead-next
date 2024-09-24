import * as React from 'react'
import {FunctionComponent} from 'react'
import {track} from '@/utils/analytics'
import {useRouter} from 'next/router'
import Testimonials from '@/components/pricing/testimonials'
import testimonialsData from '@/components/pricing/testimonials/data'
import LifetimePricingWidget from '@/components/pricing/lifetime-pricing-widget'
import Layout from '@/components/app/layout'
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

const Forever: FunctionComponent<React.PropsWithChildren<PricingProps>> & {
  getLayout: any
} = () => {
  const router = useRouter()

  React.useEffect(() => {
    track('visited lifetime membership')
    if (router?.query?.stripe === 'cancelled') {
      track('lifetime checkout: cancelled from stripe')
    }
  }, [])

  return (
    <>
      <div className="text-gray-900 dark:bg-gray-900 bg-gray-50 dark:text-white">
        <header className="container flex flex-col items-center py-16 mt-5 text-center">
          <h2 className="max-w-2xl pt-8 text-lg font-light leading-tight text-gray-700 dark:text-gray-200">
            egghead lifetime membership
          </h2>
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

          <article className="prose text-left max-w-2xl dark:prose-invert pt-12">
            <p>
              Your time is precious. You don't need another 40 hour course to
              slog through just to have one or two 'aha' moments.
            </p>
            <p>
              egghead keeps courses scoped to a specific goal you have like:
              <ul>
                <li>learn the latest JavaScript features</li>
                <li>build modern state solutions in Angular</li>
                <li>create a full stack solution for Ecommerce</li>
              </ul>
              You'll be guided through the key concepts and skills you need to
              build the application you've been dreaming of.
            </p>
            <p>
              This lets you start buildingsooner which means your learning will
              truly stick, no more spinning your wheels on more tutorials.
            </p>
            <p>
              When you're ready to lean another skill, egghead is here to
              support your journey, now for the rest of your life.
            </p>
            <p>
              For the price of 2 years of egghead, you get a membership{' '}
              <em>forever</em>.
            </p>
          </article>
        </header>
        <main className="container flex flex-col items-center">
          <LifetimePricingWidget />
          <Testimonials testimonials={testimonialsData} />
        </main>
      </div>
    </>
  )
}

Forever.getLayout = (Page: any, pageProps: any) => {
  return (
    <Layout>
      <NextSeo
        title="Lifetime Membership"
        canonical={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/forever`}
        openGraph={{
          url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/forever`,
          site_name: 'egghead',
        }}
      />

      <Page {...pageProps} />
    </Layout>
  )
}

export default Forever
