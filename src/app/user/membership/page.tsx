import React, {Suspense} from 'react'
import {format} from 'date-fns'
import SubscriptionDetails from '@/components/pages/user/components/subscription-details'
import {ItemWrapper} from '@/components/pages/user/components/widget-wrapper'
import PricingProvider from '@/components/pricing/pricing-provider'
import PricingCard from '@/components/pricing/pricing-card'
import Invoices from '@/components/invoices'
import Spinner from '@/components/spinner'

import fetchEggheadUser from '@/api/egghead/users/from-token'
import {cookies} from 'next/headers'
import {ACCESS_TOKEN_KEY} from '@/utils/auth'
import {isPast} from 'date-fns'

/*

  user: {
    name: 'David',
    id: 37992145,
    lessons_completed: 0,
    series_completed: 0,
    email: 'ninjasoards@gmail.com',
    is_unverified_email: false,
    full_name: 'David',
    discord_id: null,
    avatar_url: '//gravatar.com/avatar/8776cdc5b935953c00c3cb376f4c687b.png?s=128&d=mp',
    contact_id: 'co_a195823f6b4471643ceb',
    roles: [ 'user', 'pro', 'account_member', 'account_owner' ],
    accounts: [ [Object] ],
    can_comment: true,
    providers: [],
    created_at: 1554926781,
    opted_out: true,
    stripeKey: 'pk_test_OOTSSmhjHw8HQBJKPe51fst1',
    is_pro: true,
    is_instructor: false,
    is_cancelled: null,
    is_community_member: false,
    user_profile_url: 'http://app.egghead.af:5000/users/37992145',
    username: 'member',
    user_url: 'http://app.egghead.af:5000/api/v1/users/37992145',
    watch_later_bookmarks_url: 'http://app.egghead.af:5000/api/v1/playlists/watch-later-a890ee6486178056',
    lessons_url: 'http://app.egghead.af:5000/api/v1/lessons',
    series_url: 'http://app.egghead.af:5000/api/v1/series',
    answer_quiz_url: 'http://app.egghead.af:5000/api/v1/users/37992145/answer_quiz',
    recommended_lessons_url: 'http://app.egghead.af:5000/api/v1/users/37992145/lessons?recommended=true&skip_series=true',
    recommended_series_url: 'http://app.egghead.af:5000/api/v1/users/37992145/series?load_lessons=false&recommended=true',
    in_progress_series_url: 'http://app.egghead.af:5000/api/v1/users/37992145/series?in_progress=true&load_lessons=false',
    timezone: 'Central Time (US & Canada)',
    tags: [],
    subscription: { stripe_customer_id: 'cus_QhkrzPG1RtnY8l', active: true },
    purchased: [],
    deals: [],
    playlists_url: 'http://app.egghead.af:5000/api/v1/users/37992145/playlists',
    watch_later_url: 'http://app.egghead.af:5000/watch_later',
    collections_http_url: 'http://app.egghead.af:5000/playlists',
    edit_user_url: 'http://app.egghead.af:5000/users/edit',
    edit_user_password_url: 'http://app.egghead.af:5000/users/edit_password',
    membership_url: 'http://app.egghead.af:5000/membership',
    favorites: [],
    favorite_topic: null,
    managed_subscription_url: 'http://egghead.af:3000/team',
    api_v1_responses_url: 'http://app.egghead.af:5000/api/v1/responses'
  }
*/

function validateTeamSubscription(subscription: any, user: any) {
  const isActiveAccountMember = user.roles.includes('account_member')

  const isAccountOwner = user.roles.includes('account_owner')

  const isTeamAccountOwner =
    user.roles.includes('account_owner') && user.accounts.length > 1

  return {
    isTeamMember: isActiveAccountMember,
    accountOwner: isAccountOwner,
    isTeamAccountOwner,
  }
}
function validateGiftSubscription(subscription: any) {
  const giftExpiration = subscription?.current_period_end
  const isGiftExpired = isPast(new Date(giftExpiration))
  const isGiftMembership =
    subscription?.type === 'gift' &&
    (subscription?.status === 'active' ||
      subscription?.status === 'past_due' ||
      subscription?.status === 'trialing') &&
    !isGiftExpired

  return {
    isGiftMembership,
    giftExpiration,
  }
}

async function getUserMembership(accessToken: string) {
  const user = (await fetchEggheadUser(accessToken ?? '')) as any

  const {isGiftMembership, giftExpiration} = validateGiftSubscription(
    user.subscription,
  )

  const {isTeamMember, accountOwner} = validateTeamSubscription(
    user.subscription,
    user,
  )

  // data is from object above
  return {
    hasStripeAccount: user.accounts.some(
      (account: any) => account.stripe_customer_id,
    ),
    subscription: user.subscription,

    isLifetimeMember: user?.roles?.includes('lifetime_subscriber'),
    isInstructor: user.is_instructor,
    isDisabled: user.is_cancelled,
    isGiftMembership,
    giftExpiration,
    isTeamMember,
    accountOwner,
  }
}

