import React from 'react'
import Link from 'next/link'
import {track} from 'utils/analytics'
import {useViewer} from 'context/viewer-context'
import {format} from 'date-fns'
import {recur} from 'utils/recur'
import PricingWidget from 'components/pricing/pricing-widget'
import {useAccount} from 'hooks/use-account'
import {trpc} from '../../../../trpc/trpc.client'

type SubscriptionDetailsProps = {
  stripeCustomerId: string
  slug: string
}

const formatAmountWithCurrency = (
  amountInCents: number,
  currency: string,
): string => {
  if (!amountInCents || !currency) return ''

  let positiveAmount = Math.abs(amountInCents)
  let formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(positiveAmount / 100)

  return formattedAmount
}

const SubscriptionDetails: React.FunctionComponent<
  React.PropsWithChildren<SubscriptionDetailsProps>
> = ({stripeCustomerId, slug}) => {
  const {viewer} = useViewer()
  const {data: subscriptionData, status} =
    trpc.subscriptionDetails.forStripeCustomerId.useQuery({
      stripeCustomerId,
    })
  const {isTeamAccountOwner, account} = useAccount()
  const {number_of_members} = account

  const subscriptionName = subscriptionData?.product?.name
  const subscriptionUnitAmount =
    subscriptionData?.latestInvoice?.amount_due ||
    subscriptionData?.price?.unit_amount

  const currency =
    subscriptionData?.latestInvoice?.currency ||
    subscriptionData?.price?.currency

  const subscriptionPrice =
    subscriptionUnitAmount &&
    currency &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(subscriptionUnitAmount / 100)

  const accountBalance =
    subscriptionData?.accountBalance && currency
      ? formatAmountWithCurrency(subscriptionData?.accountBalance, currency)
      : 0

  const pendingCancelation =
    subscriptionData?.subscription?.cancel_at_period_end
  const teamAccountPendingCancelation = isTeamAccountOwner && pendingCancelation

  if (status === 'loading' || !subscriptionData) return null
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
                </strong>{' '}
                Your team still has full access until your current membership
                expires on{' '}
                <strong>
                  {format(
                    new Date(
                      (subscriptionData?.subscription?.current_period_end ||
                        0) * 1000,
                    ),
                    'PPP',
                  )}
                </strong>
              </p>
              <p className="mb-4"></p>

              <p className="mt-4">
                You can update your subscription any time using the update your
                subscription button below.
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
                    Update Your Subscription or Payment Method
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
              {subscriptionData?.accountBalance &&
              subscriptionData?.accountBalance < 0 ? (
                <p>
                  You're account has a{' '}
                  <strong>credit of {accountBalance}</strong> which will be
                  applied to your next payment.
                </p>
              ) : null}
              <p>
                Your {recur(subscriptionData.price)}ly team membership of{' '}
                {account?.capacity} seats will{' '}
                <strong>
                  automatically renew for {subscriptionPrice} on{' '}
                  {format(
                    new Date(account.subscriptions[0].current_period_end),
                    'PPP',
                  )}
                </strong>
                .
              </p>
              <p>
                If you would like to cancel auto-renewal or change the number of
                seats for your team, you can use the update your subscription
                button below.
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
                    Update Your Subscription or Payment Method
                  </a>
                </Link>
              </div>
            </div>
          )}
          <p className="mt-4 w-fit mx-auto">
            <Link href="/team">
              <a className="underline text-blue-600">
                add/remove team members here
              </a>
            </Link>
          </p>
        </div>
      )
    case pendingCancelation:
      return (
        <div>
          <div className="w-fit mx-auto">
            <div className="leading-relaxed mt-4 text-center mx-auto">
              `{' '}
              <h3 className="text-lg font-medium text-center mb-4">
                ⭐️ You have a pro egghead membership! ⭐️
              </h3>
              <p>
                Your{' '}
                <strong>
                  {recur(subscriptionData.price)}ly membership has been{' '}
                  <span className=" bg-red-100 rounded px-1 text-gray-900">
                    cancelled
                  </span>{' '}
                  and it will not auto-renew.
                </strong>{' '}
                You still have full access until your current membership expires
                on{' '}
                <strong>
                  {format(
                    new Date(
                      (subscriptionData?.subscription?.current_period_end ||
                        0) * 1000,
                    ),
                    'PPP',
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
              ⭐️ You have a pro egghead membership ⭐️
            </h3>
            <p>
              Your {recur(subscriptionData.price)}ly membership will
              automatically renew for{' '}
              <strong>
                {subscriptionPrice} on{' '}
                {format(
                  new Date(account.subscriptions[0].current_period_end),
                  'PPP',
                )}
              </strong>
              .
            </p>
            <p>
              If you'd like to update payment information, change your billing
              interval, or cancel auto-renewal you can update your subscription
              below.
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full">
          {(viewer.is_pro || viewer.is_instructor) && (
            <p>
              You still have access to a Pro Membership. If you feel this is in
              error please email{' '}
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
                Update Your Subscription or Payment Method
              </a>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default SubscriptionDetails
