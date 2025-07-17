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
              {`You watched the demo.

You clapped.

You copied the prompt into your own repo… and it barfed.

Suddenly the magic trick feels more like a rigged carnival game.

Every turn costs you time, sanity, and the creeping suspicion that you’re the product being tested.

Here’s what the brochure never mentions:
- Hallucinations that sound so confident you only notice the bug after it ships.
- Generic answers that ignore your architecture, your conventions, your actual code.
- Copy-pasta marathons—files, logs, screenshots, prayers—just to feed the beast.
- A black box that refuses to be scripted, versioned, or reasoned with.

So you go back to the docs, whisper sweeter prompts, and hope the next release fixes everything.

Spoiler: it won’t.`}
            </Markdown>
            <h2 className="mt-10 sm:mt-20 mb-10 lg:text-3xl sm:text-2xl text-xl font-bold dark:text-white text-center text-balance">
              Building with AI Agents CAN Actually be Reliable.
            </h2>
            <Markdown className="prose-base w-full sm:prose-lg md:prose-xl marker:text-blue-400 prose-headings:mx-auto prose-headings:max-w-2xl prose-headings:text-balance prose-headings:px-5 prose-headings:font-text prose-headings:font-semibold prose-h2:text-center prose-h2:text-3xl prose-p:mx-auto prose-p:max-w-2xl prose-p:px-5 prose-p:font-normal prose-p:text-foreground prose-a:text-blue-300 prose-strong:font-semibold prose-strong:text-white prose-pre:mx-auto prose-pre:max-w-2xl prose-pre:overflow-auto prose-ul:mx-auto prose-ul:max-w-2xl prose-ul:translate-x-1 prose-ul:list-disc hover:prose-a:underline md:prose-h2:text-5xl">
              {`What if you could trade the guessing game for an engineering discipline?

Imagine building an AI teammate that:
- Knows your codebase cold—imports, styles, tests, the weird legacy folder no one talks about.
- Executes with precision—no surprises, no ghost dependencies, no “it worked on my machine.”
- Plays nicely with your toolchain—runs Prettier after every edit, triggers CI when it commits, opens pull requests with human-readable diffs.
- Fails gracefully—logs, rollbacks, and clear diagnostics instead of cryptic stack traces.

You stop prompting.

You start orchestrating.`}
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
              Enter: the Claude Code Power-User Workshop
            </h2>
            <Markdown className="prose-base w-full sm:prose-lg md:prose-xl marker:text-blue-400 prose-headings:mx-auto prose-headings:max-w-2xl prose-headings:text-balance prose-headings:px-5 prose-headings:font-text prose-headings:font-semibold prose-h2:text-center prose-h2:text-3xl prose-p:mx-auto prose-p:max-w-2xl prose-p:px-5 prose-p:font-normal prose-p:text-foreground prose-a:text-blue-300 prose-strong:font-semibold prose-strong:text-white prose-pre:mx-auto prose-pre:max-w-2xl prose-pre:overflow-auto prose-ul:mx-auto prose-ul:max-w-2xl prose-ul:translate-x-1 prose-ul:list-disc hover:prose-a:underline md:prose-h2:text-5xl">
              {`A single day to turn AI from party trick into production-grade teammate.

What You’ll Actually Build (and take home):

1. Context Engineering That Doesn’t Suck
   - Dynamic context assembly—pull the exact slices your model needs.
   - Few-shot examples that evolve with your codebase.
   - Feedback loops so Claude can self-correct before you even see the diff.
2. TypeScript SDK Kung-Fu
   - Stream responses in real time.
   - Script multi-turn conversations that survive reboots.
   - Chain file reads, AST walks, and shell commands like Lego.
3. Claude Hooks—Event-Driven Guardrails
   - $PreToolUse$ → auto-format.
   - $PostWrite$ → run tests.
   - $PreCommit$ → check security policy, block if red flags.
   - Your rules, your triggers, zero babysitting.
4. MCP: The Universal Port
   - Plug Claude into GitHub, Stripe, Sentry, your private APIs—one standard, zero custom glue.
   - Swap data sources like USB-C cables.
   - Sleep better knowing the integration isn’t held together with regex and tears.`}
            </Markdown>

            <h2 className="mt-10 sm:mt-20 mb-10 lg:text-3xl sm:text-2xl text-xl font-bold dark:text-white text-center text-balance">
              By 5 p.m. (or sooner) you’ll walk out with:
            </h2>
            <Markdown className="prose-base w-full sm:prose-lg md:prose-xl marker:text-blue-400 prose-headings:mx-auto prose-headings:max-w-2xl prose-headings:text-balance prose-headings:px-5 prose-headings:font-text prose-headings:font-semibold prose-h2:text-center prose-h2:text-3xl prose-p:mx-auto prose-p:max-w-2xl prose-p:px-5 prose-p:font-normal prose-p:text-foreground prose-a:text-blue-300 prose-strong:font-semibold prose-strong:text-white prose-pre:mx-auto prose-pre:max-w-2xl prose-pre:overflow-auto prose-ul:mx-auto prose-ul:max-w-2xl prose-ul:translate-x-1 prose-ul:list-disc hover:prose-a:underline md:prose-h2:text-5xl">
              {`- A repo template you can clone tomorrow.
- Scripts that refactor, test, and ship a feature while you grab coffee.
- The quiet confidence that your AI won’t go rogue at 2 a.m.

Seats are limited (because we actually review code together on Zoom, not dump a PDF and ghost you).

Grab yours now—before the next demo lures you back into the almost-works trap.`}
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
