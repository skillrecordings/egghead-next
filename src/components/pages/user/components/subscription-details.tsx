import React from 'react'
import Link from 'next/link'
import {track} from 'utils/analytics'
import {useViewer} from 'context/viewer-context'
import {get} from 'lodash'
import useSubscriptionDetails, {recur} from 'hooks/use-subscription-data'
import PricingWidget from '../../../pricing/pricing-widget'

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


    const subscriptionName = subscriptionData?.product?.name
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

    return !loading && subscriptionData ? (
      <div className="w-full">
        {subscriptionName ? (
          <>
            <h3 className="mb-2 text-lg font-medium">
              ⭐️ You're an <strong>egghead Member!</strong>
            </h3>
            <p className="text-accents-5">
              You can update your plan and payment information below via Stripe.
            </p>
            <div className="mt-8 mb-4 font-semibold">
              {!subscriptionData?.portalUrl ? (
                <div className="h-12 mb-6">loading</div>
              ) : subscriptionPrice ? (
                <div className="flex space-x-2">
                  <div>
                    You are currently paying{' '}
                    {`${subscriptionPrice}/${recur(subscriptionData.price)}`}{' '}
                    for your membership
                  </div>
                  {subscriptionData?.subscription?.cancel_at_period_end && (
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
          </>
        ) : (
          <>
            {(viewer.is_pro || viewer.is_instructor) && (
              <p>
                You still have access to a Pro Membership. If you feel this is
                in error please email{' '}
                <a
                  className="text-blue-600 underline hover:text-blue-700"
                  href="mailto:support@egghead.io"
                >
                  support@egghead.io
                </a>
              </p>
            )}
          </>
        )}
        {(subscriptionData?.subscription?.cancel_at_period_end ||
          subscriptionData?.portalUrl) &&
          !(viewer.is_pro || viewer.is_instructor) && (
            <div className="p-4 bg-primary-2 text-accents-3 rounded-b-md">
              <div className="flex flex-col items-start justify-between sm:items-center">
                {subscriptionData?.subscription?.cancel_at_period_end && (
                  <p className="pb-4 sm:pb-0">
                    Your account is currently cancelled. You'll have access
                    until the end of your current billing period. You can also
                    renew at any time.
                  </p>
                )}
                {subscriptionData.subscription &&
                subscriptionData?.portalUrl ? (
                  <>
                    <p className="mt-1">
                      You can still update your payment information below via
                      Stripe.
                    </p>
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
                  </>
                ) : (
                  <div className="mt-8">
                    <PricingWidget />
                  </div>
                )}
              </div>
            </div>
          )}
      </div>
    ) : null
  }

export default SubscriptionDetails
