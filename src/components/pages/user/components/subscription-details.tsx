import React, {Suspense, useMemo} from 'react'
import Link from 'next/link'
import {track} from '@/utils/analytics'
import {useViewer} from '@/context/viewer-context'
import {format} from 'date-fns'
import {recur} from '@/utils/recur'
import {useAccount} from '@/hooks/use-account'
import {trpc} from '@/app/_trpc/client'
import PricingProvider from '@/components/pricing/pricing-provider'
import PricingCard from '@/components/pricing/pricing-card'
import LifetimePriceProvider from '@/components/pricing/lifetime-price-provider'
import PlanTitle from '@/components/pricing/plan-title'
import PlanPrice from '@/components/pricing/plan-price'
import PlanFeatures from '@/components/pricing/plan-features'
import GetAccessButton from '@/components/pricing/get-access-button'
import {twMerge} from 'tailwind-merge'
import {Stripe} from 'stripe'

const ManageSubscriptionCard = ({
  account,
  priceData,
  subscriptionPrice,
  subscriptionName,
  subscriptionPortalUrl,
  currency,
}: {
  account: Stripe.Account
  subscriptionPrice: string | 0 | null | undefined
  subscriptionName: string
  subscriptionPortalUrl: string
  currency: string
  priceData: Stripe.Price | undefined
}) => {
  return (
    <PricingCard>
      <div className="flex flex-col h-full">
        <div className="flex flex-col items-center pt-12 pb-6">
          <p className="capitalize">{recur(priceData)}ly Subscription</p>
          <PlanTitle className="text-2xl">Your Current Plan</PlanTitle>
          <div className="pt-6">
            <PlanPrice
              planPrice={subscriptionPrice ? subscriptionPrice : ''}
              displayDollars={false}
              currency={currency}
            />
          </div>
          <SubscriptionPortalLink
            subscriptionPortalUrl={subscriptionPortalUrl}
            text="Manage"
            className="w-full outline-1 outline-black"
            buttonClassName="bg-transparent outline outline-1 outline-gray-400 hover:bg-gray-100 active:bg-gray-200 text-black w-full"
          />
        </div>
        <PlanFeatures
          planFeatures={[
            'Access to all premium courses',
            'Closed captions for every video',
            'Commenting and support',
            'RSS course feeds',
          ]}
        />
      </div>
    </PricingCard>
  )
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

type StripeAccountSubscription = {
  status: string
  stripe_subscription_id: string
}

const SubscriptionDetails: React.FunctionComponent<
  React.PropsWithChildren<{
    subscription: StripeAccountSubscription
    stripeCustomerId: string
    slug: string
  }>
> = ({subscription, stripeCustomerId, slug}) => {
  const {viewer} = useViewer()
  const {data: subscriptionData, status} =
    trpc.subscriptionDetails.forStripeCustomerId.useQuery({
      stripeCustomerId,
    })

  // This should only run once and have its value cached
  const {data: couponPromoCode} =
    trpc.subscriptionDetails.couponPromoCode.useQuery({
      amountPaid: subscriptionData?.latestInvoice?.amount_paid,
    })

  const {isTeamAccountOwner, account} = useAccount()

  const subscriptionName = subscriptionData?.product?.name
  const subscriptionUnitAmount =
    subscriptionData?.latestInvoice?.amount_due ||
    subscriptionData?.price?.unit_amount

  const currency =
    subscriptionData?.latestInvoice?.currency ||
    subscriptionData?.price?.currency

  console.log({currency})

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

  console.log({account, subscriptionData})

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
          <SubscriptionPortalLink
            subscriptionPortalUrl={subscriptionData.portalUrl}
          />
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
          <SubscriptionPortalLink
            subscriptionPortalUrl={subscriptionData.portalUrl}
          />
          <p className="mt-4 w-fit mx-auto">
            <Link href="/team" className="underline text-blue-600">
              add/remove team members here
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
              <LifetimePriceProvider couponPromoCode={couponPromoCode}>
                <PricingCard
                  className="sm:order-2 order-1 sm:scale-110 min-w-[300px] z-30 drop-shadow-2xl"
                  displayImage
                >
                  <div className="flex flex-col h-full">
                    <div className="flex flex-col items-center pt-12 pb-6">
                      <div className="bg-gray-100 py-1 px-3 text-xs rounded-full font-medium dark:bg-gray-700 mb-1">
                        BEST VALUE
                      </div>
                      <PlanTitle className="text-2xl">
                        Lifetime Membership
                      </PlanTitle>
                      <div className="pt-6">
                        <PlanPrice />
                      </div>
                      <GetAccessButton
                        className="bg-yellow-300 text-black"
                        hoverClassName="hover:bg-yellow-400 hover:scale-105"
                      />
                    </div>
                    <PlanFeatures
                      numberOfHighlightedFeatures={3}
                      highlightHexColor="#FDE046"
                    />
                  </div>
                </PricingCard>
              </LifetimePriceProvider>
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
          <SubscriptionPortalLink
            subscriptionPortalUrl={subscriptionData.portalUrl}
            text="Renew your Membership"
          />
        </div>
      )
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-full">
        {subscriptionName ? (
          <div className="md:w-[75ch] mx-auto">
            <div className="text-left w-full leading-relaxed mt-4 space-y-4">
              <h3 className="text-lg font-medium text-center">
                ⭐️ You have a pro egghead membership ⭐️
              </h3>
              <div className="flex sm:flex-row flex-col items-center w-full">
                <LifetimePriceProvider couponPromoCode={couponPromoCode}>
                  <ManageSubscriptionCard
                    subscriptionPrice={subscriptionPrice}
                    subscriptionName={subscriptionName}
                    subscriptionPortalUrl={subscriptionData.portalUrl}
                    currency={currency || 'USD'}
                    account={account}
                    priceData={subscriptionData.price}
                  />
                  <PricingCard className="w-fit">
                    <div className="flex flex-col h-full">
                      <div className="flex flex-col items-center pt-12 pb-6">
                        <div className="bg-gray-100 py-1 px-3 text-xs rounded-full font-medium dark:bg-gray-700 mb-1">
                          UPGRADE
                        </div>
                        <PlanTitle className="text-2xl">
                          Lifetime Membership
                        </PlanTitle>
                        <div className="pt-6">
                          <PlanPrice />
                        </div>
                        <GetAccessButton
                          className="bg-yellow-300 text-black"
                          hoverClassName="hover:bg-yellow-400 hover:scale-105"
                        />
                      </div>
                      <PlanFeatures
                        numberOfHighlightedFeatures={3}
                        highlightHexColor="#FDE046"
                      />
                    </div>
                  </PricingCard>
                </LifetimePriceProvider>
              </div>
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
                interval, or cancel auto-renewal you can update your
                subscription below.
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
        <SubscriptionPortalLink
          subscriptionPortalUrl={subscriptionData.portalUrl}
        />
      </div>
    </Suspense>
  )
}

const SubscriptionPortalLink = ({
  subscriptionPortalUrl,
  text = 'Update Your Subscription or Payment Method',
  className,
  buttonClassName,
}: {
  subscriptionPortalUrl: string | undefined
  text?: string
  className?: string
  buttonClassName?: string
}) => {
  if (!subscriptionPortalUrl) return null

  return (
    <div
      className={twMerge(
        'bg-primary-2 text-accents-3 rounded-b-md mt-6',
        className,
      )}
    >
      <div className="flex flex-col justify-between items-center">
        <Link
          href={subscriptionPortalUrl}
          onClick={() => {
            track(`clicked manage membership`)
          }}
          className={twMerge(
            'w-2/3 px-5 py-3 font-semibold text-center text-white transition-all duration-150 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 hover:scale-105 hover:shadow-xl',
            buttonClassName,
          )}
        >
          {text}
        </Link>
      </div>
    </div>
  )
}

export default SubscriptionDetails
