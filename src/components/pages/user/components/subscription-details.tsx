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

enum SubscriptionTypes {
  Paid = 'paid',
  Gift = 'gift',
}

enum SubscriptionStatuses {
  Active = 'active',
  PendingCancelation = 'pending_cancelation',
  Canceled = 'canceled',
}

enum SubscriptionIntervals {
  Monthly = 'monthly',
  Quarterly = 'quarterly',
  Yearly = 'yearly',
}

enum SubscriptionDiscountTypes {
  Ppp = 'ppp',
  Sale = 'sale',
}

type SubscriptionTeamMember = {
  name: string
  email: string
}

type SubscriptionDetails = {
  subscription: {
    // type: SubscriptionTypes.Paid | SubscriptionTypes.Gift
    // status:
    //   | SubscriptionStatuses.Active
    //   | SubscriptionStatuses.PendingCancelation
    //   | SubscriptionStatuses.Canceled
    // interval:
    //   | SubscriptionIntervals.Monthly
    //   | SubscriptionIntervals.Quarterly
    //   | SubscriptionIntervals.Yearly
    type: 'paid' | 'gift'
    status: 'active' | 'pending_cancelation' | 'canceled'
    interval: 'monthly' | 'quarterly' | 'yearly'
    autoRenew: boolean
    currentPeriodEndDate: string // should be Date??
    fullPrice: number
    discount?: {
      // type: SubscriptionDiscountTypes.Ppp | SubscriptionDiscountTypes.Sale
      type: 'sale' | 'ppp'
      country: string | null
      percentage: 50
      priceWithDiscount: number // Used "priceWithDiscount" instead of "newPrice"
    }
    upgrade: {
      savingsPercentage: number
      savingsAmount: number
    }
  }
  team?: {
    owner: {
      name: string
      email: string
      member: boolean
    }
    members?: SubscriptionTeamMember[]
  }
}

const TEMP_DEFAULT_SUBSCRIPTION_DETAILS: SubscriptionDetails = {
  subscription: {
    type: 'paid',
    status: 'active',
    interval: 'monthly',
    autoRenew: true,
    currentPeriodEndDate: '2019-01-16',
    fullPrice: 250,
    discount: {
      type: 'ppp',
      country: 'Ukraine',
      percentage: 50,
      priceWithDiscount: 125,
    },
    upgrade: {
      savingsPercentage: 10,
      savingsAmount: 50,
    },
  },
  team: {
    owner: {
      name: 'John Owner',
      email: 'john@owner.com',
      member: true,
    },
    members: [
      {
        name: 'Dmitri Mendeleev',
        email: 'dmitri.mendeleev@periodic.table.com',
      },
      {
        name: 'Viktor Pelevin',
        email: 'viktor@pelevin.com',
      },
    ],
  },
}

const MissingSubscription = () => {
  return (
    <div className="border border-gray-200 p-4">
      <div>You have no active subscription yet.</div>
      <Link href="/pricing">
        <a className="inline-flex items-center justify-center px-6 py-4 font-semibold text-white transition-all duration-200 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700 mt-8">
          Start to learn
        </a>
      </Link>
    </div>
  )
}

const SubscriptionDetailsWidget: React.FC<{data: SubscriptionDetails}> = ({
  data,
}) => {
  return (
    <div>
      <div>123</div>
    </div>
  )
}

