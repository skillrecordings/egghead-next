'use client'
import Layout from '@/components/app/layout'
import {NextSeo} from 'next-seo'
import {useState, useMemo} from 'react'
import {CheckCircle, Copy} from 'lucide-react'
import {Button} from '@/ui'
import {trpc} from '@/app/_trpc/client'
import {format} from 'date-fns'
import Spinner from '@/components/spinner'

const BossEmailPage = () => {
  const [copied, setCopied] = useState(false)

  const {data: liveWorkshop, isLoading: isLiveWorkshopLoading} =
    trpc.featureFlag.getLiveWorkshop.useQuery({
      flag: 'featureFlagClaudeCodeWorkshopSale',
    })

  // Format the workshop date nicely
  const workshopDate = useMemo(() => {
    if (!liveWorkshop?.date) return '[Date]'
    try {
      const date = new Date(liveWorkshop.date)
      return format(date, 'MMMM d, yyyy')
    } catch {
      return liveWorkshop.date
    }
  }, [liveWorkshop?.date])

  // Get the workshop price
  const workshopPrice = useMemo(() => {
    if (!liveWorkshop?.workshopPrice) return '497'
    return liveWorkshop.workshopPrice
  }, [liveWorkshop?.workshopPrice])

  const emailContent = useMemo(() => {
    const date = workshopDate !== '[Date]' ? workshopDate : '[Date]'
    const price = workshopPrice

    return `Subject: Professional Development Request - Claude Code Advanced Workshop

Hi [Boss Name],

I've been exploring ways to improve our development velocity, and I've found a workshop that directly addresses several challenges we're facing with AI-assisted development.

As you know, we've started using Claude Code for various tasks, but I realize we're only scratching the surface. Most developers (ourselves included) use about 20% of what Claude Code can actually do. The gap between casual prompting and production-ready automation is significant, and that's exactly what this workshop addresses.

John Lindquist from egghead.io is running an intensive 5-hour workshop on ${date} that covers advanced Claude Code techniques. What caught my attention is that this isn't theoretical—it's hands-on implementation of real workflows we can use immediately.

Here's what the workshop covers that would benefit our team:

• Context engineering that makes Claude understand our specific codebase architecture and conventions
• TypeScript SDK integration to create repeatable, scriptable workflows (instead of one-off prompts)
• Model Context Protocols (MCP) for connecting Claude to our services and building team knowledge bases
• Multi-agent orchestration for handling complex, multi-step tasks automatically
• Safety protocols with sandboxed execution and proper git practices

The practical outcomes are compelling. By the end of the workshop, I'll have working scripts and templates we can immediately integrate into our repos. Other attendees report saving 10+ hours per month within weeks of implementing these techniques.

The workshop format is a live Zoom session with hands-on coding, and John provides a starter repository with all the patterns and examples covered. He's developed techniques that even Anthropic's team references—he's used over 1 billion tokens in Claude Code.

The investment is $${price}, which is reasonable compared to similar enterprise training (typically $2000+). Given the potential productivity gains, I believe this would pay for itself within the first month through time saved on routine tasks alone.

Would you be open to discussing this further? I'm happy to share more details about how specific techniques from the workshop could address our current pain points. The workshop has limited spots, so I wanted to check with you soon.

Thanks for considering this,
[Your Name]

P.S. The full curriculum is available at https://egghead.io/workshop/claude-code if you'd like to review the details.`
  }, [workshopDate, workshopPrice])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(emailContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <main className="min-h-screen relative bg-white dark:bg-gray-900">
      <div className="container mx-auto px-5 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">
            Get Your Boss to Say Yes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Copy this email template to make the case for attending the Claude
            Code Workshop
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-semibold dark:text-white">
              Email Template
            </h2>
            <Button
              onClick={handleCopy}
              variant={copied ? 'default' : 'secondary'}
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Email
                </>
              )}
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-md p-6 text-sm border border-gray-200 dark:border-gray-700 max-h-[600px] overflow-y-auto">
            {isLiveWorkshopLoading ? (
              <div className="flex items-center justify-center py-8">
                <Spinner size={12} className="text-black dark:text-white" />
              </div>
            ) : (
              <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                <div className="font-semibold text-base border-b border-gray-200 dark:border-gray-700 pb-2">
                  Subject: Professional Development Request - Claude Code
                  Advanced Workshop
                </div>

                <div>
                  Hi{' '}
                  <span className="bg-yellow-200 dark:bg-yellow-900/50 px-1">
                    [Boss Name]
                  </span>
                  ,
                </div>

                <div>
                  I've been exploring ways to improve our development velocity,
                  and I've found a workshop that directly addresses several
                  challenges we're facing with AI-assisted development.
                </div>

                <div>
                  As you know, we've started using Claude Code for various
                  tasks, but I realize we're only scratching the surface. Most
                  developers (ourselves included) use about 20% of what Claude
                  Code can actually do. The gap between casual prompting and
                  production-ready automation is significant, and that's exactly
                  what this workshop addresses.
                </div>

                <div>
                  John Lindquist from egghead.io is running an intensive 5-hour
                  workshop on{' '}
                  <span
                    className={
                      workshopDate !== '[Date]'
                        ? 'font-semibold'
                        : 'bg-yellow-200 dark:bg-yellow-900/50 px-1'
                    }
                  >
                    {workshopDate}
                  </span>{' '}
                  that covers advanced Claude Code techniques. What caught my
                  attention is that this isn't theoretical—it's hands-on
                  implementation of real workflows we can use immediately.
                </div>

                <div>
                  <div className="mb-2">
                    Here's what the workshop covers that would benefit our team:
                  </div>
                  <ul className="list-disc ml-5 space-y-2">
                    <li>
                      Context engineering that makes Claude understand our
                      specific codebase architecture and conventions
                    </li>
                    <li>
                      TypeScript SDK integration to create repeatable,
                      scriptable workflows (instead of one-off prompts)
                    </li>
                    <li>
                      Model Context Protocols (MCP) for connecting Claude to our
                      services and building team knowledge bases
                    </li>
                    <li>
                      Multi-agent orchestration for handling complex, multi-step
                      tasks automatically
                    </li>
                    <li>
                      Safety protocols with sandboxed execution and proper git
                      practices
                    </li>
                  </ul>
                </div>

                <div>
                  The practical outcomes are compelling. By the end of the
                  workshop, I'll have working scripts and templates we can
                  immediately integrate into our repos. Other attendees report
                  saving 10+ hours per month within weeks of implementing these
                  techniques.
                </div>

                <div>
                  The workshop format is a live Zoom session with hands-on
                  coding, and John provides a starter repository with all the
                  patterns and examples covered. He's developed techniques that
                  even Anthropic's team references—he's used over 1 billion
                  tokens in Claude Code.
                </div>

                <div>
                  The investment is{' '}
                  <span className="font-semibold">${workshopPrice}</span>, which
                  is reasonable compared to similar enterprise training
                  (typically $2000+). Given the potential productivity gains, I
                  believe this would pay for itself within the first month
                  through time saved on routine tasks alone.
                </div>

                <div>
                  Would you be open to discussing this further? I'm happy to
                  share more details about how specific techniques from the
                  workshop could address our current pain points. The workshop
                  has limited spots, so I wanted to check with you soon.
                </div>

                <div>
                  Thanks for considering this,
                  <br />
                  <span className="bg-yellow-200 dark:bg-yellow-900/50 px-1">
                    [Your Name]
                  </span>
                </div>

                <div className="text-sm italic pt-2 border-t border-gray-200 dark:border-gray-700">
                  P.S. The full curriculum is available at{' '}
                  <a
                    href="https://egghead.io/workshop/claude-code"
                    className="text-blue-500 hover:underline"
                  >
                    https://egghead.io/workshop/claude-code
                  </a>{' '}
                  if you'd like to review the details.
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold mb-3 dark:text-white">
            Pro Tips for Getting Approval:
          </h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Customize the [Boss Name] and [Your Name] fields before sending
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Add specific examples from your current projects where these
              techniques would help
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Mention any team members who might also benefit from the knowledge
              sharing
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Consider proposing a follow-up meeting to share learnings with the
              team
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              If budget is tight, offer to cover part of the cost or use
              professional development funds
            </li>
          </ul>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Ready to level up your Claude Code skills?
          </p>
          <Button asChild size="lg">
            <a href="/workshop/claude-code">Back to Workshop Details</a>
          </Button>
        </div>
      </div>
    </main>
  )
}

BossEmailPage.getLayout = (Page: any, pageProps: any) => {
  return (
    <Layout>
      <NextSeo
        title="Get Your Boss to Approve Claude Code Workshop | egghead"
        description="Persuasive email template to help you get approval for attending the Claude Code Power-User Workshop with John Lindquist."
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

export default BossEmailPage
