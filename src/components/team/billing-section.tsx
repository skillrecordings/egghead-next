import * as React from 'react'
import get from 'lodash/get'
import {format} from 'date-fns'
import Link from 'next/link'
import {track} from '../../utils/analytics'
import isEmpty from 'lodash/isEmpty'
import {recur} from 'hooks/use-subscription-data'

const formatAmountWithCurrency = (
  amountInCents: number,
  currency: string,
): string => {
  if (!amountInCents || !currency) return ''

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amountInCents / 100)
}

const isValidDate = (date: any) => {
  return date instanceof Date && !isNaN(date.getTime())
}

const BillingSection = ({
  subscriptionData,
  loading,
}: {
  subscriptionData: any
  loading: boolean
}) => {
  if (subscriptionData === undefined) return null

  const currency = get(
    subscriptionData,
    'latestInvoice.currency',
    subscriptionData?.price?.unit_amount,
  )

  const recurrence = recur(subscriptionData?.price)

  let subscriptionName, subscriptionDescription

  switch (recurrence) {
    case 'year': {
      subscriptionName = 'Annual egghead Team Subscription'
      subscriptionDescription = 'Yearly Pro Membership'
      break
    }
    case 'quarter': {
      subscriptionName = 'Quarterly egghead Team Subscription'
      subscriptionDescription = 'Quarterly Pro Membership'
      break
    }
    case 'month': {
      subscriptionName = 'Monthly egghead Team Subscription'
      subscriptionDescription = 'Monthly Pro Membership'
      break
    }
    default: {
      subscriptionName = ''
      subscriptionDescription = ''
    }
  }

  const currentPeriodStart = new Date(
    get(subscriptionData, 'subscription.current_period_start') * 1000,
  )
  const currentPeriodEnd = new Date(
    get(subscriptionData, 'subscription.current_period_end') * 1000,
  )

  const displayCurrentPeriod = [currentPeriodStart, currentPeriodEnd]
    .map(isValidDate)
    .every((isValid) => isValid)

  const activeSubscription =
    get(subscriptionData, 'subscription.status') === 'active' &&
    !get(subscriptionData, 'subscription.canceled_at')

  // If it is too early in the billing period or if the subscription was just
  // created, there may not be an upcoming invoice generated yet. In that case,
  // we see the subscription is active and display 'Pending' for now.
  const nextPaymentAttempt = get(
    subscriptionData,
    'upcomingInvoice.next_payment_attempt',
  )
  let nextBillDateDisplay: string
  if (!activeSubscription) {
    nextBillDateDisplay = 'Canceled'
  } else if (activeSubscription && isEmpty(subscriptionData.upcomingInvoice)) {
    nextBillDateDisplay = 'Pending'
  } else if (activeSubscription && nextPaymentAttempt) {
    nextBillDateDisplay = format(
      new Date(
        get(subscriptionData, 'upcomingInvoice.next_payment_attempt') * 1000,
      ),
      'yyyy/MM/dd',
    )
  } else {
    nextBillDateDisplay = '-'
  }

  const quantity = get(subscriptionData, 'subscription.quantity', 1)

  let subscriptionUnitPrice

  if (get(subscriptionData, 'subscription.plan.billing_scheme') === 'tiered') {
    // if the user/account is on tiered pricing...
    const tiers = get(subscriptionData, 'subscription.plan.tiers', [])
    const matchingTier = tiers.find((tier: {up_to: number}) => {
      if (quantity <= tier.up_to || tier.up_to === null) return true

      return false
    })
    subscriptionUnitPrice = formatAmountWithCurrency(
      matchingTier?.unit_amount,
      currency,
    )
  } else {
    // otherwise, they are on legacy pricing...
    const unitAmount = get(subscriptionData, 'subscription.plan.amount')
    subscriptionUnitPrice = formatAmountWithCurrency(unitAmount, currency)
  }

  const totalAmountInCents = get(
    subscriptionData,
    'upcomingInvoice.amount_due',
    get(subscriptionData, 'latestInvoice.amount_due'),
  )
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
      {!loading && (
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
