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
    const {isTeamAccountOwner, account} = useAccount()
    const {number_of_members} = account

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

    const wasCanceled = subscriptionData?.subscription?.cancel_at_period_end

    return !loading && subscriptionData ? (
      <div className="w-full">
        {subscriptionName ? (
          <div className="w-full">
            {isTeamAccountOwner ? (
              <h3 className="text-lg font-medium text-center">
                ⭐️ You've got a team membership! ⭐️
              </h3>
            ) : (
              <h3 className="text-lg font-medium text-center">
                ⭐️ You're an <strong>egghead Member!</strong>
              </h3>
            )}
            <div className="w-full leading-relaxed mt-4 text-center">
              {isTeamAccountOwner && wasCanceled && (
                <>
                  <p>
                    Your <strong>{recur(subscriptionData.price)}ly</strong> team
                    membership for <strong>{number_of_members} seats</strong>{' '}
                    (from <strong>{account?.capacity}</strong> available) is
                    currently cancelled and it will not auto-renew.
                  </p>
                  <p>
                    Your team will still have access until the end of your
                    current billing period -{' '}
                    <strong>
                      {format(
                        new Date(
                          subscriptionData?.subscription?.current_period_end *
                            1000,
                        ),
                        'yyyy/MM/dd',
                      )}
                    </strong>
                    .
                  </p>
                  <p>
                    You can renew at any time using the Manage Your Membership
                    Billing button below.
                  </p>
                </>
              )}
              {isTeamAccountOwner && !wasCanceled && (
                <>
                  <p>
                    Your <strong>{recur(subscriptionData.price)}ly</strong> team
                    membership for <strong>{number_of_members} seats</strong>{' '}
                    (from <strong>{account?.capacity}</strong> available) will
                    automatically renew for <strong>{subscriptionPrice}</strong>{' '}
                    on{' '}
                    <strong>
                      {format(
                        new Date(account.subscriptions[0].current_period_end),
                        'yyyy/MM/dd',
                      )}
                    </strong>
                    .
                  </p>
                  <p>
                    If you would like to cancel auto-renewal or change the
                    number of seats for your team, you can use the Manage Your
                    Membership Billing button below.
                  </p>
                </>
              )}
              {!isTeamAccountOwner && wasCanceled && (
                <>
                  <p>
                    Your <strong>{recur(subscriptionData.price)}ly</strong>{' '}
                    membership is currently cancelled and it will not
                    auto-renew.
                  </p>
                  <p>
                    You will still have access until the end of your current
                    billing period -{' '}
                    <strong>
                      {format(
                        new Date(
                          subscriptionData?.subscription?.current_period_end *
                            1000,
                        ),
                        'yyyy/MM/dd',
                      )}
                    </strong>
                    .
                  </p>
                  <p>
                    You can renew at any time using the Manage Your Membership
                    Billing button below.
                  </p>
                </>
              )}
              {!isTeamAccountOwner && !wasCanceled && (
                <>
                  <p>
                    Your <strong>{recur(subscriptionData.price)}ly</strong>{' '}
                    membership will automatically renew for{' '}
                    <strong>{subscriptionPrice}</strong> on{' '}
                    <strong>
                      {format(
                        new Date(account.subscriptions[0].current_period_end),
                        'yyyy/MM/dd',
                      )}
                    </strong>
                    .
                  </p>
                  <p>
                    If you would like to cancel auto-renewal you can use the
                    Manage Your Membership Billing button below.
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full">
            {(viewer.is_pro || viewer.is_instructor) && (
              <p>
                You still have access to a Pro Membership. If you feel this is
                in error please email{' '}
                <a
                  className="text-blue-600 underline hover:text-blue-700"
                  href={`mailto:support@egghead.io?subject=${encodeURIComponent(
                    `Support needed for egghead membership`,
                  )}`}
                >
                  support@egghead.io
                </a>
              </p>
            )}
          </div>
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
