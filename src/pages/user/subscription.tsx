import React from 'react'
import {find, first} from 'lodash'

import {useViewer} from 'context/viewer-context'
import SubscriptionDetails from 'components/pages/user/components/subscription-details'
import {loadAccount} from 'lib/accounts'
import {ItemWrapper} from 'components/pages/user/components/widget-wrapper'
import AppLayout from 'components/app/layout'
import UserLayout from './components/user-layout'
import PricingWidget from 'components/pricing/pricing-widget'
import Invoices from 'components/invoices'
import Spinner from 'components/spinner'
import {format} from 'date-fns'
import {trpc} from '../../trpc/trpc.client'

type ViewerAccount = {
  stripe_customer_id: string
  slug: string
  subscriptions: any[]
}

function getAccountWithSubscription(accounts: ViewerAccount[]) {
  return (
    find<ViewerAccount>(
      accounts,
      (account: ViewerAccount) => account.subscriptions?.length > 0,
    ) ||
    first<ViewerAccount>(accounts) || {slug: ''}
  )
}

const Account = () => {
  const {viewer} = useViewer()

  const {data: userAccounts, status: userAccountsLoadingStatus} =
    trpc.user.accountsForCurrent.useQuery()

  const isActiveAccountMember = userAccounts?.some(
    (account: {members: {id: number}[]}) => {
      return account.members?.find((member: {id: number}) => {
        return member.id === viewer.id
      })
    },
  )

  const isAccountOwner = userAccounts?.some(
    (account: {owner: {id: number}}) => {
      return account.owner?.id === viewer.id
    },
  )

  const account =
    isAccountOwner &&
    userAccounts?.find((account: {owner: {id: number}}) => {
      return account.owner?.id === viewer.id
    })

  const isGiftMembership = account?.subscriptions?.[0]?.type === 'gift'
  const giftExpiration = account?.subscriptions?.[0]?.current_period_end

  const isTeamMember = isActiveAccountMember && !isAccountOwner
  const hasStripeAccount = Boolean(account?.stripe_customer_id)

  switch (true) {
    case userAccountsLoadingStatus === 'loading':
      return (
        <div className="relative flex justify-center">
          <Spinner className="w-6 h-6 text-gray-600" />
        </div>
      )
    case isGiftMembership:
      return (
        <div className="h-40 sm:h-60 flex flex-col justify-center">
          <h2 className="pb-3 md:pb-4 text-lg font-medium md:font-normal md:text-xl leading-none w-fit mx-auto">
            You have an egghead membership.
          </h2>
          <p className="w-fit mx-auto">
            Your membership expires on:{' '}
            <strong>{format(new Date(giftExpiration), 'yyyy/MM/dd')}</strong>.
          </p>
        </div>
      )
    case hasStripeAccount:
      return (
        <div>
          <ItemWrapper title="Subscription">
            <SubscriptionDetails
              stripeCustomerId={account.stripe_customer_id}
              slug={account.slug}
            />
          </ItemWrapper>
          <Invoices headingAs="h3" />
        </div>
      )
    case isTeamMember:
      return (
        <div>
          <h2 className="pb-3 md:pb-4 text-lg font-medium md:font-normal md:text-xl leading-none w-fit mx-auto">
            You are a member of a team account.
          </h2>
          <p className="w-fit mx-auto mb-12">
            If this is incorrect, please reach out to{' '}
            <strong>support@egghead.io</strong> or your team owner{' '}
            {userAccounts.find((account: any) => account.owner).owner.email}.
          </p>
        </div>
      )
  }

  return (
    <div>
      <h2 className="pb-3 md:pb-4 text-lg font-medium md:font-normal md:text-xl leading-none w-fit mx-auto">
        No Subscription Found
      </h2>
      <p className="w-fit mx-auto mb-12">
        If this is incorrect, please reach out to{' '}
        <strong>support@egghead.io</strong>
      </p>
      <PricingWidget />
    </div>
  )
}

export default Account

Account.getLayout = function getLayout(Page: any, pageProps: any) {
  return (
    <AppLayout>
      <UserLayout>
        <Page {...pageProps} />
      </UserLayout>
    </AppLayout>
  )
}
