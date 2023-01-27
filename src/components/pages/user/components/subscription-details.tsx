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

    const pendingCancelation =
      subscriptionData?.subscription?.cancel_at_period_end
    const teamAccountPendingCancelation =
      isTeamAccountOwner && pendingCancelation

    if (loading || !subscriptionData) return null
    switch (true) {
      case teamAccountPendingCancelation:
        return (
          <div>
            <div className="md:w-[75ch] mx-auto">
              <div className="w-full leading-relaxed mt-4 text-center">
                <h3 className="text-lg font-medium text-center mb-4">
                  ⭐️ You still have a team egghead membership! ⭐️
                </h3>
                <p>
                  Your {recur(subscriptionData.price)}ly team membership of{' '}
                  {account?.capacity} seats is{' '}
                  <strong>
                    set to{' '}
                    <span className=" bg-red-100 rounded px-1 text-gray-900">
                      cancel
                    </span>{' '}
                    and it will not auto-renew.
                  </strong>
                </p>
                <p className="mb-4">
                  Your team will still have access until the end of your current
                  billing period:
                </p>
                <strong>
                  {format(
                    new Date(
                      subscriptionData?.subscription?.current_period_end * 1000,
                    ),
                    'yyyy/MM/dd',
                  )}
                </strong>
                <p className="mt-4">
                  You can renew at any time using the Manage Your Membership
                  Billing button below.
                </p>
              </div>
            </div>
            {subscriptionData.portalUrl && (
              <div className="bg-primary-2 text-accents-3 rounded-b-md">
                <div className="flex flex-col justify-between items-center">
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
                </div>
              </div>
            )}
          </div>
        )
      case isTeamAccountOwner:
        return (
          <div>
            <div className="md:w-[75ch] mx-auto">
              <div className="w-full leading-relaxed mt-4 text-center space-y-4">
                <h3 className="text-lg font-medium text-center mb-4">
                  ⭐️ You manage a team membership! ⭐️
                </h3>
                <p>
                  Your {recur(subscriptionData.price)}ly team membership of{' '}
                  {account?.capacity} seats will{' '}
                  <strong>
                    automatically renew for {subscriptionPrice} on{' '}
                    {format(
                      new Date(account.subscriptions[0].current_period_end),
                      'yyyy/MM/dd',
                    )}
                  </strong>
                  .
                </p>
                <p>
                  If you would like to cancel auto-renewal or change the number
                  of seats for your team, you can use the Manage Your Membership
                  Billing button below or add/remove team members on the{' '}
                  <Link href="/team">
                    <a className="underline">Team Page</a>
                  </Link>
                  .
                </p>
              </div>
            </div>
            {subscriptionData.portalUrl && (
              <div className="bg-primary-2 text-accents-3 rounded-b-md mt-6">
                <div className="flex flex-col justify-between items-center">
                  <Link href={subscriptionData.portalUrl}>
                    <a
                      onClick={() => {
                        track(`clicked manage membership`)
                      }}
                      className="w-2/3 px-5 py-3 mt-4 font-semibold text-center text-white transition-all duration-150 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 hover:scale-105 hover:shadow-xl"
                    >
                      Manage Your Team Membership Billing
                    </a>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )
      case pendingCancelation:
        return (
          <div>
            <div className="w-fit mx-auto">
              <div className="leading-relaxed mt-4 text-center mx-auto">
                `{' '}
                <h3 className="text-lg font-medium text-center mb-4">
                  ⭐️ You've got an egghead membership! ⭐️
                </h3>
                <p>
                  Your{' '}
                  <strong>
                    {recur(subscriptionData.price)}ly membership is currently{' '}
                    <span className=" bg-red-100 rounded px-1 text-gray-900">
                      cancelled
                    </span>{' '}
                    and it will not auto-renew.
                  </strong>
                </p>
                <p>
                  You will still have access until the end of your current
                  billing period:{' '}
                </p>
                <p>
                  <strong>
                    {format(
                      new Date(
                        subscriptionData?.subscription?.current_period_end *
                          1000,
                      ),
                      'yyyy/MM/dd',
                    )}
                  </strong>
                </p>
                <p className="mt-4">
                  You can renew at any time using the Manage Your Membership
                  Billing button below.
                </p>
              </div>
            </div>
            {subscriptionData.portalUrl && (
              <div className="bg-primary-2 text-accents-3 rounded-b-md mt-6">
                <div className="flex flex-col justify-between items-center">
                  <Link href={subscriptionData.portalUrl}>
                    <a
                      onClick={() => {
                        track(`clicked manage membership`)
                      }}
                      className="w-2/3 px-5 py-3 mt-4 font-semibold text-center text-white transition-all duration-150 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 hover:scale-105 hover:shadow-xl"
                    >
                      Renew your Membership
                    </a>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )
    }

    return (
      <div className="w-full">
        {subscriptionName ? (
          <div className="md:w-[75ch] mx-auto">
            <div className="w-full leading-relaxed mt-4 text-center space-y-4">
              <h3 className="text-lg font-medium text-center">
                ⭐️ You've got an egghead membership! ⭐️
              </h3>
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
                If you would like to cancel auto-renewal you can use the Manage
                Your Membership Billing button below.
              </p>
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
        {subscriptionData.portalUrl && (
          <div className="bg-primary-2 text-accents-3 rounded-b-md mt-6">
            <div className="flex flex-col justify-between items-center">
              <Link href={subscriptionData.portalUrl}>
                <a
                  onClick={() => {
                    track(`clicked manage membership`)
                  }}
                  className="w-2/3 px-5 py-3 font-semibold text-center text-white transition-all duration-150 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 hover:scale-105 hover:shadow-xl"
                >
                  Manage Your Membership Billing
                </a>
              </Link>
            </div>
          </div>
        )}
      </div>
    )
  }

export default SubscriptionDetails