const SubscriptionDetails: React.FunctionComponent<SubscriptionDetailsProps> =
  ({stripeCustomerId, slug}) => {
    const [subscriptionState, setSubscriptionState] = React.useState<
      SubscriptionDetails | undefined
    >(undefined)
    return (
      <>
        <div className="grid grid-cols-2 gap-2 mb-8">
          <div>
            <TempControls
              subscriptionState={subscriptionState}
              setSubscriptionState={setSubscriptionState}
            />
          </div>
          <div>
            <div className="space-y-2 text-xs p-3 bg-gray-100 border-2 border-dashed border-gray-300">
              <pre>{JSON.stringify(subscriptionState, null, 2)}</pre>
            </div>
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

// type ManagedMember = {
//   full_name: string
//   email: string
// }

// enum SubscriptionStates {
//   Active = 'active',
//   PendingCancelation = 'pending_cancelation',
//   Canceled = 'canceled',
// }
// enum SubscriptionTypes {
//   IndividualPaid = 'individual_paid',
//   IndividualGift = 'individual_gift',
//   ManagedOwner = 'managed_owner',
//   ManagedMember = 'managed_member',
// }
// enum SubscriptionIntervals {
//   Monthly = 'monthly',
//   Quarterly = 'quarterly',
//   Yearly = 'yearly',
// }

// type SubscriptionData = {
//   subscription_state:
//     | SubscriptionStates.Active
//     | SubscriptionStates.PendingCancelation
//     | SubscriptionStates.Canceled
//   subscription_auto_renew: boolean
//   subscription_type:
//     | SubscriptionTypes.IndividualPaid
//     | SubscriptionTypes.IndividualGift
//     | SubscriptionTypes.ManagedOwner
//     | SubscriptionTypes.ManagedMember
//   subscription_interval:
//     | SubscriptionIntervals.Monthly
//     | SubscriptionIntervals.Quarterly
//     | SubscriptionIntervals.Yearly
//   current_period_end_date: string
//   managed_members_list?: ManagedMember[]
//   stripe_portal_link?: string
//   current_plan_price: number
//   current_plan_name: string
//   current_plan_discount: number
// }

// const TEMP_DEFAULT_SUBSCRIPTION_DATA: SubscriptionData = {
//   subscription_state: SubscriptionStates.Active,
//   subscription_auto_renew: true,
//   subscription_type: SubscriptionTypes.IndividualPaid,
//   subscription_interval: SubscriptionIntervals.Monthly,
//   current_period_end_date: '12/11/2022',
//   managed_members_list: [
//     {
//       full_name: 'Dmitri Mendeleev',
//       email: 'dmitri.mendeleev@periodic.table.com',
//     },
//     {
//       full_name: 'Viktor Pelevin',
//       email: 'vik.tor@pelevin.com',
//     },
//   ],
//   stripe_portal_link: 'www.stripeportallink.com',
//   current_plan_price: 50,
//   current_plan_name: 'Monthly',
//   current_plan_discount: 25,
// }

// const {
//   subscription_state,
//   subscription_auto_renew,
//   subscription_type,
//   subscription_interval,
//   current_period_end_date,
//   managed_members_list,
//   stripe_portal_link,
//   current_plan_price,
//   current_plan_name,
//   current_plan_discount,
// } = data
// return (
//   <div className="divide-y divide-gray-200">
//     {/* Greeting */}
//     <div className="py-3 bg-gray-100 px-4">
//       <p>
//         ⭐️ You're an <strong>egghead Member!</strong>
//       </p>
//       <p>
//         You have a PRO access via <b>{subscription_type}</b> subscription.
//       </p>
//       {subscription_type !== 'managed_member' && (
//         <p>
//           You can update your plan and payment information below via Stripe.
//         </p>
//       )}
//     </div>

//     {/* Subscription interval */}
//     <div className="py-3 bg-red-100 px-4">
//       <p>
//         You have <b>{subscription_interval}</b> subscription
//       </p>
//       {subscription_interval !== 'yearly' &&
//         subscription_type !== 'managed_member' && (
//           <p>
//             Save <b>n%</b> with YEARLY subscription
//           </p>
//         )}
//     </div>

//     {/* Current period end date */}
//     <div className="py-3 bg-lime-100 px-4">
//       <p>
//         Current period end date: <b>{current_period_end_date}</b>
//       </p>
//     </div>

//     {/* List of Managed Members and Seat Counts / Contact team manager */}
//     {managed_members_list && subscription_type === 'managed_owner' && (
//       <div className="py-3 bg-violet-100 px-4">
//         <p>
//           You are the <b>team manager</b>.
//         </p>
//         <p>List of team members:</p>
//         <ul className="list-disc pl-6">
//           {managed_members_list.map((item, i) => {
//             return (
//               <li key={i}>
//                 <i>
//                   {item.full_name} ({item.email})
//                 </i>
//               </li>
//             )
//           })}
//         </ul>
//       </div>
//     )}

//     {/* List of Managed Members and Seat Counts / Contact team manager */}
//     {subscription_type === 'managed_member' && (
//       <div className="py-3 bg-emerald-100 px-4">
//         <p>You can't manage the subscription.</p>
//         <p>Contact your team manager:</p>
//         <i>Alex Ferguson (alex.ferguson@manchester.com)</i>
//       </div>
//     )}

//     {/* Stripe Portal Link */}
//     {subscription_type !== 'managed_member' && stripe_portal_link && (
//       <div className="py-3">
//         <Link href="/">
//           <a className="inline-flex items-center justify-center px-6 py-4 font-semibold text-white transition-all duration-200 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700">
//             Manage Subscription
//           </a>
//         </Link>
//       </div>
//     )}
//   </div>
// )

const TempControls: React.FC<{
  subscriptionState: SubscriptionDetails | undefined
  setSubscriptionState: React.Dispatch<
    React.SetStateAction<SubscriptionDetails | undefined>
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
    <div className="mb-8 space-y-3 flex flex-col items-start bg-yellow-100 px-3 border-2 border-dashed border-gray-300 py-2 h-full">
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
                ? TEMP_DEFAULT_SUBSCRIPTION_DETAILS
                : undefined,
            )
          }
        />
        <span>subscription data exists</span>
      </label>
      {subscriptionState && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">type:</h3>
            <div className="flex space-x-3">
              {Object.values(SubscriptionTypes).map((type, i) => {
                return (
                  <label
                    key={i}
                    htmlFor={`subscription-type-${type}`}
                    className="space-x-1 flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="subscription-type"
                      id={`subscription-type-${type}`}
                      onChange={() =>
                        setSubscriptionState({
                          ...subscriptionState,
                          subscription: {
                            ...subscriptionState.subscription,
                            type: type,
                          },
                        })
                      }
                      checked={subscriptionState?.subscription.type === type}
                    />
                    <span>{type}</span>
                  </label>
                )
              })}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">status:</h3>
            <div>
              {Object.values(SubscriptionStatuses).map((status, i) => {
                return (
                  <label
                    key={i}
                    htmlFor={`subscription-state-${status}`}
                    className="space-x-1 flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="subscription-state"
                      id={`subscription-state-${status}`}
                      onChange={() =>
                        setSubscriptionState({
                          ...subscriptionState,
                          subscription: {
                            ...subscriptionState.subscription,
                            status: status,
                          },
                        })
                      }
                      checked={
                        subscriptionState?.subscription.status === status
                      }
                    />
                    <span>{status}</span>
                  </label>
                )
              })}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">interval:</h3>
            <div className="flex space-x-3">
              {Object.values(SubscriptionIntervals).map((interval, i) => {
                return (
                  <label
                    key={i}
                    htmlFor={`subscription-interval-${interval}`}
                    className="space-x-1 flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="subscription-interval"
                      id={`subscription-interval-${interval}`}
                      onChange={() =>
                        setSubscriptionState({
                          ...subscriptionState,
                          subscription: {
                            ...subscriptionState.subscription,
                            interval: interval,
                          },
                        })
                      }
                      checked={
                        subscriptionState?.subscription.interval === interval
                      }
                    />
                    <span>{interval}</span>
                  </label>
                )
              })}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">autorenew:</h3>
            <div className="flex space-x-3">
              <label
                htmlFor="subscription-autorenew-on"
                className="space-x-1 flex items-center cursor-pointer"
              >
                <input
                  type="radio"
                  name="subscription-autorenew"
                  id="subscription-autorenew-on"
                  onChange={() =>
                    setSubscriptionState({
                      ...subscriptionState,
                      subscription: {
                        ...subscriptionState.subscription,
                        autoRenew: true,
                      },
                    })
                  }
                  checked={subscriptionState?.subscription.autoRenew === true}
                />
                <span>on</span>
              </label>
              <label
                htmlFor="subscription-autorenew-off"
                className="space-x-1 flex items-center cursor-pointer"
              >
                <input
                  type="radio"
                  name="subscription-autorenew"
                  id="subscription-autorenew-off"
                  onChange={() =>
                    setSubscriptionState({
                      ...subscriptionState,
                      subscription: {
                        ...subscriptionState.subscription,
                        autoRenew: false,
                      },
                    })
                  }
                  checked={subscriptionState?.subscription.autoRenew === false}
                />
                <span>off</span>
              </label>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">discount:</h3>
            <div className="flex space-x-3">
              <label
                htmlFor="subscription-discount-on"
                className="space-x-1 flex items-center cursor-pointer"
              >
                <input
                  type="radio"
                  name="subscription-discount"
                  id="subscription-discount-on"
                  onChange={() =>
                    setSubscriptionState({
                      ...subscriptionState,
                      subscription: {
                        ...subscriptionState.subscription,
                        discount: {
                          type: 'ppp',
                          country: 'Ukraine',
                          percentage: 50,
                          priceWithDiscount: 125,
                        },
                      },
                    })
                  }
                  checked={
                    subscriptionState?.subscription.discount !== undefined
                  }
                />
                <span>on</span>
              </label>
              <label
                htmlFor="subscription-discount-off"
                className="space-x-1 flex items-center cursor-pointer"
              >
                <input
                  type="radio"
                  name="subscription-discount"
                  id="subscription-discount-off"
                  onChange={() =>
                    setSubscriptionState({
                      ...subscriptionState,
                      subscription: {
                        ...subscriptionState.subscription,
                        discount: undefined,
                      },
                    })
                  }
                  checked={
                    subscriptionState?.subscription.discount === undefined
                  }
                />
                <span>off</span>
              </label>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">team:</h3>
            <div className="flex space-x-3">
              <label
                htmlFor="subscription-team-on"
                className="space-x-1 flex items-center cursor-pointer"
              >
                <input
                  type="radio"
                  name="subscription-team"
                  id="subscription-team-on"
                  onChange={() =>
                    setSubscriptionState({
                      ...subscriptionState,
                      team: {
                        owner: {
                          name: 'John Owner',
                          email: 'john@owner.com',
                          member: true,
                        },
                        members: [
                          {
                            name: 'Dmitri Mendeleev',
                            email: 'dmitri.mendeleev@periodic.table.com',
                          },
                          {
                            name: 'Viktor Pelevin',
                            email: 'viktor@pelevin.com',
                          },
                        ],
                      },
                    })
                  }
                  checked={subscriptionState?.team !== undefined}
                />
                <span>on</span>
              </label>
              <label
                htmlFor="subscription-team-off"
                className="space-x-1 flex items-center cursor-pointer"
              >
                <input
                  type="radio"
                  name="subscription-team"
                  id="subscription-team-off"
                  onChange={() =>
                    setSubscriptionState({
                      ...subscriptionState,
                      team: undefined,
                    })
                  }
                  checked={subscriptionState?.team === undefined}
                />
                <span>off</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
