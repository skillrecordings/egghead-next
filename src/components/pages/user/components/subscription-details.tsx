import React from 'react'
import Link from 'next/link'
import {get, isEmpty} from 'lodash'
import cx from 'classnames'

import {track} from 'utils/analytics'
import {useViewer} from 'context/viewer-context'
import useSubscriptionDetails, {recur} from 'hooks/use-subscription-data'

type SubscriptionDetailsProps = {
  stripeCustomerId: string
  slug: string
}

type ManagedMember = {
  full_name: string
  email: string
}

type SubscriptionData = {
  subscription_state: 'active' | 'pending_cancelation' | 'canceled'
  subscription_type: 'individual' | 'managed_owner' | 'managed_member'
  subscription_interval: 'monthly' | 'quaterly' | 'yearly'
  current_period_end_date: string
  auto_renew: boolean
  managed_members_list?: ManagedMember[]
  stripe_portal_link?: string
  yearly_price: number
  current_plan_price: number
}

const TEMP_DEFAULT_SUBSCRIPTION_DATA: SubscriptionData = {
  subscription_state: 'active',
  subscription_type: 'individual',
  subscription_interval: 'monthly',
  current_period_end_date: '12/11/2022',
  auto_renew: true,
  managed_members_list: [
    {
      full_name: 'Dmitri Mendeleev',
      email: 'dmitri.mendeleev@periodic.table.com',
    },
    {
      full_name: 'Viktor Pelevin',
      email: 'vik.tor@pelevin.com',
    },
  ],
  stripe_portal_link: 'www.stripeportallink.com',
  yearly_price: 250,
  current_plan_price: 35,
}

