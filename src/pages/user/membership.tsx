import React from 'react'
import {find, first} from 'lodash'

import {useViewer} from 'context/viewer-context'
import SubscriptionDetails from 'components/pages/user/components/subscription-details'
import {ItemWrapper} from 'components/pages/user/components/widget-wrapper'
import AppLayout from 'components/app/layout'
import UserLayout from './components/user-layout'
import PricingWidget from 'components/pricing/pricing-widget'
import Invoices from 'components/invoices'
import Spinner from 'components/spinner'
import {format} from 'date-fns'
import {useAccount} from '../../hooks/use-account'

type ViewerAccount = {
  stripe_customer_id: string
  slug: string
  subscriptions: any[]
}

const Account = () => {
  const {
    account,
    accountLoading,
    isGiftMembership,
    giftExpiration,
    isTeamMember,
    hasStripeAccount,
    accountOwner,
  } = useAccount()

  switch (true) {
    case accountLoading:
      return (
        <div className="relative flex justify-center">
          <Spinner className="w-6 h-6 text-gray-600" />
        </div>
      )
    case isGiftMembership:
      return (
        <div className="h-40 sm:h-60 flex flex-col justify-center">
          <h2 className="pb-3 md:pb-4 text-lg font-medium md:font-normal md:text-xl leading-none w-fit mx-auto">
            You have a pre-paid egghead membership.
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
            <strong>
              <a
                className="underline"
                href={`mailto:support@egghead.io?subject=${encodeURIComponent(
                  `Support needed for egghead team membership`,
                )}`}
              >
                support@egghead.io
              </a>
            </strong>{' '}
            or your team owner {accountOwner.email}.
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
