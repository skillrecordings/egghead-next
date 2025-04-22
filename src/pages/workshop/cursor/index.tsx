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
import {trpc} from '@/app/_trpc/client'
import Markdown from '@/components/markdown'
import Image from 'next/image'
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
  const {data: workshopDateAndTime} =
    trpc.featureFlag.getWorkshopDateAndTime.useQuery({
      flag: 'featureFlagCursorWorkshopSale',
    })
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

  return (
    <main className="min-h-screen relative bg-white dark:bg-gray-900">
      <div className="relative">
        <div className="relative">
          <Hero
            formRef={formRef}
            saleisActive={saleisActive}
            dateAndTime={workshopDateAndTime}
          />
          <section className="z-10 relative">
            <h2 className="mb-5 lg:text-3xl sm:text-2xl text-xl font-bold dark:text-white text-center">
              Keeping Up with Rapid AI Tool Changes is Exhausting
            </h2>
            <Markdown className="prose dark:text-white  text-lg leading-snug mx-auto">
              {`The AI development landscape shifts daily.

New models drop (Gemini 2.5-flash, o3) every week along side new agent-powered IDEs, new tools, and new 'best practices'.

It feels impossible to keep up, let alone know if you're using these powerful tools effectively.

Whether you use Cursor, WindSurf, GitHub Copilot Workspace, Codeium or the next hot thing, you want to make certain you are using your tools to the best of their ability.           
            `}
            </Markdown>
            <h2 className="my-5 lg:text-3xl sm:text-2xl text-xl font-bold dark:text-white text-center">
              Don't Learn Tools, Learn the Right Workflows
            </h2>
            <Markdown className="prose dark:text-white  text-lg leading-snug mx-auto">
              {`This workshop takes into account the rapid changes in AI development.

You learn the fundamental principles and repeatable workflows that John has used to successfully build with AI regardless of the tool you use.

You will understand agent behavior, tool calls, and context limitations which are the building blocks that explain why tools succeed or fail, independent of updates.

We've all had AI tools fail unexpectedly or get stuck in a loop wasting time (and your prompt credits) debugging an error it has no business touching or no idea how to solve.

You'll learn to identify signals that your tools are stuck in a loop and failing and proactively prevent these from happening through thought-out plans and the right amount of context for the task at hand.

After the workshop, you'll have a clear, sustainable process for leveraging AI coding tools effectively, saving you time and reducing the anxiety of constantly needing to 'catch up'.

This workshop is taught using Cursor, but the principles and workflows taught are applicable to any AI coding tool.
            `}
            </Markdown>
            <Image
              src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1745339467/cursor-workshop/cursor-workshop-screenshot.png"
              className="w-full lg:max-w-screen-lg max-w-[90vw] mx-auto py-10"
              loading="eager"
              quality={100}
              alt="Total TypeScript screenshots"
              width={3825}
              height={2511}
            />
            <h2 className="my-5 lg:text-3xl sm:text-2xl text-xl font-bold dark:text-white text-center">
              Productive AI Development on a Team
            </h2>
            <Markdown className="prose dark:text-white  text-lg leading-snug mx-auto">
              {`Trying to use Cursor or other AI tools on your team projects feels daunting, even impossible. 

You know you need to feed Cursor enough context to be useful but inevitably you end up pasting thousands of lines of code or hitting token limit. 

Just asking your tools to 'fix bug #1234' or 'add the new reporting feature' in a massive codebase results in garbage output, irrelevant changes, and the AI confidently modifying completely unrelated files.

You'll learn how to curate agent context to pinpoint the exact code you need for specific tasks as well as how to use Git with AI to revert any changes that get out of hand.

For larger features, refactors, or fixes, you'll learn how to build acceptance criteria for the AI to build a plan around to effectively implement the task at hand.

By the end of the workshop, you'll gain the skills needed to confidently use AI for targeted refactors, feature implementation, and bug fixes.
            `}
            </Markdown>
          </section>
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
              dateAndTime={workshopDateAndTime}
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
