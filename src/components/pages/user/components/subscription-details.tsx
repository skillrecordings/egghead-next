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

// TODO: add a case when user has no subscription at all
const AccessLevelSummary: React.FC<{isBasic: boolean}> = ({isBasic}) => {
  const BasicAccessMessage = () => (
    <>
      <strong>egghead Basic Membership</strong>
      <p>
        You have access to all of our Basic videos. You can subscribe for full
        access to all of our Pro<sup>⭐️</sup> lessons any time.
      </p>
    </>
  )
  const ProAccessMessage = () => (
    <>
      <strong>
        egghead Pro<sup>⭐️</sup> Membership
      </strong>
      <p>
        You currently have access to all of our Pro<sup>⭐️</sup> and Basic
        lessons.
      </p>
    </>
  )
  return <div>{isBasic ? <BasicAccessMessage /> : <ProAccessMessage />}</div>
}

const IndividualSubscriptionDetails: React.FC<any> = ({
  status,
  type,
  interval,
  currentPeriodEndDate,
  price,
}) => {
  return (
    <div>
      {type === 'gift' && (
        <p>
          You currently have a <strong>Gift Subscription</strong> that ends on{' '}
          <strong>{currentPeriodEndDate}</strong>. After that, you would need to
          subscribe to a Pro plan to access our Pro Lessons.
        </p>
      )}
      {type === 'paid' && status === 'active' && (
        <>
          <p>
            Your <strong>{interval}</strong> subscription will automatically
            renew for <strong>${price}</strong> on{' '}
            <strong>{currentPeriodEndDate}</strong>.
          </p>
          <p>
            If you would like to cancel autorenewal, you can use the manage
            subscription link to make changes.
          </p>
        </>
      )}
      {type === 'paid' && status === 'pending_cancelation' && (
        <p>
          Your <strong>{interval}</strong> subscription will end on{' '}
          <strong>{currentPeriodEndDate}</strong>. You will still have access to
          our Basic lessons, and you will not be charged again.
        </p>
      )}
      {type === 'paid' && status === 'canceled' && (
        <p>
          Your subscription was canceled and ended on{' '}
          <strong>{currentPeriodEndDate}</strong>. You can still watch all of
          our Basic lessons, but you will need subscribe to a Pro plan for
          access to our full catalogue of Pro lessons.
        </p>
      )}
    </div>
  )
}

const TeamOwnerSubscriptionDetails: React.FC<any> = ({
  status,
  interval,
  seatsNumber,
  price,
  currentPeriodEndDate,
}) => {
  return (
    <div>
      {status === 'active' && (
        <>
          <p>
            Your <strong>{interval}</strong> team subscription for{' '}
            <strong>{seatsNumber}</strong> seats will automatically renew for $
            <strong>{price}</strong> on <strong>{currentPeriodEndDate}</strong>.
          </p>
          <p>
            If you would like to cancel auto-renewal or change the number of
            seats for your team, you can use the manage subscription link to
            make changes.
          </p>
        </>
      )}
      {status === 'pending_cancelation' && (
        <p>
          Your <strong>{interval}</strong> team subscription for{' '}
          <strong>{seatsNumber}</strong> seats will end on{' '}
          <strong>{currentPeriodEndDate}</strong>. Your team will still have
          access to our Basic lessons, and you will not be charged again.
        </p>
      )}
      {status === 'canceled' && (
        <p>
          Your team subscription was canceled and ended on{' '}
          <strong>{currentPeriodEndDate}</strong>. You can still watch all of
          our Basic lessons, but you will need subscribe to a Pro plan for
          access to our Pro lessons.
        </p>
      )}
    </div>
  )
}

