import * as React from 'react'
import {FunctionComponent} from 'react'
import {track} from '@/utils/analytics'
import {useRouter} from 'next/router'

import LifetimePricingWidget from '@/components/pricing/lifetime/lifetime-pricing-widget'
import BodyCopyFull from '@/components/pricing/lifetime/body-copy-full'
import BodyCopyMember from '@/components/pricing/lifetime/body-copy-member'
import Layout from '@/components/app/layout'
import {NextSeo} from 'next-seo'
import {GetServerSideProps} from 'next'
import {getLastChargeForActiveSubscription} from '@/lib/subscriptions'
import Link from '@/components/link'

type LastCharge = Awaited<ReturnType<typeof getLastChargeForActiveSubscription>>

type PricingProps = {
  annualPrice: {
    id: string
    recurring: {
      interval: 'year'
    }
    unit_amount: number
  }
  redirectURL?: string
  lastCharge?: LastCharge | null
  userId?: string
}

/**
 * Sticky CTA bar that appears when user scrolls past the hero section
 */
const StickyCTA: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling 400px
      setIsVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, {passive: true})
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/95 sm:hidden">
      <div className="container flex items-center justify-between px-4 py-3">
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">
            Lifetime Access
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            $500 one-time
          </div>
        </div>
        <a
          href="#pricing"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          onClick={() => track('sticky cta: clicked')}
        >
          Get Access
        </a>
      </div>
    </div>
  )
}

const Forever: FunctionComponent<React.PropsWithChildren<PricingProps>> & {
  getLayout: any
} = ({lastCharge}) => {
  const router = useRouter()

  React.useEffect(() => {
    track('visited lifetime membership')
  }, [])

  React.useEffect(() => {
    if (router?.query?.stripe === 'cancelled') {
      track('lifetime checkout: cancelled from stripe')
    }
  }, [router?.query?.stripe])

  return (
    <>
      <StickyCTA />
      <div className="text-gray-900 dark:bg-gray-900 bg-gray-50 dark:text-white">
        <header className="container flex flex-col items-center py-16 mt-5 text-center">
          <h1 className="max-w-screen-lg text-2xl font-extrabold md:text-4xl leading-tighter text-balance">
            Stay on Top of Modern Full Stack Development for Life
          </h1>
          <h2 className="max-w-2xl pt-8 text-xl font-light leading-tight text-gray-700 dark:text-gray-200">
            Short, goal-focused lessons. Real projects. Learn what you need,
            implement it, move on.
          </h2>

          <div className="mt-10 w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  Lifetime access to egghead
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Built for working devs. One purchase, lifetime access. Try it
                  for 30 days—money back if it’s not a fit.
                </p>
              </div>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700 text-sm shrink-0"
              >
                {'Get Lifetime\u00A0Access'}
              </a>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <div className="text-sm font-semibold">What you get</div>
                <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 dark:text-gray-200">
                  <li>Full access to all courses and lessons</li>
                  <li>Short lessons that get you to the implementation fast</li>
                  <li>Courses scoped to a specific shipped outcome</li>
                  <li>New lessons added over time (included)</li>
                  <li>
                    Bonus live workshops recordings included:{' '}
                    <Link
                      href="https://egghead.io/workshop/claude-code"
                      className="underline underline-offset-2 hover:no-underline"
                    >
                      Claude Code
                    </Link>{' '}
                    +{' '}
                    <Link
                      href="https://egghead.io/workshop/cursor"
                      className="underline underline-offset-2 hover:no-underline"
                    >
                      Cursor
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <div className="text-sm font-semibold">
                  Built for working devs
                </div>
                <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 dark:text-gray-200">
                  <li>Shipping TypeScript/React/Node in real codebases</li>
                  <li>Learning in small chunks between meetings</li>
                  <li>
                    Copying patterns you can apply today (not theory dumps)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </header>

        {/* Conditional body copy based on member status */}
        {/* Show concise copy if user has an active subscription (stripeSubscriptionId exists) */}
        {lastCharge?.stripeSubscriptionId ? (
          <BodyCopyMember amountPaid={lastCharge.amountPaid} />
        ) : (
          <BodyCopyFull />
        )}

        <main className="container flex flex-col items-center py-8">
          <div id="pricing" className="w-full flex justify-center">
            <LifetimePricingWidget
              lastCharge={
                lastCharge ? {amountPaid: lastCharge.amountPaid} : undefined
              }
            />
          </div>

          {/* FAQ Section */}
          <div className="mt-16 w-full max-w-2xl">
            <h3 className="mb-6 text-center text-xl font-bold text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              <details className="group rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-900 dark:text-white">
                  What if I'm already a member?
                  <span className="ml-2 transition-transform group-open:rotate-180">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                  Great news! Your current subscription will be discounted.
                  You'll see your discounted price at checkout.
                </p>
              </details>
              <details className="group rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-900 dark:text-white">
                  What's included in future updates?
                  <span className="ml-2 transition-transform group-open:rotate-180">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                  All new courses, lessons, and workshops added to egghead are
                  included forever. No extra charges, no upsells.
                </p>
              </details>
              <details className="group rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-900 dark:text-white">
                  Can I expense this?
                  <span className="ml-2 transition-transform group-open:rotate-180">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                  Yes! You'll receive a detailed invoice after purchase that you
                  can submit for reimbursement or expense reporting.
                </p>
              </details>
              <details className="group rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-900 dark:text-white">
                  How is this different from annual?
                  <span className="ml-2 transition-transform group-open:rotate-180">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                  Annual renews every year. Lifetime is a one-time purchase that
                  gives you permanent access—no renewals, no recurring charges,
                  ever.
                </p>
              </details>
            </div>
          </div>
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const ehUser = JSON.parse(ctx.req.cookies.eh_user || '{}')
  const authToken = ctx.req.cookies['eh_token_2020_11_22']
  console.log('ehUser', ehUser)

  if (!authToken) return {props: {}}

  const lastCharge = await getLastChargeForActiveSubscription(
    ehUser.email,
    authToken,
  )

  console.log('lastCharge', lastCharge)

  return {
    props: {
      lastCharge: lastCharge || null,
    },
  }
}

export default Forever
