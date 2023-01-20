import React from 'react'
import {format} from 'date-fns'

import SubscriptionDetails from 'components/pages/user/components/subscription-details'
import {ItemWrapper} from 'components/pages/user/components/widget-wrapper'
import AppLayout from 'components/app/layout'
import UserLayout from 'components/pages/user/components/user-layout'
import PricingWidget from 'components/pricing/pricing-widget'
import Invoices from 'components/invoices'
import Spinner from 'components/spinner'
import {useAccount} from 'hooks/use-account'

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
        <div className="text-center">
          <h2 className="mb-4 md:mb-5 text-lg font-medium md:font-normal md:text-xl leading-none">
            You are a member of a team account.
          </h2>
          <p className="mb-6">
            You have an access to all of our <strong>PRO</strong> resources.
          </p>
          <p>
            If this is incorrect, please reach out to{' '}
            <strong>
              <a
                href="mailto:support@egghead.io"
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
                team member
              </a>
            </strong>
            .
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
        <strong>
          <a
            href="mailto:support@egghead.io"
            className="hover:underline duration-100"
          >
            support@egghead.io
          </a>
        </strong>
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
