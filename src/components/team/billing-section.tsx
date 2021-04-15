import * as React from 'react'
import useSubscriptionDetails from 'hooks/use-subscription-data'
import get from 'lodash/get'
import {format} from 'date-fns'
import Link from 'next/link'
import {track} from '../../utils/analytics'

const BillingSection = ({
  stripeCustomerId,
  slug,
}: {
  stripeCustomerId: string
  slug: string
}) => {
  const {subscriptionData, recur, loading} = useSubscriptionDetails({
    stripeCustomerId,
    slug,
  })

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

  const recurrence = recur(subscriptionData?.price)

  const quantity = get(subscriptionData, 'subscription.quantity', 1)

  const nextBillDate = new Date(
    get(subscriptionData, 'subscription.current_period_end') * 1000,
  )

  return (
    <>
      <h2 className="font-semibold text-xl mt-16">Team Billing</h2>
      <div className="flex flex-row justify-between mt-4">
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
        <div className="flex flex-col space-y-2 border border-gray-300 mt-4 p-2">
          <div className="flex flex-row justify-between">
            <span>egghead team annual</span>
            <span>
              Next Bill Date:{' '}
              <span className="font-semibold">
                {format(nextBillDate, 'yyyy/MM/dd')}
              </span>
            </span>
          </div>
          <div>
            <span>
              <span className="font-bold text-lg">{subscriptionPrice}</span> per{' '}
              {recurrence} for <span className="font-semibold">{quantity}</span>{' '}
              {quantity !== 1 ? 'learners' : 'learner'}
            </span>
          </div>
          <div className="flex flex-row-reverse">
            {subscriptionData?.portalUrl && (
              <Link href={subscriptionData.portalUrl}>
                <a
                  onClick={() => {
                    track(`clicked manage team membership`)
                  }}
                  className="mt-4 text-center transition-all duration-150 ease-in-out bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:scale-105 transform hover:shadow-xl text-white font-semibold py-3 px-5 rounded-md"
                >
                  Manage Your Team Membership
                </a>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default BillingSection
