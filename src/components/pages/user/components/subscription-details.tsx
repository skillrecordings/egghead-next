import React from 'react'
import Link from 'next/link'
import analytics, {track} from 'utils/analytics'
import {useViewer} from 'context/viewer-context'
import {get} from 'lodash'
import {format} from 'date-fns'
import useSubscriptionDetails, {recur} from 'hooks/use-subscription-data'
import PricingWidget from 'components/pricing/pricing-widget'
import {useAccount} from 'hooks/use-account'

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
    const {isTeamAccountOwner} = useAccount()

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

    const currentPeriodEnd =
      subscriptionData?.subscription?.cancel_at_period_end &&
      subscriptionData?.subscription?.current_period_end * 1000

    return !loading && subscriptionData ? (
      <div className="w-full">
        {subscriptionName ? (
          <div className="md:w-[75ch] mx-auto">
            {currentPeriodEnd && (
              <div className="my-8 p-4 bg-red-100 rounded text-gray-900 space-y-2">
                <p>
                  Your membership is currently cancelled and it will not
                  auto-renew. You'll have access until the end of your current
                  billing period (
                  <strong>
                    {format(new Date(currentPeriodEnd), 'yyyy/MM/dd')}
                  </strong>
                  ). You can renew at any time.
                </p>
                <p>
                  You can also get help by emailing{' '}
                  <strong>
                    <a
                      href={`mailto:support@egghead.io?subject=${encodeURIComponent(
                        `Support needed for egghead membership`,
                      )}`}
                      className="underline"
                    >
                      support@egghead.io
                    </a>
                  </strong>
                  . We'll get back to you as soon as we can.
                </p>
              </div>
            )}
            {isTeamAccountOwner ? (
              <h3 className="mb-2 text-lg font-medium text-center">
                ⭐️ You've got a team membership! ⭐️
              </h3>
            ) : (
              <h3 className="mb-2 text-lg font-medium text-center">
                ⭐️ You're an <strong>egghead Member!</strong>
              </h3>
            )}
            <p className="text-accents-5 text-center">
              You can update your plan and payment information below via Stripe.
            </p>
            <div className="mt-8 mb-4 font-semibold">
              {!subscriptionData?.portalUrl ? (
                <div className="h-12 mb-6">loading</div>
              ) : (
                subscriptionPrice &&
                !subscriptionData?.subscription?.cancel_at_period_end && (
                  <div className="flex space-x-2 justify-center">
                    <div>
                      You are currently paying{' '}
                      {`${subscriptionPrice}/${recur(subscriptionData.price)}`}{' '}
                      for your membership
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
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
          subscriptionData?.portalUrl) && (
          <div className="bg-primary-2 text-accents-3 rounded-b-md mt-6">
            <div className="flex flex-col justify-between items-center">
              {subscriptionData.subscription && subscriptionData?.portalUrl ? (
                <>
                  <Link href={subscriptionData.portalUrl}>
                    <a
                      onClick={() => {
                        track(`clicked manage membership`)
                      }}
                      className="w-2/3 px-5 py-3 mt-4 font-semibold text-center text-white transition-all duration-150 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 hover:scale-105 hover:shadow-xl"
                    >
                      Manage Your Membership Billing
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
