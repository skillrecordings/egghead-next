import * as React from 'react'
import {format} from 'date-fns'
import Link from 'next/link'
import {track} from '../../utils/analytics'
import isEmpty from 'lodash/isEmpty'
import {recur} from 'utils/recur'
import {Stripe} from 'stripe'
import {trpc} from '../../trpc/trpc.client'

const formatAmountWithCurrency = (
  amountInCents: number,
  currency: string,
): string => {
  if (!amountInCents || !currency) return ''

  if (amountInCents < 0) {
    let positiveAmount = Math.abs(amountInCents)
    let formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(positiveAmount / 100)

    return `(${formattedAmount})`
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amountInCents / 100)
  }
}

const isValidDate = (date: any) => {
  return date instanceof Date && !isNaN(date.getTime())
}

const BillingSection = ({stripeCustomerId}: {stripeCustomerId: string}) => {
  const {data: subscriptionData, status} =
    trpc.subscriptionDetails.forStripeCustomerId.useQuery({
      stripeCustomerId,
    })
  if (!subscriptionData || status !== 'success') return null

  const currency = subscriptionData.latestInvoice?.currency || 'USD'
  const recurrence = recur(subscriptionData?.price)

  const accountBalanceDisplay = subscriptionData?.accountBalance
    ? formatAmountWithCurrency(subscriptionData?.accountBalance, currency)
    : 0

  let subscriptionName, subscriptionDescription

  switch (recurrence) {
    case 'year': {
      subscriptionName = 'Annual egghead Team Membership'
      subscriptionDescription = 'Yearly Pro Membership'
      break
    }
    case 'quarter': {
      subscriptionName = 'Quarterly egghead Team Membership'
      subscriptionDescription = 'Quarterly Pro Membership'
      break
    }
    case 'month': {
      subscriptionName = 'Monthly egghead Team Membership'
      subscriptionDescription = 'Monthly Pro Membership'
      break
    }
    default: {
      subscriptionName = ''
      subscriptionDescription = ''
    }
  }

  const currentPeriodStart = new Date(
    (subscriptionData.subscription?.current_period_start || 0) * 1000,
  )
  const currentPeriodEnd = new Date(
    (subscriptionData.subscription?.current_period_end || 0) * 1000,
  )

  const displayCurrentPeriod = [currentPeriodStart, currentPeriodEnd]
    .map(isValidDate)
    .every((isValid) => isValid)

  const activeSubscription =
    subscriptionData.subscription?.status === 'active' &&
    !subscriptionData.subscription.canceled_at

  // If it is too early in the billing period or if the subscription was just
  // created, there may not be an upcoming invoice generated yet. In that case,
  // we see the subscription is active and display 'Pending' for now.
  const nextPaymentAttempt =
    subscriptionData.upcomingInvoice?.next_payment_attempt
  let nextBillDateDisplay: string
  if (!activeSubscription) {
    nextBillDateDisplay = 'Canceled'
  } else if (activeSubscription && isEmpty(subscriptionData.upcomingInvoice)) {
    nextBillDateDisplay = 'Pending'
  } else if (activeSubscription && nextPaymentAttempt) {
    nextBillDateDisplay = format(
      new Date(
        (subscriptionData.upcomingInvoice?.next_payment_attempt || 0) * 1000,
      ),
      'yyyy/MM/dd',
    )
  } else {
    nextBillDateDisplay = '-'
  }

  const quantity = subscriptionData.subscription?.items.data[0].quantity || 1

  let subscriptionUnitPrice

  if (subscriptionData.price?.billing_scheme === 'tiered') {
    // if the user/account is on tiered pricing...
    const tiers = subscriptionData.price.tiers || []
    const matchingTier = tiers.find((tier: Stripe.Price.Tier) => {
      return tier.up_to === null || quantity <= tier.up_to
    })
    subscriptionUnitPrice = formatAmountWithCurrency(
      matchingTier?.unit_amount || 0,
      currency,
    )
  } else {
    // otherwise, they are on legacy pricing...
    // @ts-ignore
    const unitAmount = subscriptionData.subscription?.plan.amount || 0
    subscriptionUnitPrice = formatAmountWithCurrency(unitAmount, currency)
  }

  const totalAmountInCents =
    subscriptionData.upcomingInvoice?.amount_due ||
    subscriptionData.latestInvoice?.amount_due ||
    0
  const subscriptionTotalPrice = formatAmountWithCurrency(
    totalAmountInCents,
    currency,
  )
  return (
    <>
      <h2 className="font-semibold text-xl mt-16">Team Billing</h2>
      <div className="flex flex-row justify-between mt-2">
        <h3 className="font-semibold text-lg">Your Team Membership</h3>
        <span>
          Need Help?{' '}
          <a
            className="font-semibold text-blue-500 hover:text-blue-600"
            href="mailto:support@egghead.io"
          >
            support@egghead.io
          </a>
        </span>
      </div>
      {status === 'success' && (
        <div className="flex flex-col space-y-2 border rounded-md border-gray-300 mt-4 p-3 md:p-4">
          <div className="flex flex-col space-y-3">
            <div className="flex flex-col space-y-4 justify-start md:space-y-0 md:flex-row md:justify-between mt-2">
              <div className="text-lg">{subscriptionName}</div>
              <div className="">
                {subscriptionData?.portalUrl && (
                  <Link href={subscriptionData.portalUrl}>
                    <a
                      onClick={() => {
                        track(`clicked manage team membership`)
                      }}
                      className="mt-4 text-center transition-all duration-150 ease-in-out bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:scale-105 hover:shadow-xl text-white font-semibold py-3 px-5 rounded-md"
                    >
                      Manage Your Team Membership
                    </a>
                  </Link>
                )}
              </div>
            </div>
            <div className="flex flex-col space-y-0.5">
              {displayCurrentPeriod && (
                <>
                  <span className="font-semibold text-sm text-gray-500 dark:text-gray-400">
                    Current Billing Period
                  </span>
                  <span className="">
                    {format(currentPeriodStart, 'yyyy/MM/dd')} -{' '}
                    {format(currentPeriodEnd, 'yyyy/MM/dd')}
                  </span>
                </>
              )}
            </div>
            <div className="flex flex-col space-y-0.5">
              <span className="font-semibold text-sm text-gray-500 dark:text-gray-400">
                Next Billing Date
              </span>
              <span className="">{nextBillDateDisplay}</span>
            </div>
            <div className="flex flex-col space-y-0.5">
              <span className="font-semibold text-sm text-gray-500 dark:text-gray-400">
                Account Balance
              </span>
              <span className="">{accountBalanceDisplay}</span>
            </div>
            <div className="flex flex-row space-x-8">
              <div className="flex flex-col space-y-0.5">
                <span className="font-semibold text-sm text-gray-500 dark:text-gray-400">
                  Description
                </span>
                <span className="">{subscriptionDescription}</span>
              </div>

              <div className="flex flex-col space-y-0.5">
                <span className="font-semibold text-sm text-gray-500 dark:text-gray-400">
                  Seats
                </span>
                <span className="">{quantity}</span>
              </div>

              <div className="flex flex-col space-y-0.5">
                <span className="font-semibold text-sm text-gray-500 dark:text-gray-400">
                  Unit Price
                </span>
                <span className="">{subscriptionUnitPrice}</span>
              </div>

              <div className="flex flex-col space-y-0.5">
                <span className="font-semibold text-sm text-gray-500 dark:text-gray-400">
                  Total Amount
                </span>
                <span className="">{subscriptionTotalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default BillingSection
