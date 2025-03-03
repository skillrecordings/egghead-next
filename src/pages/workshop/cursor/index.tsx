'use client'
import Layout from '@/components/app/layout'
import Hero from '@/components/workshop/cursor/Hero'
import Features from '@/components/workshop/cursor/Features'
import WorkshopStructure from '@/components/workshop/cursor/WorkshopStructure'
import Instructor from '@/components/workshop/cursor/Instructor'
import SignUpForm from '@/components/workshop/cursor/SignUpForm'
import type {SignUpFormRef} from '@/components/workshop/cursor/Hero'
import type {GetServerSideProps, NextPage} from 'next'
import {useRef} from 'react'
import {NextSeo} from 'next-seo'
import {getLastChargeForActiveSubscription} from '@/lib/subscriptions'

import CtaSection from '@/components/workshop/cursor/cta-section'
import ActiveSale from '@/components/pricing/workshop/active-sale'

const WorkshopPage = ({
  getLayout,
  lastCharge,
}: {
  getLayout: any
  lastCharge: {
    amountPaid: number
    stripeCustomerId: string
    accountId: string
    userId: string
  }
}) => {
  const formRef = useRef<SignUpFormRef>(null)

  const saleisActive = true
  const LIVE_WORKSHOP_STRIPE_PRICE_ID =
    process.env.NEXT_PUBLIC_LIVE_WORKSHOP_STRIPE_PRICE_ID!
  const LIVE_WORKSHOP_TITLE = 'Accelerate your workflow with Cursor'
  const LIVE_WORKSHOP_PLAN = {
    price: 149,
    price_discounted: 90,
  }
  const LIVE_WORKSHOP_FEATURES = [
    'Live Q&A with John Lindquist',
    'Prompt and .cursorrules used by John Lindquist',
    'Full day of intensive training',
    'Hour long break for lunch',
    'Access to the workshop recording',
  ]

  return (
    <main className="min-h-screen relative bg-white dark:bg-gray-900">
      <div className="relative">
        <div className="relative">
          <Hero formRef={formRef} saleisActive={saleisActive} />
          <Features />
        </div>
        {/* <WorkshopStructure /> */}

        <CtaSection
          saleisActive={saleisActive}
          ref={formRef}
          SaleClosedUi={<SignUpForm />}
          ActiveSaleUi={
            <ActiveSale
              lastCharge={lastCharge}
              priceId={LIVE_WORKSHOP_STRIPE_PRICE_ID}
              title={LIVE_WORKSHOP_TITLE}
              plan={LIVE_WORKSHOP_PLAN}
              workshopFeatures={LIVE_WORKSHOP_FEATURES}
            />
          }
        />
        <div className="relative">
          <Instructor />
        </div>
      </div>
    </main>
  )
}

WorkshopPage.getLayout = (Page: any, pageProps: any) => {
  return (
    <Layout>
      <NextSeo
        title="Accelerate your development with Cursor"
        description="Join John Lindquist for an immersive workshop designed to help you conquer the frustration of getting stuck with complex AI tools."
        openGraph={{
          images: [
            {
              url: 'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1739448881/cursor-workshop-card_2x_mibay4.jpg',
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const ehUser = JSON.parse(ctx.req.cookies.eh_user || '{}')
  const authToken = ctx.req.cookies['eh_token_2020_11_22']
  console.log('ehUser', ehUser)

  if (!authToken) return {props: {}}

  const lastCharge = await getLastChargeForActiveSubscription(
    ehUser.email,
    authToken,
  )

  return {
    props: {
      lastCharge: lastCharge || null,
    },
  }
}

export default WorkshopPage
