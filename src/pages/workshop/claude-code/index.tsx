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
              Ready to Unlock the Full Power of Claude Code?
            </h2>
            <Markdown className="prose-base w-full sm:prose-lg md:prose-xl marker:text-blue-400 prose-headings:mx-auto prose-headings:max-w-2xl prose-headings:text-balance prose-headings:px-5 prose-headings:font-text prose-headings:font-semibold prose-h2:text-center prose-h2:text-3xl prose-p:mx-auto prose-p:max-w-2xl prose-p:px-5 prose-p:font-normal prose-p:text-foreground prose-a:text-blue-300 prose-strong:font-semibold prose-strong:text-white prose-pre:mx-auto prose-pre:max-w-2xl prose-pre:overflow-auto prose-ul:mx-auto prose-ul:max-w-2xl prose-ul:translate-x-1 prose-ul:list-disc hover:prose-a:underline md:prose-h2:text-5xl">
              {`You've seen the demos.

You've experienced the magic.

You've started using Claude Code in your daily workflow… but you know there's more potential to unlock.

Claude Code is powerful, but like any sophisticated tool, mastering it requires understanding the nuances that separate casual users from power users.

Here are the common challenges developers face when scaling their AI workflows:
- Context management that ensures Claude understands your specific architecture and conventions
- Building repeatable, reliable workflows that go beyond one-off prompts
- Efficiently feeding Claude the right information without manual copy-paste marathons
- Creating scriptable, versionable AI interactions that integrate with your existing toolchain

Most developers are using maybe 20% of Claude Code's capabilities.

The remaining 80%? That's where the real productivity gains live—in the advanced techniques, hidden features, and battle-tested workflows that transform Claude from a helpful assistant into a force multiplier for your entire development process.`}
            </Markdown>
            <h2 className="mt-10 sm:mt-20 mb-10 lg:text-3xl sm:text-2xl text-xl font-bold dark:text-white text-center text-balance">
              The Game-Changing Workflows You're Missing
            </h2>
            <Markdown className="prose-base w-full sm:prose-lg md:prose-xl marker:text-blue-400 prose-headings:mx-auto prose-headings:max-w-2xl prose-headings:text-balance prose-headings:px-5 prose-headings:font-text prose-headings:font-semibold prose-h2:text-center prose-h2:text-3xl prose-p:mx-auto prose-p:max-w-2xl prose-p:px-5 prose-p:font-normal prose-p:text-foreground prose-a:text-blue-300 prose-strong:font-semibold prose-strong:text-white prose-pre:mx-auto prose-pre:max-w-2xl prose-pre:overflow-auto prose-ul:mx-auto prose-ul:max-w-2xl prose-ul:translate-x-1 prose-ul:list-disc hover:prose-a:underline md:prose-h2:text-5xl">
              {`**Beyond Basic Prompting: Script Your Way to 10x Productivity**

Most developers are typing prompts one at a time. Power users? They're orchestrating entire workflows:

- **Automated Intelligence on Autopilot**: Set up cron jobs where Claude searches the web, analyzes findings, creates files, and commits changes—all while you sleep
- **TypeScript SDK Mastery**: While plain English works, feeding Claude programmatic results from other tools creates consistency and reliability that manual prompting can't match
- **Multi-Agent Orchestration**: If you're using one agent at a time, you're leaving massive productivity gains on the table. Learn to coordinate sub-agents for complex tasks
- **One-Click Complexity**: Compress multi-hour workflows into single scripts or keyboard shortcuts that handle massive orchestrations

**MCP: Your Gateway to Connected Intelligence**

Model Context Protocols aren't just integrations—they're game changers:

- **GitHub Superpowers**: Search across millions of repos, understand entire codebases instantly, find real-world examples in seconds
- **Team Knowledge Management**: Store, organize, and query information professionally—share institutional knowledge across your entire team
- **Custom MCPs**: Build your own protocols to connect Claude to any service, turning it into the universal interface for your tech stack

**The Hidden Features That Change Everything**

- **CLI Mode Secrets**: Unlock features and workflows only available through command-line usage
- **Speed + Intelligence**: Use fast models like Kimi as child agents with Claude as a sub-agent for maximum speed without sacrificing quality
- **Playwright Automation**: Control browsers programmatically—automate testing, data gathering, and complex web workflows
- **Sandboxed Execution**: Give Claude full system access safely, preventing catastrophic changes while enabling powerful automation

These aren't just features—they're force multipliers that transform how you think about development, automation, and team productivity.`}
            </Markdown>
            <h2 className="mt-10 sm:mt-20 mb-10 lg:text-3xl sm:text-2xl text-xl font-bold dark:text-white text-center text-balance">
              Building with AI Agents CAN Actually be Reliable.
            </h2>
            <Markdown className="prose-base w-full sm:prose-lg md:prose-xl marker:text-blue-400 prose-headings:mx-auto prose-headings:max-w-2xl prose-headings:text-balance prose-headings:px-5 prose-headings:font-text prose-headings:font-semibold prose-h2:text-center prose-h2:text-3xl prose-p:mx-auto prose-p:max-w-2xl prose-p:px-5 prose-p:font-normal prose-p:text-foreground prose-a:text-blue-300 prose-strong:font-semibold prose-strong:text-white prose-pre:mx-auto prose-pre:max-w-2xl prose-pre:overflow-auto prose-ul:mx-auto prose-ul:max-w-2xl prose-ul:translate-x-1 prose-ul:list-disc hover:prose-a:underline md:prose-h2:text-5xl">
              {`This isn't just about writing code faster. It's about fundamentally rethinking how you approach every task in your workflow.

**The Real ROI: A New Way of Working**

When you master these techniques, everything changes:
- **Chores become scripts**: Repetitive tasks that ate hours now run automatically
- **Conversations become orchestrations**: Complex multi-step processes compress into single commands
- **Management becomes automation**: Status updates, code reviews, documentation—all handled programmatically

**From Manual to Magical**

Imagine your AI teammate that:
- Knows your codebase cold—imports, patterns, conventions, even that weird legacy folder
- Follows your git practices religiously—proper commit messages, safe branching, automated testing
- Integrates with your entire toolchain—from Prettier to CI/CD to your custom APIs
- Scales with sub-agents—delegate complex tasks across multiple specialized agents

**The Compound Effect**

Every workflow you automate compounds:
- Week 1: Save 2 hours on refactoring
- Week 4: Save 10 hours as scripts handle routine tasks
- Month 3: Your entire team operates at a new level of efficiency
- Month 6: You can't imagine working the old way

You're not just using Claude Code—you're building a personalized AI workforce that grows more powerful with every script, every integration, every workflow you create.`}
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
              {`A single day to master the workflows that separate Claude Code power users from everyone else.

**What You'll Actually Build (and take home):**

1. **Automated Workflows That Run While You Sleep**
   - Cron jobs where Claude searches, analyzes, creates, and commits autonomously
   - Multi-agent orchestrations that handle complex tasks with zero supervision
   - One-click scripts that compress hours of work into seconds
   
2. **TypeScript SDK Mastery**
   - Feed programmatic results from any tool into Claude for bulletproof consistency
   - Build conversation chains that remember context across sessions
   - Create sub-agent hierarchies for maximum speed + intelligence
   
3. **Git-Powered Safety Nets**
   - Sandboxed execution environments that prevent catastrophic changes
   - Proper commit message practices that make rollbacks trivial
   - Automated testing hooks that catch issues before they hit production
   
4. **MCP: Your Secret Weapon**
   - Search millions of GitHub repos instantly for real-world examples
   - Build team knowledge bases that persist and evolve
   - Create custom MCPs that turn Claude into your universal API interface
   
5. **The Hidden CLI Features**
   - Command-line superpowers that aren't in any documentation
   - Playwright integration for full browser automation
   - Speed optimizations using parent/child agent architectures

Plus John's personal collection of battle-tested scripts, keyboard shortcuts, and workflow patterns developed through many hours of Claude Code usage. He's used over 1 billion tokens in Claude Code!`}
            </Markdown>

            <h2 className="mt-10 sm:mt-20 mb-10 lg:text-3xl sm:text-2xl text-xl font-bold dark:text-white text-center text-balance">
              By 5 p.m. (or sooner) you’ll walk out with:
            </h2>
            <Markdown className="prose-base w-full sm:prose-lg md:prose-xl marker:text-blue-400 prose-headings:mx-auto prose-headings:max-w-2xl prose-headings:text-balance prose-headings:px-5 prose-headings:font-text prose-headings:font-semibold prose-h2:text-center prose-h2:text-3xl prose-p:mx-auto prose-p:max-w-2xl prose-p:px-5 prose-p:font-normal prose-p:text-foreground prose-a:text-blue-300 prose-strong:font-semibold prose-strong:text-white prose-pre:mx-auto prose-pre:max-w-2xl prose-pre:overflow-auto prose-ul:mx-auto prose-ul:max-w-2xl prose-ul:translate-x-1 prose-ul:list-disc hover:prose-a:underline md:prose-h2:text-5xl">
              {`- TypeScript SDK workflows that automate complex tasks while you sleep
- Production-ready safety nets with sandboxed execution and proper git practices
- Advanced CLI features and MCP integrations for team knowledge management`}
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
        description="Join John Lindquist for a hands-on, technical workshop to transform into a Claude Code power user using TypeScript scripting, automation, and integrations."
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
