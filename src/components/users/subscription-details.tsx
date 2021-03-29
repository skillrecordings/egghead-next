import React from 'react'
import axios from 'axios'
import Link from 'next/link'
import {track} from '../../utils/analytics'
import {useViewer} from 'context/viewer-context'
import get from 'lodash/get'

type SubscriptionDetailsProps = {
  stripeCustomerId: string
  slug: string
}

const SubscriptionDetails: React.FunctionComponent<SubscriptionDetailsProps> = ({
  stripeCustomerId,
  slug,
}) => {
  const {viewer} = useViewer()
  const [subscriptionData, setSubscriptionData] = React.useState<any>()
  const recur = (price: any) => {
    const {
      recurring: {interval, interval_count},
    } = price

    if (interval === 'month' && interval_count === 3) return 'quarter'
    if (interval === 'month' && interval_count === 6) return '6-months'
    if (interval === 'month' && interval_count === 1) return 'month'
    if (interval === 'year' && interval_count === 1) return 'year'
  }

  React.useEffect(() => {
    if (stripeCustomerId) {
      axios
        .get(`/api/stripe/billing/session`, {
          params: {
            customer_id: stripeCustomerId,
            account_slug: slug,
          },
        })
        .then(({data}) => {
          if (data) {
            setSubscriptionData(data)
          }
        })
    }
  }, [stripeCustomerId, slug])

  const subscriptionName = subscriptionData && subscriptionData.product?.name
  const subscriptionUnitAmount = get(
    subscriptionData,
    'latestInvoice.amount_due',
    subscriptionData?.price?.unit_amount,
  )
  const subscriptionPrice =
    subscriptionData?.price &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscriptionData.price.currency,
      minimumFractionDigits: 0,
    }).format(subscriptionUnitAmount / 100)

  return (
    <>
      {/* Payment details */}
      {subscriptionData && (
        <div className="sm:px-6 lg:px-0 lg:col-span-9">
          <section className="mb-32">
            <div className="p-4 w-full">
              <div className="border border-accents-1	w-full p rounded-md m-auto my-8 max-w-max-content">
                {subscriptionName ? (
                  <div className="px-5 py-4">
                    <h3 className="text-2xl mb-1 font-medium">
                      ⭐️ You're an <strong>egghead Member!</strong>
                    </h3>
                    <p className="text-accents-5">
                      You can update your plan and payment information below via
                      Stripe.
                    </p>
                    <div className="mt-8 mb-4 font-semibold">
                      {!subscriptionData?.portalUrl ? (
                        <div className="h-12 mb-6">loading</div>
                      ) : subscriptionPrice ? (
                        <div className="flex flex-col space-x-2 items-center">
                          <div>
                            You are currently paying{' '}
                            {`${subscriptionPrice}/${recur(
                              subscriptionData.price,
                            )}`}{' '}
                            for your membership
                          </div>
                          {subscriptionData?.subscription
                            ?.cancel_at_period_end && (
                            <div className="rounded text-xs px-2 py-1 flex justify-center items-center bg-gray-100">
                              cancelled
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link href="/pricing">
                          <a
                            onClick={() => {
                              track(`clicked pricing`, {
                                location: 'accounts',
                              })
                            }}
                          >
                            Join today!
                          </a>
                        </Link>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="px-5 py-4">
                    <h3 className="text-2xl mb-1 font-medium">
                      No paid subscription found.
                    </h3>
                    {(viewer.is_pro || viewer.is_instructor) && (
                      <p>
                        You still have access to a Pro Membership. If you feel
                        this is in error please email{' '}
                        <a
                          className="text-blue-600 hover:text-blue-700 underline"
                          href="mailto:support@egghead.io"
                        >
                          support@egghead.io
                        </a>
                      </p>
                    )}
                    <p className="py-3">
                      You can still update your payment information below via
                      Stripe.
                    </p>
                  </div>
                )}
                {subscriptionData && (
                  <div className="border-t border-accents-1 bg-primary-2 p-4 text-accents-3 rounded-b-md">
                    <div className="flex flex-col items-start justify-between  sm:items-center">
                      {subscriptionData?.subscription?.cancel_at_period_end && (
                        <p className="pb-4 sm:pb-0">
                          Your account is currently cancelled. You'll have
                          access until the end of your current billing period.
                          You can also renew at any time.
                        </p>
                      )}
                      {subscriptionData?.portalUrl && (
                        <Link href={subscriptionData.portalUrl}>
                          <a
                            onClick={() => {
                              track(`clicked manage membership`)
                            }}
                            className="w-full mt-4 text-center transition-all duration-150 ease-in-out bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:scale-105 transform hover:shadow-xl text-white font-semibold py-3 px-5 rounded-md"
                          >
                            Manage Your Membership
                          </a>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  )
}

export default SubscriptionDetails
