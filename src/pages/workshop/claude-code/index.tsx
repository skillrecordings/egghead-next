'use client'
import Layout from '@/components/app/layout'
import Hero from '@/components/workshop/claude-code/Hero'
import Instructor from '@/components/workshop/shared/Instructor'
import SignUpForm from '@/components/workshop/claude-code/SignUpForm'
import type {SignUpFormRef} from '@/components/workshop/claude-code/Hero'
import type {GetServerSideProps} from 'next'
import {useRef, useEffect, useState} from 'react'
import {NextSeo} from 'next-seo'
import {getLastChargeForActiveSubscription} from '@/lib/subscriptions'
import ActiveSale from '@/components/workshop/claude-code/active-sale'

import CtaSection from '@/components/workshop/shared/cta-section'
import {useViewer} from '@/context/viewer-context'
import {trpc} from '@/app/_trpc/client'
import Markdown from '@/components/markdown'
import Testimonial from '@/components/workshop/shared/testimonial'

export const TEAM_WORKSHOP_FEATURES = [
  'Flexible scheduling',
  'Live Q&A with John Lindquist',
  'Scope and plan work',
  'Control context engineering for reliable AI results',
  'Script Claude programmatically with TypeScript SDK',
  'Automate tasks using custom Claude Hooks',
  'Integrate APIs securely via Model Context Protocols',
]

