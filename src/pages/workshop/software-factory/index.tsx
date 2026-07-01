'use client'
import Layout from '@/components/app/layout'
import {NextSeo} from 'next-seo'
import Hero from '@/components/workshop/software-factory/hero'
import WhatYoullGet from '@/components/workshop/software-factory/what-youll-get'
import Curriculum from '@/components/workshop/software-factory/curriculum'
import Outcomes from '@/components/workshop/software-factory/outcomes'
import SignUpForm from '@/components/workshop/software-factory/signup-form'
import Testimonials from '@/components/workshop/software-factory/testimonials'
import ActiveSale from '@/components/workshop/software-factory/active-sale'
import CtaSection from '@/components/workshop/shared/cta-section'
import {trpc} from '@/app/_trpc/client'
import {useViewer} from '@/context/viewer-context'

const SOFTWARE_FACTORY_WORKSHOP_SALE_FLAG =
  'featureFlagSoftwareFactoryWorkshopSale'

const LIVE_WORKSHOP_FEATURES = [
  'Live Q&A with John Lindquist',
  'Context packaging for hard problems',
  'Terminal workflows for parallel agents',
  'Specialized planner, builder, researcher & validator agents',
  'Reusable skills, hooks, and tool profiles',
  'Build agents into your own tools with the Claude Code and Codex SDKs',
]

const TEAM_WORKSHOP_FEATURES = [
  'Flexible scheduling',
  'Live Q&A with John Lindquist',
  'Context engineering for reliable AI results',
  'Terminal workflows for parallel specialized agents',
  'Reusable skills, hooks, and tool profiles',
  'Embed agents into internal tools with the Claude Code and Codex SDKs',
]

const SoftwareFactoryWorkshopPage = () => {
  const {data: liveWorkshop, isLoading: isLiveWorkshopLoading} =
    trpc.featureFlag.getLiveWorkshop.useQuery({
      flag: SOFTWARE_FACTORY_WORKSHOP_SALE_FLAG,
    })

  const {viewer} = useViewer()

  const {data: subscription} = trpc.stripe.getSubscription.useQuery({
    subscriptionId:
      viewer?.accounts[0]?.subscriptions[0]?.stripe_subscription_id,
  })

  const isLifetimeSubscriber = viewer?.roles?.includes('lifetime_subscriber')
  const subscriptionInterval = subscription?.items?.data?.[0]?.plan?.interval
  const subscriptionIntervalCount =
    subscription?.items?.data?.[0]?.plan?.interval_count
  const isYearlyPro = subscriptionInterval === 'year'
  const isMonthlyOrQuarterlyPro =
    subscriptionInterval === 'month' &&
    (subscriptionIntervalCount === 1 || subscriptionIntervalCount === 3)
  const hasYearlyProDiscount = isLifetimeSubscriber || isYearlyPro

  const saleisActive = liveWorkshop?.isSaleLive ?? false

  return (
    <main className="relative min-h-screen bg-white dark:bg-gray-900">
      <Hero />
      <div className="space-y-20 pb-16 sm:space-y-28 sm:pb-24">
        <WhatYoullGet />
        <Testimonials />
        <Curriculum />
        <Outcomes />
      </div>

      <CtaSection
        saleisActive={saleisActive}
        SaleClosedUi={<SignUpForm />}
        ActiveSaleUi={
          <ActiveSale
            hasYearlyProDiscount={hasYearlyProDiscount}
            isMonthlyOrQuarterly={isMonthlyOrQuarterlyPro}
            workshopFeatures={LIVE_WORKSHOP_FEATURES}
            teamWorkshopFeatures={TEAM_WORKSHOP_FEATURES}
            workshop={liveWorkshop}
            isLiveWorkshopLoading={isLiveWorkshopLoading}
          />
        }
      />
    </main>
  )
}

SoftwareFactoryWorkshopPage.getLayout = (Page: any, pageProps: any) => {
  return (
    <Layout>
      <NextSeo
        title="Agentic Software Factory Workshop — Build Your AI Agent Factory"
        description="Join John Lindquist for a hands-on, technical workshop to build your own factory of specialized AI coding agents with Claude Code and Codex — context engineering, terminal agent workflows, specialized planner, builder, researcher & validator agents, tools, automation, and the SDKs."
        openGraph={{
          images: [
            {
              url: 'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1780700160/codex-workshop/card--_2x_1.png',
              width: 1200,
              height: 630,
            },
          ],
        }}
      />
      <Page {...pageProps} />
    </Layout>
  )
}

export default SoftwareFactoryWorkshopPage
