'use client'
import Layout from '@/components/app/layout'
import Hero from '@/components/workshop/cursor/Hero'
import Features from '@/components/workshop/cursor/Features'
import Instructor from '@/components/workshop/cursor/Instructor'
import SignUpForm from '@/components/workshop/cursor/SignUpForm'
import type {SignUpFormRef} from '@/components/workshop/cursor/Hero'
import type {GetServerSideProps} from 'next'
import {useRef} from 'react'
import {NextSeo} from 'next-seo'
import {getLastChargeForActiveSubscription} from '@/lib/subscriptions'
import ActiveSale from '@/components/workshop/cursor/active-sale'

import CtaSection from '@/components/workshop/cursor/cta-section'
import {useViewer} from '@/context/viewer-context'

export const TEAM_WORKSHOP_FEATURES = [
  'Flexible scheduling',
  'Live Q&A with John Lindquist',
  'Scope and plan work',
  'When and how to use MCP',
  'Effective cursor rules across teams and projects',
  'Build context for Agents',
]

const WorkshopPage = () => {
  const formRef = useRef<SignUpFormRef>(null)
  const {viewer} = useViewer()
  const isPro = viewer?.is_pro

  const saleisActive = true

  const LIVE_WORKSHOP_FEATURES = [
    'Live Q&A with John Lindquist',
    'Learn to prompt for developers',
    'Effective cursor rules used',
    'Build context for Agents',
    'When and how to use MCP',
    'Hour long break for lunch',
  ]

  const dateAndTime = {
    date: 'April 10, 2025',
    time: '9:00 AM - 2:00 PM (PDT)',
  }

  return (
    <main className="min-h-screen relative bg-white dark:bg-gray-900">
      <div className="relative">
        <div className="relative">
          <Hero
            formRef={formRef}
            saleisActive={saleisActive}
            dateAndTime={dateAndTime}
          />
          <Features />
        </div>
        {/* <WorkshopStructure /> */}

        <CtaSection
          saleisActive={saleisActive}
          ref={formRef}
          SaleClosedUi={<SignUpForm />}
          ActiveSaleUi={
            <ActiveSale
              isPro={isPro}
              workshopFeatures={LIVE_WORKSHOP_FEATURES}
              teamWorkshopFeatures={TEAM_WORKSHOP_FEATURES}
              dateAndTime={dateAndTime}
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
