import * as React from 'react'
import {FunctionComponent} from 'react'
import {track} from '@/utils/analytics'
import {useRouter} from 'next/router'
import Testimonials from '@/components/pricing/testimonials'
import testimonialsData from '@/components/pricing/testimonials/data'
import LifetimePricingWidget from '@/components/pricing/lifetime/lifetime-pricing-widget'
import Layout from '@/components/app/layout'
import {NextSeo} from 'next-seo'
import {GetServerSideProps} from 'next'
import {getLastChargeForActiveSubscription} from '@/lib/subscriptions'
import Link from '@/components/link'

type PricingProps = {
  annualPrice: {
    id: string
    recurring: {
      interval: 'year'
    }
    unit_amount: number
  }
  redirectURL?: string
  lastCharge: {
    amountPaid: number
    stripeCustomerId: string
    accountId: string
    userId: string
  }
  userId: string
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

          <article className="prose text-left max-w-2xl dark:prose-invert pt-12">
            <p>
              Your time is precious. egghead is built for momentum: learn what
              you need, apply it immediately, and ship. Come in with a ticket.
              Leave with a PR.
            </p>
            <p>
              Lessons are short (minutes, not hours). Courses are “scoped to a
              goal” which means one concrete outcome, clear steps, and a
              finished feature you can ship or adapt.
            </p>
            <p>No wandering intros. No motivational monologues.</p>
            <p>
              Just the moving parts, the pitfalls, and the checklists that keep
              you out of refactor hell.
            </p>
            <h3>Example goals (phrased like tickets)</h3>
            <p>If it could live in your issue tracker, it belongs here.</p>
            <ul>
              <li>Add auth with OAuth + sessions</li>
              <li>Migrate to React Server Components</li>
              <li>Type a gnarly API response safely</li>
              <li>Add Stripe checkout + webhooks</li>
            </ul>

            <p>
              When the stack shifts (and it will), you don’t have to start from
              zero. Come back, grab the lesson, ship the change, repeat for the
              rest of your career.
            </p>
          </article>

          <div
            id="bonuses"
            className="mt-10 max-w-2xl rounded-2xl border border-blue-100 bg-white p-6 text-left shadow-sm dark:border-blue-900/40 dark:bg-gray-950"
          >
            <div className="mb-3 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700 dark:bg-blue-950/40 dark:text-blue-200">
              Bonus live workshops - $750 value (included)
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white text-balance">
              Use AI tools to ship faster and smarter (without turning your
              codebase into slop)
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Your lifetime membership includes two full workshop recordings
              from John Lindquist on using AI responsibly in real development
              workflows:
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <a
                href="https://egghead.io/workshop/claude-code"
                className="block rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900/40 dark:hover:bg-gray-900/70"
              >
                <h4 className="font-semibold text-lg">Claude Code Workshop</h4>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Use AI in the terminal to explore, implement, and refactor
                  faster.
                </p>
              </a>
              <a
                href="https://egghead.io/workshop/cursor"
                className="block rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900/40 dark:hover:bg-gray-900/70"
              >
                <h4 className="font-semibold text-lg">Cursor Workshop</h4>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Codebase-aware assistance that helps you ship without chaos.
                </p>
              </a>
            </div>
          </div>
        </header>
        <main className="container flex flex-col items-center">
          <div id="pricing" className="w-full flex justify-center">
            <LifetimePricingWidget lastCharge={lastCharge} />
          </div>
          <Testimonials testimonials={testimonialsData} />
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