const TempControls: React.FC<{
  subscriptionState: SubscriptionData | undefined
  setSubscriptionState: React.Dispatch<
    React.SetStateAction<SubscriptionData | undefined>
  >
}> = ({subscriptionState, setSubscriptionState}) => {
  const onChangeHandler = (field: string, value: string) => {
    if (setSubscriptionState && subscriptionState) {
      setSubscriptionState({
        ...subscriptionState,
        [field]: value,
      })
    }
  }
  return (
    <div className="mb-8 space-y-3 flex flex-col items-start bg-yellow-100 px-3 border-4 border-dashed border-gray-300 py-2">
      <label
        htmlFor="subscription-state-toggle"
        className="space-x-1 flex items-center cursor-pointer"
      >
        <input
          type="checkbox"
          id="subscription-state-toggle"
          onChange={() =>
            setSubscriptionState(
              isEmpty(subscriptionState)
                ? TEMP_DEFAULT_SUBSCRIPTION_DATA
                : undefined,
            )
          }
          defaultChecked={subscriptionState?.subscription_state === 'active'}
        />
        <span>subscription data exists</span>
      </label>
      <div className={cx(subscriptionState === undefined && 'opacity-30')}>
        <div className="flex space-x-3 items-center">
          <h3 className="text-lg font-semibold">subscription_state:</h3>
          <div className="flex space-x-3 items-center">
            <label
              htmlFor="subscription-state-active"
              className="space-x-1 flex items-center cursor-pointer"
            >
              <input
                type="radio"
                name="subscription-state"
                id="subscription-state-active"
                onChange={() => onChangeHandler('subscription_state', 'active')}
                checked={subscriptionState?.subscription_state === 'active'}
                disabled={subscriptionState === undefined}
              />
              <span>active</span>
            </label>
            <label
              htmlFor="subscription-state-pending-cancelation"
              className="space-x-1 flex items-center cursor-pointer"
            >
              <input
                type="radio"
                name="subscription-state"
                id="subscription-state-pending-cancelation"
                onChange={() =>
                  onChangeHandler('subscription_state', 'pending_cancelation')
                }
                checked={
                  subscriptionState?.subscription_state ===
                  'pending_cancelation'
                }
                disabled={subscriptionState === undefined}
              />
              <span>pending_cancelation</span>
            </label>
            <label
              htmlFor="subscription-state-canceled"
              className="space-x-1 flex items-center cursor-pointer"
            >
              <input
                type="radio"
                name="subscription-state"
                id="subscription-state-canceled"
                onChange={() =>
                  onChangeHandler('subscription_state', 'canceled')
                }
                checked={subscriptionState?.subscription_state === 'canceled'}
                disabled={subscriptionState === undefined}
              />
              <span>canceled</span>
            </label>
          </div>
        </div>
        <div className="flex space-x-3 items-center">
          <h3 className="text-lg font-semibold">subscription_type:</h3>
          <div className="flex space-x-3 items-center">
            <label
              htmlFor="subscription-type-individual"
              className="space-x-1 flex items-center cursor-pointer"
            >
              <input
                type="radio"
                name="subscription-type"
                id="subscription-type-individual"
                onChange={() =>
                  onChangeHandler('subscription_type', 'individual')
                }
                checked={subscriptionState?.subscription_type === 'individual'}
                disabled={subscriptionState === undefined}
              />
              <span>individual</span>
            </label>
            <label
              htmlFor="subscription-type-managed-owner"
              className="space-x-1 flex items-center cursor-pointer"
            >
              <input
                type="radio"
                name="subscription-type"
                id="subscription-type-managed-owner"
                onChange={() =>
                  onChangeHandler('subscription_type', 'managed_owner')
                }
                checked={
                  subscriptionState?.subscription_type === 'managed_owner'
                }
                disabled={subscriptionState === undefined}
              />
              <span>managed_owner</span>
            </label>
            <label
              htmlFor="subscription-type-managed-member"
              className="space-x-1 flex items-center cursor-pointer"
            >
              <input
                type="radio"
                name="subscription-type"
                id="subscription-type-managed-member"
                onChange={() =>
                  onChangeHandler('subscription_type', 'managed_member')
                }
                checked={
                  subscriptionState?.subscription_type === 'managed_member'
                }
                disabled={subscriptionState === undefined}
              />
              <span>managed_member</span>
            </label>
          </div>
        </div>
        <div className="flex space-x-3 items-center">
          <h3 className="text-lg font-semibold">subscription_interval:</h3>
          <div className="flex space-x-3 items-center">
            <label
              htmlFor="subscription-interval-monthly"
              className="space-x-1 flex items-center cursor-pointer"
            >
              <input
                type="radio"
                name="subscription-interval"
                id="subscription-interval-monthly"
                onChange={() =>
                  onChangeHandler('subscription_interval', 'monthly')
                }
                checked={subscriptionState?.subscription_interval === 'monthly'}
                disabled={subscriptionState === undefined}
              />
              <span>monthly</span>
            </label>
            <label
              htmlFor="subscription-interval-quaterly"
              className="space-x-1 flex items-center cursor-pointer"
            >
              <input
                type="radio"
                name="subscription-interval"
                id="subscription-interval-quaterly"
                onChange={() =>
                  onChangeHandler('subscription_interval', 'quaterly')
                }
                checked={
                  subscriptionState?.subscription_interval === 'quaterly'
                }
                disabled={subscriptionState === undefined}
              />
              <span>quaterly</span>
            </label>
            <label
              htmlFor="subscription-interval-yearly"
              className="space-x-1 flex items-center cursor-pointer"
            >
              <input
                type="radio"
                name="subscription-interval"
                id="subscription-interval-yearly"
                onChange={() =>
                  onChangeHandler('subscription_interval', 'yearly')
                }
                checked={subscriptionState?.subscription_interval === 'yearly'}
                disabled={subscriptionState === undefined}
              />
              <span>yearly</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

const MissingSubscription = () => {
  return (
    <div>
      <div>You have no active subscription yet.</div>
      <Link href="/pricing">
        <a className="inline-flex items-center justify-center px-6 py-4 font-semibold text-white transition-all duration-200 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700 mt-8">
          Start to learn
        </a>
      </Link>
    </div>
  )
}

const SubscriptionDetailsWidget: React.FC<{data: SubscriptionData}> = ({
  data,
}) => {
  const {
    subscription_state,
    subscription_type,
    subscription_interval,
    current_period_end_date,
    auto_renew,
    managed_members_list,
    stripe_portal_link,
  } = data
  return (
    <div className="divide-y divide-gray-200 px-4 py-1 border border-gray-200">
      {/* Greeting */}
      <div className="py-3">
        <p>
          ⭐️ You're an <strong>egghead Member!</strong>
        </p>
        <p>
          You have a PRO access via <b>{subscription_type}</b> subscription.
        </p>
        {subscription_type !== 'managed_member' && (
          <p>
            You can update your plan and payment information below via Stripe.
          </p>
        )}
      </div>

      {/* Subscription interval */}
      <div className="py-3">
        <p>
          You have <b>{subscription_interval}</b> subscription
        </p>
        {subscription_interval !== 'yearly' &&
          subscription_type !== 'managed_member' && (
            <p>
              Save <b>n%</b> with YEARLY subscription
            </p>
          )}
      </div>

      {/* Current period end date */}
      <div className="py-3">
        <p>Current period end date: {current_period_end_date}</p>
      </div>

      {/* List of Managed Members and Seat Counts / Contact team manager */}
      {managed_members_list && subscription_type === 'managed_owner' && (
        <div className="py-3">
          <p>You are the team manager.</p>
          <p>List of team members:</p>
          <ul className="list-disc pl-6">
            {managed_members_list.map((item, i) => {
              return (
                <li key={i}>
                  <i>
                    {item.full_name} ({item.email})
                  </i>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* List of Managed Members and Seat Counts / Contact team manager */}
      {subscription_type === 'managed_member' && (
        <div className="py-3">
          <p>You can't manage the subscription.</p>
          <p>Contact your team manager:</p>
          <i>Alex Ferguson (alex.ferguson@manchester.com)</i>
        </div>
      )}

      {/* Stripe Portal Link */}
      {subscription_type !== 'managed_member' && stripe_portal_link && (
        <div className="py-3">
          <Link href="/">
            <a className="inline-flex items-center justify-center px-6 py-4 font-semibold text-white transition-all duration-200 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700">
              Manage Subscription
            </a>
          </Link>
        </div>
      )}
    </div>
  )
}

const SubscriptionDetails: React.FunctionComponent<SubscriptionDetailsProps> =
  ({stripeCustomerId, slug}) => {
    const [subscriptionState, setSubscriptionState] = React.useState<
      SubscriptionData | undefined
    >(undefined)
    console.log('subscriptionState:', subscriptionState)
    return (
      <>
        <TempControls
          subscriptionState={subscriptionState}
          setSubscriptionState={setSubscriptionState}
        />
        <div className="mb-12 space-y-2">
          <div>
            subscription_state:{' '}
            <b>
              {subscriptionState?.subscription_state ??
                typeof subscriptionState?.subscription_state}
            </b>
          </div>
          <div>
            subscription_type:{' '}
            <b>
              {subscriptionState?.subscription_type ??
                typeof subscriptionState?.subscription_type}
            </b>
          </div>
          <div>
            subscription_interval:{' '}
            <b>
              {subscriptionState?.subscription_interval ??
                typeof subscriptionState?.subscription_interval}
            </b>
          </div>
        </div>
        {subscriptionState ? (
          <SubscriptionDetailsWidget data={subscriptionState} />
        ) : (
          <MissingSubscription />
        )}
      </>
    )
  }

export default SubscriptionDetails

// const SubscriptionDetails: React.FunctionComponent<SubscriptionDetailsProps> =
//   ({stripeCustomerId, slug}) => {
//     const {viewer} = useViewer()
//     const {subscriptionData, loading} = useSubscriptionDetails({
//       stripeCustomerId,
//     })

//     const subscriptionName = subscriptionData?.product?.name
//     const subscriptionUnitAmount = get(
//       subscriptionData,
//       'latestInvoice.amount_due',
//       subscriptionData?.price?.unit_amount,
//     )
//     const currency = get(
//       subscriptionData,
//       'latestInvoice.currency',
//       subscriptionData?.price?.unit_amount,
//     )
//     const subscriptionPrice =
//       subscriptionUnitAmount &&
//       currency &&
//       new Intl.NumberFormat('en-US', {
//         style: 'currency',
//         currency: currency,
//         minimumFractionDigits: 0,
//       }).format(subscriptionUnitAmount / 100)

//     return !loading && subscriptionData ? (
//       <div className="w-full">
//         {subscriptionName ? (
//           <>
//             <h3 className="mb-2 text-lg font-medium">
//               ⭐️ You're an <strong>egghead Member!</strong>
//             </h3>
//             <p className="text-accents-5">
//               You can update your plan and payment information below via Stripe.
//             </p>
//             <div className="mt-8 mb-4 font-semibold">
//               {!subscriptionData?.portalUrl ? (
//                 <div className="h-12 mb-6">loading</div>
//               ) : subscriptionPrice ? (
//                 <div className="flex space-x-2">
//                   <div>
//                     You are currently paying{' '}
//                     {`${subscriptionPrice}/${recur(subscriptionData.price)}`}{' '}
//                     for your membership
//                   </div>
//                   {subscriptionData?.subscription?.cancel_at_period_end && (
//                     <div className="flex items-center justify-center px-2 py-1 text-xs bg-gray-100 rounded text-gray-1000 mt-2">
//                       cancelled
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <Link href="/pricing">
//                   <a
//                     onClick={() => {
//                       track(`clicked pricing`, {
//                         location: 'accounts',
//                       })
//                     }}
//                   >
//                     Join today!
//                   </a>
//                 </Link>
//               )}
//             </div>
//           </>
//         ) : (
//           <>
//             <h3 className="mb-2 text-lg font-medium">
//               No paid subscription found.
//             </h3>
//             {(viewer.is_pro || viewer.is_instructor) && (
//               <p>
//                 You still have access to a Pro Membership. If you feel this is
//                 in error please email{' '}
//                 <a
//                   className="text-blue-600 underline hover:text-blue-700"
//                   href="mailto:support@egghead.io"
//                 >
//                   support@egghead.io
//                 </a>
//               </p>
//             )}
//             <p className="mt-1">
//               You can still update your payment information below via Stripe.
//             </p>
//           </>
//         )}
//         {(subscriptionData?.subscription?.cancel_at_period_end ||
//           subscriptionData?.portalUrl) && (
//           <div className="p-4 border-t border-accents-1 bg-primary-2 text-accents-3 rounded-b-md">
//             <div className="flex flex-col items-start justify-between sm:items-center">
//               {subscriptionData?.subscription?.cancel_at_period_end && (
//                 <p className="pb-4 sm:pb-0">
//                   Your account is currently cancelled. You'll have access until
//                   the end of your current billing period. You can also renew at
//                   any time.
//                 </p>
//               )}
//               {subscriptionData?.portalUrl && (
//                 <Link href={subscriptionData.portalUrl}>
//                   <a
//                     onClick={() => {
//                       track(`clicked manage membership`)
//                     }}
//                     className="w-full px-5 py-3 mt-4 font-semibold text-center text-white transition-all duration-150 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 hover:scale-105 hover:shadow-xl"
//                   >
//                     Manage Your Membership
//                   </a>
//                 </Link>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     ) : null
//   }
