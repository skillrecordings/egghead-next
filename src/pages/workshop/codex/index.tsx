'use client'
import Layout from '@/components/app/layout'
import {NextSeo} from 'next-seo'
import Hero from '@/components/workshop/codex/hero'
import WhatYoullGet from '@/components/workshop/codex/what-youll-get'
import Curriculum from '@/components/workshop/codex/curriculum'
import Outcomes from '@/components/workshop/codex/outcomes'
import SignUpForm from '@/components/workshop/codex/signup-form'
import Testimonials from '@/components/workshop/codex/testimonials'
import ActiveSale from '@/components/workshop/codex/active-sale'
import CtaSection from '@/components/workshop/shared/cta-section'
import {trpc} from '@/app/_trpc/client'
import {useViewer} from '@/context/viewer-context'

const CODEX_WORKSHOP_SALE_FLAG = 'featureFlagCodexWorkshopSale'

const LIVE_WORKSHOP_FEATURES = [
  'Live Q&A with John Lindquist',
  'Context packaging for hard problems',
  'Terminal workflows for parallel agents',
  'Specialized planner, builder, researcher & validator agents',
  'Reusable skills, hooks, and tool profiles',
  'Build Codex into your own tools with the SDK',
]

const TEAM_WORKSHOP_FEATURES = [
  'Flexible scheduling',
  'Live Q&A with John Lindquist',
  'Context engineering for reliable AI results',
  'Terminal workflows for parallel specialized agents',
  'Reusable skills, hooks, and tool profiles',
  'Embed Codex into internal tools with the SDK',
]

const CodexWorkshopPage = () => {
  const {data: liveWorkshop, isLoading: isLiveWorkshopLoading} =
    trpc.featureFlag.getLiveWorkshop.useQuery({
      flag: CODEX_WORKSHOP_SALE_FLAG,
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

CodexWorkshopPage.getLayout = (Page: any, pageProps: any) => {
  return (
    <Layout>
      <NextSeo
        title="Become a Codex Power-User"
        description="Join John Lindquist for a hands-on, technical workshop to become a Codex power user — context engineering, terminal agent workflows, specialized agents, tools, automation, and the SDK."
        openGraph={{
          images: [
            {
              url: 'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1752842706/claude-code-card_at06to.png',
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

export default CodexWorkshopPage
