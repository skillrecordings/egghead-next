import * as React from 'react'
import {GetServerSideProps} from 'next'
import Link from 'next/link'
import LoginRequired from '../../components/login-required'
import {useRouter} from 'next/router'
import CopyToClipboard from '../../components/team/copy-to-clipboard'
import {track} from 'utils/analytics'
import {loadTeams} from 'lib/teams'
import TeamName from '../../components/team/team-name'
import {getTokenFromCookieHeaders} from 'utils/auth'
import {isEmpty, find} from 'lodash'
import BillingSection from 'components/team/billing-section'
import MemberTable from 'components/team/member-table'
import useSubscriptionDetails from 'hooks/use-subscription-data'

export type TeamData = {
  accountId: number
  name: string
  inviteUrl: string
  members: Array<any>
  numberOfMembers: number
  capacity: number
  isFull: boolean
  accountSlug: string
  stripeCustomerId: string
}

const TeamComposition = ({
  capacity,
  numberOfMembers,
}: {
  capacity: number
  numberOfMembers: number
}) => {
  const valid =
    typeof numberOfMembers === 'number' &&
    numberOfMembers > 0 &&
    typeof capacity === 'number' &&
    capacity > 0

  if (valid) {
    return <span>{`(${numberOfMembers}/${capacity})`}</span>
  } else {
    return null
  }
}

const AtCapacityNotice = ({
  isFull,
  billingPortalUrl,
  billingScheme,
}: {
  isFull: boolean
  billingPortalUrl: string | undefined
  billingScheme: 'tiered' | 'per_unit'
}) => {
  if (!isFull) {
    return null
  }

  return (
    <div
      className="relative px-4 py-1 mt-4 mb-4 leading-normal text-orange-700 bg-orange-100 dark:text-orange-100 dark:bg-orange-800 rounded"
      role="alert"
    >
      <span className="absolute inset-y-0 left-0 flex items-center ml-4">
        <svg
          className="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </span>
      {billingScheme === 'tiered' && (
        <div className="ml-8 flex flex-col space-y-2 p-2">
          <span>
            Your team account is full. You can add more seats to your account
            through the Stripe Billing Portal.
          </span>
          {billingPortalUrl && (
            <Link href={billingPortalUrl}>
              <a
                onClick={() => {
                  track(`clicked manage membership`)
                }}
                className="transition-all duration-150 ease-in-out font-semibold rounded-md dark:text-yellow-400 dark:hover:text-yellow-300"
              >
                Visit Stripe Billing Portal
              </a>
            </Link>
          )}
        </div>
      )}
      {billingScheme === 'per_unit' && (
        <div className="ml-8 flex flex-col space-y-2 p-2">
          <span>
            Your team account is full. Our support team can help you add more
            seats to your account.
          </span>
          <Link href="mailto:support@egghead.io">
            <a
              onClick={() => {
                track(`clicked contact us for account at capacity`)
              }}
              className="transition-all duration-150 ease-in-out font-semibold rounded-md dark:text-yellow-400 dark:hover:text-yellow-300"
            >
              Contact Us
            </a>
          </Link>
        </div>
      )}
    </div>
  )
}

type TeamPageProps = {
  team?: TeamData
  error?: boolean
}

const Team = ({team: teamData}: TeamPageProps) => {
  const router = useRouter()
  const [members, setMembers] = React.useState<any[]>(teamData?.members || [])

  const teamDataNotAvailable = isEmpty(teamData)

  React.useEffect(() => {
    if (teamDataNotAvailable) {
      router.push('/')
    }
  }, [teamDataNotAvailable])

  const {
    subscriptionData,
    loading: subscriptionDataLoading,
  } = useSubscriptionDetails({
    stripeCustomerId: teamData?.stripeCustomerId,
  })

  if (teamData === undefined) return null

  return (
    <LoginRequired>
      <div className="max-w-screen-xl mx-auto mb-24">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight md:text-left text-center mt-4 md:mt-0">
          Team Account
        </h1>
        <p className="mt-6 leading-6">
          We are in the process of migrating team accounts to our new website.
          If you would like to manage your account please visit{' '}
          <a href="https://app.egghead.io">https://app.egghead.io</a> and log in
          there. If you need direct assistance please dont hesitate to email{' '}
          <a href="mailto:support@egghead.io">support@egghead.io</a>
        </p>
        <TeamName teamData={teamData} />
        <h2 className="font-semibold text-xl mt-16">Team Members</h2>
        <p className="mt-6">Your invite link to add new team members is: </p>
        <div className="flex flex-col md:flex-row items-start md:items-center mt-4 space-y-2 md:space-y-0 md:space-x-2">
          <code className="font-bold bg-gray-100 p-3 rounded-md dark:bg-gray-800">
            {teamData.inviteUrl}
          </code>
          <CopyToClipboard
            stringToCopy={teamData.inviteUrl}
            className="inline-block"
            label={true}
          />
        </div>
        <AtCapacityNotice
          isFull={teamData.isFull}
          billingPortalUrl={subscriptionData.portalUrl}
          billingScheme={subscriptionData.billingScheme}
        />
        <h2 className="font-semibold text-xl mt-16">
          Current Team Members{' '}
          <TeamComposition
            capacity={teamData.capacity}
            numberOfMembers={members.length}
          />
        </h2>
        <MemberTable
          accountId={teamData.accountId}
          members={members}
          setMembers={setMembers}
        />
        <BillingSection
          subscriptionData={subscriptionData}
          loading={subscriptionDataLoading}
        />
        {!subscriptionDataLoading &&
          subscriptionData.billingScheme === 'per_unit' && (
            <div
              className="relative px-4 py-1 mt-4 mb-4 leading-normal text-blue-700 bg-blue-100 dark:text-blue-100 dark:bg-blue-800 rounded"
              role="alert"
            >
              <span className="absolute inset-y-0 left-0 flex items-center ml-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </span>
              <div className="ml-8 flex flex-col space-y-2 p-2">
                <span>
                  Is the size of your team changing?{' '}
                  <a
                    className="transition-all duration-150 ease-in-out underline font-semibold rounded-md"
                    href="mailto:support@egghead.io"
                  >
                    Contact us
                  </a>{' '}
                  at anytime to adjust the number of seats for your account.
                </span>
              </div>
            </div>
          )}
      </div>
    </LoginRequired>
  )
}

export const getServerSideProps: GetServerSideProps<TeamPageProps> = async function (
  context: any,
) {
  const {eggheadToken} = getTokenFromCookieHeaders(
    context.req.headers.cookie as string,
  )

  const {data: teams = []} = await loadTeams(eggheadToken)

  const fetchedTeam = find(teams, (team) => team.capacity > 0)

  if (fetchedTeam) {
    const team: TeamData = {
      accountId: fetchedTeam.id,
      name: fetchedTeam.name,
      inviteUrl: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/team-invite/${fetchedTeam.invite_token}`,
      members: fetchedTeam.members,
      numberOfMembers: fetchedTeam.number_of_members,
      capacity: fetchedTeam.capacity,
      isFull: fetchedTeam.is_full,
      accountSlug: fetchedTeam.slug,
      stripeCustomerId: fetchedTeam.stripe_customer_id,
    }

    return {
      props: {
        team,
      },
    }
  } else {
    const props = {
      error: true,
    }

    return {
      props,
    }
  }
}

export default Team