async function Membership() {
  // const {
  //   account,
  //   accountLoading,
  //   isGiftMembership,
  //   giftExpiration,
  //   isTeamMember,
  //   hasStripeAccount,
  //   accountOwner,
  //   isDisabled,
  //   isInstructor,
  //   isLifetimeMember,
  // } = useAccount()

  const cookieStore = cookies()
  const accessToken = cookieStore.get(ACCESS_TOKEN_KEY)?.value

  const {
    hasStripeAccount,
    isLifetimeMember,
    isInstructor,
    isDisabled,
    isGiftMembership,
    giftExpiration,
    isTeamMember,
    accountOwner,
  } = await getUserMembership(accessToken ?? '')

  // subscription={account.subscriptions[0]}
  // stripeCustomerId={account.stripe_customer_id}
  // slug={account.slug}

  switch (true) {
    case isLifetimeMember:
      return (
        <>
          <div className="sm:h-[50vh] md:w-[75ch] mx-auto min-h-[450px] ">
            <div className="w-full leading-relaxed mt-8 text-center place-items-center">
              <h3 className="sm:text-xl text-lg font-medium text-center text-balance">
                ✨ You have a lifetime membership ✨
              </h3>
              <p className="mt-4 text-balance">
                You have lifetime access to all of our courses. Please reach out
                to{' '}
                <strong>
                  <a
                    href={`mailto:support@egghead.io?subject=${encodeURIComponent(
                      `Support needed for egghead membership`,
                    )}`}
                    className="hover:underline duration-100"
                  >
                    support@egghead.io
                  </a>
                </strong>{' '}
                if you have any questions about your membership.
              </p>
            </div>
          </div>
        </>
      )
    case isInstructor:
      return (
        <>
          <div className="sm:h-[50vh] md:w-[75ch] mx-auto">
            <div className="w-full leading-relaxed mt-8 text-center place-items-center">
              <h3 className="text-xl font-medium text-center">
                ✨ You are an egghead instructor ✨
              </h3>
              <p className="mt-4">
                You have lifetime access to all of our courses. If you have an
                active membership, please reach out to egghead staff if you'd
                like it canceled.
              </p>
            </div>
          </div>
        </>
      )
    case isDisabled:
      return (
        <>
          <div className="md:w-[75ch] mx-auto">
            <div className="w-full leading-relaxed mt-4 text-center">
              <h3 className="text-lg font-medium text-center">
                You no longer have an egghead Pro Membership
              </h3>
              <p>
                You still have access to all of our free courses. Restart your
                membership for access to our pro course.
              </p>
            </div>
            <div className="mt-10">
              <PricingProvider>
                {/* TODO: Add children to PricingCard */}
                <PricingCard />
              </PricingProvider>
            </div>
          </div>
        </>
      )
    case isGiftMembership:
      return (
        <div className="flex flex-col justify-center w-full leading-relaxed text-center">
          <h2 className="pb-3 md:pb-4 text-lg font-medium md:font-normal md:text-xl">
            You have a pre-paid egghead membership.
          </h2>
          <p>
            You currently have <strong>PRO</strong>
            <sup>⭐️</sup> access through a <strong>Gift Subscription</strong>{' '}
            that ends on{' '}
            <strong>{format(new Date(giftExpiration), 'yyyy/MM/dd')}</strong>.
            After that, you would need to subscribe to a <strong>Pro</strong>{' '}
            plan to access our <strong>Pro</strong> materials.
          </p>
        </div>
      )
    case hasStripeAccount:
      return (
        <div className="w-full">
          <ItemWrapper title="Membership">
            <Suspense fallback={<div>Loading...</div>}>
              <SubscriptionDetails
                subscription={account.subscriptions[0]}
                stripeCustomerId={account.stripe_customer_id}
                slug={account.slug}
              />
            </Suspense>
          </ItemWrapper>
          <Invoices headingAs="h3" />
        </div>
      )
    case isTeamMember:
      return (
        <div className="text-center w-full leading-relaxed">
          <h2 className="mb-4 md:mb-5 text-lg font-medium md:font-normal md:text-xl leading-none">
            You are a member of a team account.
          </h2>
          <p className="mb-3 md:mb-4">
            You have <strong>PRO</strong>
            <sup>⭐️</sup> access through a team subscription managed by{' '}
            <strong>
              <a
                href={`mailto:${accountOwner.email}`}
                className="dark:text-white hover:underline"
              >
                {accountOwner.email}
              </a>
            </strong>
            .
          </p>
          <p>
            If this is incorrect, please reach out to{' '}
            <strong>
              <a
                href={`mailto:support@egghead.io?subject=${encodeURIComponent(
                  `Support needed for egghead team membership`,
                )}`}
                className="hover:underline duration-100"
              >
                support@egghead.io
              </a>
            </strong>{' '}
            or your{' '}
            <strong>
              <a
                href={`mailto:${accountOwner.email}`}
                className="hover:underline duration-100"
              >
                team manager
              </a>
            </strong>
            .
          </p>
        </div>
      )
  }

  return (
    <div className="w-full leading-relaxed">
      <h2 className="mb-3 md:mb-4 text-lg font-medium md:font-normal md:text-xl leading-none w-fit mx-auto">
        No Membership Found
      </h2>
      <p className="mb-3 md:mb-4">
        You have access to all of our <strong>Free</strong> videos. You can
        subscribe for full access to all of our Pro<sup>⭐️</sup> lessons any
        time.
      </p>
      <p className="mb-12">
        If this is incorrect, please reach out to{' '}
        <strong>
          <a
            href={`mailto:support@egghead.io?subject=${encodeURIComponent(
              `Support needed for egghead membership`,
            )}`}
            className="hover:underline duration-100"
          >
            support@egghead.io
          </a>
        </strong>
      </p>
      <PricingProvider>
        <PricingCard />
      </PricingProvider>
    </div>
  )
}

export default Membership
