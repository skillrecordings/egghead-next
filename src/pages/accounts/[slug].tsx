import * as React from 'react'
import {loadAccount} from 'lib/accounts'
import {GetServerSideProps} from 'next'
import {getTokenFromCookieHeaders} from 'utils/auth'
import LoginRequired, {LoginRequiredParams} from 'components/login-required'
import axios from 'axios'
import Link from 'next/link'

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  params,
}) {
  const {loginRequired, eggheadToken} = getTokenFromCookieHeaders(
    req.headers.cookie as string,
  )
  const account: any =
    params && (await loadAccount(params.slug as string, eggheadToken))
  return {
    props: {
      loginRequired,
      account,
    },
  }
}

type ViewerAccount = {
  stripe_customer_id: string
  slug: string
}

const Account: React.FunctionComponent<
  LoginRequiredParams & {account: ViewerAccount}
> = ({loginRequired, account = {}}) => {
  const [subscriptionData, setSubscriptionData] = React.useState<any>()
  const {stripe_customer_id, slug} = account

  const recur = (price: any) => {
    const {
      recurring: {interval, interval_count},
    } = price

    console.log(interval, interval_count)
    if (interval === 'month' && interval_count === 3) return 'quarter'
    if (interval === 'month' && interval_count === 6) return '6-months'
    if (interval === 'month' && interval_count === 1) return 'month'
    if (interval === 'year' && interval_count === 1) return 'year'
  }
  React.useEffect(() => {
    if (stripe_customer_id) {
      axios
        .get(`/api/stripe/billing/session`, {
          params: {
            customer_id: stripe_customer_id,
            account_slug: slug,
          },
        })
        .then(({data}) => {
          if (data.subscription) {
            setSubscriptionData(data)
          }
        })
    }
  }, [stripe_customer_id, slug])

  const subscriptionName = subscriptionData && subscriptionData.product.name
  const subscriptionPrice =
    subscriptionData &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscriptionData.price.currency,
      minimumFractionDigits: 0,
    }).format(subscriptionData.price.unit_amount / 100)

  return (
    <LoginRequired loginRequired={loginRequired}>
      <main className="max-w-7xl mx-auto pb-10 lg:py-3 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          {/* Payment details */}
          <div className="sm:px-6 lg:px-0 lg:col-span-9">
            <section className="mb-32">
              <div className="p-4">
                <div className="border border-accents-1	max-w-3xl w-full p rounded-md m-auto my-8">
                  <div className="px-5 py-4">
                    <h3 className="text-2xl mb-1 font-medium">
                      You've got a {subscriptionName}
                    </h3>
                    <p className="text-accents-5">
                      You can update your plan and payment information below.
                    </p>
                    <div className="text-xl mt-8 mb-4 font-semibold">
                      {!subscriptionData?.portalUrl ? (
                        <div className="h-12 mb-6">loading</div>
                      ) : subscriptionPrice ? (
                        `${subscriptionPrice}/${recur(subscriptionData.price)}`
                      ) : (
                        <Link href="/pricing">
                          <a>Join today!</a>
                        </Link>
                      )}
                    </div>
                  </div>
                  {subscriptionData && (
                    <div className="border-t border-accents-1 bg-primary-2 p-4 text-accents-3 rounded-b-md">
                      <div className="flex flex-col items-start justify-between  sm:items-center">
                        {subscriptionData?.subscription
                          .cancel_at_period_end && (
                          <p className="pb-4 sm:pb-0">
                            Your account is currently cancelled. You'll have
                            access until the end of your current billing period.
                            You can also renew at any time.
                          </p>
                        )}
                        <a
                          className="w-full mt-4 text-center transition-all duration-150 ease-in-out bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:scale-105 transform hover:shadow-xl text-white font-semibold py-3 px-5 rounded-md"
                          href={subscriptionData?.portalUrl}
                        >
                          Manage Your Membership
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </LoginRequired>
  )
}

export default Account