const TeamMemberSubscriptionDetails: React.FC<any> = ({
  status,
  owner,
  currentPeriodEndDate,
}) => {
  return (
    <div>
      {status === 'active' && (
        <p>
          You have Pro access through a team subscription managed by{' '}
          <strong>{owner.name}</strong> (
          <a href={`mailto:${owner.email}`} className="text-blue-600">
            {owner.email}
          </a>
          ).
        </p>
      )}
      {status === 'pending_cancelation' && (
        <p>
          Your Pro access through your team's subscription will end on{' '}
          <strong>{currentPeriodEndDate}</strong>. You will still have access to
          our Basic lessons, and you will not be charged again.
        </p>
      )}
      {status === 'canceled' && (
        <p>
          Your Pro access through your team's subscription was cancelled and
          ended on <strong>{currentPeriodEndDate}</strong>. You can still watch
          all of our Basic lessons, but you will need subscribe to a Pro plan
          for access to our Pro lessons.
        </p>
      )}
    </div>
  )
}

const TeamMembers: React.FC<any> = ({members}) => {
  return (
    <ul className="list-disc pl-6">
      {members.map((member: any, i: number) => {
        return (
          <li key={i}>
            <i>
              {member.name} - ({member.email})
            </i>
          </li>
        )
      })}
    </ul>
  )
}

const SubscriptionDetailsWidget: React.FC<{
  subscriptionDetails: SubscriptionDetails
}> = ({subscriptionDetails = TEMP_DEFAULT_SUBSCRIPTION_DETAILS}) => {
  const {subscription, team} = subscriptionDetails
  const {status, type, interval, currentPeriodEndDate, fullPrice, discount} =
    subscription
  const subscriptionIsCanceled = status === 'canceled'
  const owner = team?.owner
  const members = team?.members
  const price = isEmpty(discount) ? fullPrice : discount?.priceWithDiscount
  return (
    <div className="space-y-5">
      <AccessLevelSummary isBasic={subscriptionIsCanceled} />
      {!owner && (
        <IndividualSubscriptionDetails
          status={status}
          type={type}
          interval={interval}
          currentPeriodEndDate={currentPeriodEndDate}
          price={price}
        />
      )}
      {owner && members && (
        <>
          <TeamOwnerSubscriptionDetails
            status={status}
            interval={interval}
            seatsNumber={members.length}
            price={price}
            currentPeriodEndDate={currentPeriodEndDate}
          />
          {!subscriptionIsCanceled && <TeamMembers members={members} />}
        </>
      )}
      {owner && !members && (
        <TeamMemberSubscriptionDetails
          status={status}
          owner={owner}
          currentPeriodEndDate={currentPeriodEndDate}
        />
      )}
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
            <div className="space-y-2 text-xs p-3 bg-gray-100 border-2 border-dashed border-gray-300 h-full">
              <pre>{JSON.stringify(subscriptionState, null, 2)}</pre>
            </div>
          </div>
        </div>

        {subscriptionState ? (
          <SubscriptionDetailsWidget subscriptionDetails={subscriptionState} />
        ) : (
          <MissingSubscription />
        )}
      </>
    )
  }

export default SubscriptionDetails

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
    <div className="space-y-3 flex flex-col items-start bg-yellow-100 px-3 border-2 border-dashed border-gray-300 py-2 h-full min-h-[620px]">
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
          {subscriptionState?.subscription.type === 'paid' && (
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
          )}
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
          {subscriptionState?.subscription.type === 'paid' && (
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
          )}
          {subscriptionState?.subscription.type === 'paid' && (
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
          )}
          {subscriptionState?.team !== undefined &&
            subscriptionState?.subscription.type === 'paid' && (
              <div>
                <h3 className="text-lg font-semibold">team owner/member:</h3>
                <div className="flex space-x-3">
                  <label
                    htmlFor="subscription-team-owner"
                    className="space-x-1 flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="subscription-team-role"
                      id="subscription-team-owner"
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
                      checked={subscriptionState?.team?.members !== undefined}
                    />
                    <span>owner</span>
                  </label>
                  <label
                    htmlFor="subscription-team-member"
                    className="space-x-1 flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="subscription-team-role"
                      id="subscription-team-member"
                      onChange={() =>
                        setSubscriptionState({
                          ...subscriptionState,
                          team: {
                            owner: {
                              name: 'John Owner',
                              email: 'john@owner.com',
                              member: true,
                            },
                            members: undefined,
                          },
                        })
                      }
                      checked={subscriptionState?.team?.members === undefined}
                    />
                    <span>member</span>
                  </label>
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  )
}
