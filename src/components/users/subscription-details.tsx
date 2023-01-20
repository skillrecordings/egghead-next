import React from 'react'
import Link from 'next/link'
import {track} from '../../utils/analytics'
import {useViewer} from 'context/viewer-context'
import get from 'lodash/get'
import useSubscriptionDetails, {recur} from 'hooks/use-subscription-data'

type SubscriptionDetailsProps = {
  stripeCustomerId: string
  slug: string
}

const SubscriptionDetails: React.FunctionComponent<SubscriptionDetailsProps> =
  ({stripeCustomerId, slug}) => {
    const {viewer} = useViewer()
    const {subscriptionData, loading} = useSubscriptionDetails({
      stripeCustomerId,
    })

    const subscriptionName = subscriptionData && subscriptionData.product?.name
    const subscriptionUnitAmount = get(
      subscriptionData,
      'latestInvoice.amount_due',
      subscriptionData?.price?.unit_amount,
    )
    const currency = get(
      subscriptionData,
      'latestInvoice.currency',
      subscriptionData?.price?.unit_amount,
    )
    const subscriptionPrice =
      subscriptionUnitAmount &&
      currency &&
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
      }).format(subscriptionUnitAmount / 100)

    return (
      <>
        {/* Payment details */}
        {!loading && subscriptionData && (
          <div className="sm:px-6 lg:px-0 lg:col-span-9">
            <section className="mb-32">
              <div className="w-full p-4">
                <div className="w-full m-auto my-8 border rounded-md border-accents-1 p max-w-max-content">
                  {subscriptionName ? (
                    <div className="px-5 py-4">
                      <h3 className="mb-1 text-2xl font-medium">
                        ⭐️ You're an <strong>egghead Member!</strong>
                      </h3>
                      <p className="text-accents-5">
                        You can update your plan and payment information below
                        via Stripe.
                      </p>
                      <div className="mt-8 mb-4 font-semibold">
                        {!subscriptionData?.portalUrl ? (
                          <div className="h-12 mb-6">loading</div>
                        ) : subscriptionPrice ? (
                          <div className="flex flex-col items-center space-x-2">
                            <div>
                              You are currently paying{' '}
                              {`${subscriptionPrice}/${recur(
                                subscriptionData.price,
                              )}`}{' '}
                              for your membership
                            </div>
                            {subscriptionData?.subscription
                              ?.cancel_at_period_end && (
                              <div className="flex items-center justify-center px-2 py-1 text-xs bg-gray-100 rounded text-gray-1000 mt-2">
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
                      <h3 className="mb-1 text-2xl font-medium">
                        No membership found.
                      </h3>
                      {(viewer.is_pro || viewer.is_instructor) && (
                        <p>
                          You still have access to a Pro Membership. If you feel
                          this is in error please email{' '}
                          <a
                            className="text-blue-600 underline hover:text-blue-700"
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
                    <div className="p-4 border-t border-accents-1 bg-primary-2 text-accents-3 rounded-b-md">
                      <div className="flex flex-col items-start justify-between sm:items-center">
                        {subscriptionData?.subscription
                          ?.cancel_at_period_end && (
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
                              className="w-full px-5 py-3 mt-4 font-semibold text-center text-white transition-all duration-150 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 hover:scale-105 hover:shadow-xl"
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
