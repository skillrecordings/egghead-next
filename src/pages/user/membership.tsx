import React from 'react'
import {format} from 'date-fns'

import {useAccount} from 'hooks/use-account'
import SubscriptionDetails from 'components/pages/user/components/subscription-details'
import {ItemWrapper} from 'components/pages/user/components/widget-wrapper'
import AppLayout from 'components/app/layout'
import UserLayout from 'components/pages/user/components/user-layout'
import PricingWidget from 'components/pricing/pricing-widget'
import Invoices from 'components/invoices'
import Spinner from 'components/spinner'

const Membership = () => {
  const {
    account,
    accountLoading,
    isGiftMembership,
    giftExpiration,
    isTeamMember,
    hasStripeAccount,
    accountOwner,
    isDisabled,
  } = useAccount()

  switch (true) {
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
              <PricingWidget />
            </div>
          </div>
        </>
      )
    case accountLoading:
      return (
        <div className="relative flex justify-center w-full">
          <Spinner className="w-6 h-6 text-gray-600" />
        </div>
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
                className="text-white hover:underline"
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
      <PricingWidget />
    </div>
  )
}

export default Membership

Membership.getLayout = function getLayout(Page: any, pageProps: any) {
  return (
    <AppLayout>
      <UserLayout>
        <Page {...pageProps} />
      </UserLayout>
    </AppLayout>
  )
}
