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
      full_name: 'Full Name',
      email: 'full.name@gmail.com',
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
  console.log('subscriptionState:', subscriptionState)
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
                defaultChecked={
                  subscriptionState?.subscription_state === 'active'
                }
                disabled={subscriptionState === undefined}
              />
              <span>Active</span>
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
                defaultChecked={
                  subscriptionState?.subscription_state ===
                  'pending_cancelation'
                }
                disabled={subscriptionState === undefined}
              />
              <span>Pending Cancelation</span>
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
                defaultChecked={
                  subscriptionState?.subscription_state === 'canceled'
                }
                disabled={subscriptionState === undefined}
              />
              <span>Canceled</span>
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
                defaultChecked={
                  subscriptionState?.subscription_type === 'individual'
                }
                disabled={subscriptionState === undefined}
              />
              <span>Individual</span>
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
                defaultChecked={
                  subscriptionState?.subscription_type === 'managed_owner'
                }
                disabled={subscriptionState === undefined}
              />
              <span>Managed Owner</span>
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
                defaultChecked={
                  subscriptionState?.subscription_type === 'managed_member'
                }
                disabled={subscriptionState === undefined}
              />
              <span>Managed Member</span>
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

const SubscriptionDetailsWidget = () => {
  return (
    <div>
      <div>SubscriptionDetailsWidget</div>
    </div>
  )
}

const SubscriptionDetails: React.FunctionComponent<SubscriptionDetailsProps> =
  ({stripeCustomerId, slug}) => {
    const [subscriptionState, setSubscriptionState] = React.useState<
      SubscriptionData | undefined
    >(undefined)
    return (
      <>
        <TempControls
          subscriptionState={subscriptionState}
          setSubscriptionState={setSubscriptionState}
        />
        {subscriptionState ? (
          <SubscriptionDetailsWidget />
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