const WorkshopPage = () => {
  const formRef = useRef<SignUpFormRef>(null)
  const {data: liveWorkshop, isLoading: isLiveWorkshopLoading} =
    trpc.featureFlag.getLiveWorkshop.useQuery({
      flag: 'featureFlagClaudeCodeWorkshopSale',
    })

  const {viewer} = useViewer()
  const [mounted, setMounted] = useState(false)

  const {data: subscription} = trpc.stripe.getSubscription.useQuery({
    subscriptionId:
      viewer?.accounts[0]?.subscriptions[0]?.stripe_subscription_id,
  })
  const islifeTimeSubscriber = viewer?.roles?.includes('lifetime_subscriber')
  const isyearlyPro = subscription?.items.data[0].plan.interval === 'year'

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])

  console.log('liveWorkshop', liveWorkshop)
  const saleisActive = liveWorkshop?.isSaleLive ?? false

  const LIVE_WORKSHOP_FEATURES = [
    'Live Q&A with John Lindquist',
    'Learn to prompt for developers',
    'Control context engineering for reliable AI results',
    'Script Claude programmatically with TypeScript SDK',
    'Automate tasks using custom Claude Hooks',
    'Integrate APIs securely via Model Context Protocols',
  ]

  return (
    <main className="min-h-screen relative bg-white dark:bg-gray-900">
      <div className="relative">
        <div className="relative">
          <Hero
            formRef={formRef}
            saleisActive={saleisActive}
            workshop={liveWorkshop}
          />
          <section className="z-10 relative">
            <h2 className="mt-10 sm:mt-20 mb-10 lg:text-3xl sm:text-2xl text-xl font-bold dark:text-white text-center text-balance">
              Tired of AI That Just <span className="italic">Almost</span>{' '}
              Works?
            </h2>
            <Markdown className="prose-base w-full sm:prose-lg md:prose-xl marker:text-blue-400 prose-headings:mx-auto prose-headings:max-w-2xl prose-headings:text-balance prose-headings:px-5 prose-headings:font-text prose-headings:font-semibold prose-h2:text-center prose-h2:text-3xl prose-p:mx-auto prose-p:max-w-2xl prose-p:px-5 prose-p:font-normal prose-p:text-foreground prose-a:text-blue-300 prose-strong:font-semibold prose-strong:text-white prose-pre:mx-auto prose-pre:max-w-2xl prose-pre:overflow-auto prose-ul:mx-auto prose-ul:max-w-2xl prose-ul:translate-x-1 prose-ul:list-disc hover:prose-a:underline md:prose-h2:text-5xl">
              {`You’ve seen the impressive demos. You’ve tried using LLMs in your workflow. But when it's time to solve a real-world coding problem, the magic fades.

You find yourself wrestling with an AI that:
- Hallucinates or fails unpredictably, forcing you to double-check everything and eroding your trust.
- Doesn't understand your codebase, giving you generic advice that ignores your project's architecture and standards.
- Requires endless, manual copy-pasting of files, error logs, and instructions just to provide the right context.
- Feels like a black box you can’t control, customize, or reliably integrate into your automated workflows.

"Prompt engineering" feels less like engineering and more like a frustrating guessing game. You know there has to be a better way to build with AI, but the path from a simple chat interface to a robust, automated system isn't clear.`}
            </Markdown>
            <h2 className="mt-10 sm:mt-20 mb-10 lg:text-3xl sm:text-2xl text-xl font-bold dark:text-white text-center text-balance">
              Building with AI Agents CAN Actually be Reliable.
            </h2>
            <Markdown className="prose-base w-full sm:prose-lg md:prose-xl marker:text-blue-400 prose-headings:mx-auto prose-headings:max-w-2xl prose-headings:text-balance prose-headings:px-5 prose-headings:font-text prose-headings:font-semibold prose-h2:text-center prose-h2:text-3xl prose-p:mx-auto prose-p:max-w-2xl prose-p:px-5 prose-p:font-normal prose-p:text-foreground prose-a:text-blue-300 prose-strong:font-semibold prose-strong:text-white prose-pre:mx-auto prose-pre:max-w-2xl prose-pre:overflow-auto prose-ul:mx-auto prose-ul:max-w-2xl prose-ul:translate-x-1 prose-ul:list-disc hover:prose-a:underline md:prose-h2:text-5xl">
              {`What if you could stop whispering prompts and start *architecting* intelligent systems?

Picture a workflow where your AI coding assistant:
- Operates with precision and consistency, because you’ve engineered the exact context it needs to succeed.
- Securely interacts with your entire codebase, APIs, and databases to perform complex, multi-step tasks autonomously.
- Automatically enforces your project’s coding standards, running formatters and linters without you lifting a finger.
- Integrates seamlessly into your toolchain, triggered by scripts and custom events, becoming a true extension of your development environment.

You would move from being a mere *user* of AI to being the *orchestrator* of a powerful, automated system. You’d ship faster, solve bigger problems, and build the kind of resilient, AI-powered tools that others only talk about.`}
            </Markdown>
            {/* {mounted && theme === 'light' && (
              <Image
                src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1745339467/cursor-workshop/cursor-workshop-screenshot.png"
                className="w-full lg:max-w-screen-lg max-w-[90vw] mx-auto my-20"
                loading="eager"
                quality={100}
                alt="cursor workshop screenshots"
                width={3825}
                height={2511}
              />
            )}
            {mounted && theme === 'dark' && (
              <Image
                src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1745443115/cursor-workshop/cursor-workshop-screenshot-dark.png"
                className="w-full lg:max-w-screen-lg max-w-[90vw] mx-auto my-20"
                loading="eager"
                quality={100}
                alt="cursor workshop screenshots"
                width={3825}
                height={2511}
              />
            )} */}
            <h2 className="mt-10 sm:mt-20 mb-10 lg:text-3xl sm:text-2xl text-xl font-bold dark:text-white text-center text-balance">
              Introducing: The Claude Code Power-User Workshop
            </h2>
            <Markdown className="prose-base w-full sm:prose-lg md:prose-xl marker:text-blue-400 prose-headings:mx-auto prose-headings:max-w-2xl prose-headings:text-balance prose-headings:px-5 prose-headings:font-text prose-headings:font-semibold prose-h2:text-center prose-h2:text-3xl prose-p:mx-auto prose-p:max-w-2xl prose-p:px-5 prose-p:font-normal prose-p:text-foreground prose-a:text-blue-300 prose-strong:font-semibold prose-strong:text-white prose-pre:mx-auto prose-pre:max-w-2xl prose-pre:overflow-auto prose-ul:mx-auto prose-ul:max-w-2xl prose-ul:translate-x-1 prose-ul:list-disc hover:prose-a:underline md:prose-h2:text-5xl">
              {`This isn't another prompt engineering guide. This is a hands-on, technical workshop designed to teach you the engineering principles behind building production-grade apps with Claude.

We'll teach you how to go beyond simple prompting and master the concepts needed for building effectively with Claude, using TypeScript to script, integrate, and automate.

By the end of the workshop, you'll gain the skills needed to confidently use AI for targeted refactors, feature implementation, and bug fixes.`}
            </Markdown>

            <h2 className="mt-10 sm:mt-20 mb-10 lg:text-3xl sm:text-2xl text-xl font-bold dark:text-white text-center text-balance">
              What You Will Master in This Workshop:
            </h2>
            <Markdown className="prose-base w-full sm:prose-lg md:prose-xl marker:text-blue-400 prose-headings:mx-auto prose-headings:max-w-2xl prose-headings:text-balance prose-headings:px-5 prose-headings:font-text prose-headings:font-semibold prose-h2:text-center prose-h2:text-3xl prose-p:mx-auto prose-p:max-w-2xl prose-p:px-5 prose-p:font-normal prose-p:text-foreground prose-a:text-blue-300 prose-strong:font-semibold prose-strong:text-white prose-pre:mx-auto prose-pre:max-w-2xl prose-pre:overflow-auto prose-ul:mx-auto prose-ul:max-w-2xl prose-ul:translate-x-1 prose-ul:list-disc hover:prose-a:underline md:prose-h2:text-5xl">
              {`### 1. Context Engineering: The Science of Reliable Results
Most AI fails because of poor context, not a "dumb" model. We'll teach you how to architect the perfect environment for Claude.
* Learn to: Dynamically assemble context from multiple sources (your code, user input, tools, and memory).
* Master: Structured prompts, few-shot examples, and feedback loops that allow Claude to self-correct and perform complex tasks reliably.

### 2. Advanced Scripting with the Anthropic TypeScript SDK
Leave the web UI behind. Learn to command Claude programmatically to create powerful, automated workflows.
* Learn to: Use the TypeScript SDK to manage conversations, stream responses for real-time output, and integrate Claude into your existing tools.
* Master: Writing scripts that process files, orchestrate tool usage, and manage session continuity for complex, multi-turn tasks.

### 3. Automation with Claude Hooks: Your AI's Event Triggers
What if Claude could automatically run Prettier on every file it edits? Or log every shell command for compliance? With Hooks, it can.
* Learn to: Configure user-defined shell commands that run at specific points in Claude’s lifecycle (e.g., \`$PreToolUse$\`).
* Master: Creating hooks to auto-format code, validate tool inputs, block risky commands, and trigger external workflows—making Claude adhere to *your* rules.

### 4. Model Context Protocols (MCPs): The Universal Connector for AI
Stop building bespoke, brittle integrations for every data source. MCP is the open standard for connecting AI to the outside world—like a USB-C port for your models.
* Learn to: Use pre-built MCP servers to give Claude secure access to tools for GitHub, Stripe, Sentry, and more.
* Master: The principles of connecting Claude to any external data source or private API in a standardized, secure, and scalable way.
`}
            </Markdown>
          </section>
        </div>
        {/* <WorkshopStructure /> */}

        <CtaSection
          saleisActive={saleisActive}
          ref={formRef}
          SaleClosedUi={<SignUpForm />}
          ActiveSaleUi={
            <ActiveSale
              hasProDiscount={islifeTimeSubscriber || isyearlyPro}
              workshopFeatures={LIVE_WORKSHOP_FEATURES}
              teamWorkshopFeatures={TEAM_WORKSHOP_FEATURES}
              workshop={liveWorkshop}
              isLiveWorkshopLoading={isLiveWorkshopLoading}
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
        title="Become a Claude Code Power-User"
        description="Join John Lindquist for a hands-on, technical workshop to fully understand building production-grade apps with Claude using TypeScript scripting, automation, and integrations."
        openGraph={{
          images: [
            {
              url: 'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1739448881/cursor-workshop-card_2x_mibay4.jpg', // TODO: Update to Claude-specific image if available
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
