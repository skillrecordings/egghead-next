import * as React from 'react'
import {GetServerSideProps} from 'next'
import Link from 'next/link'
import LoginRequired from '../../components/login-required'
import {useRouter} from 'next/router'
import CopyToClipboard from '../../components/team/copy-to-clipboard'
import axios from 'axios'
import {track} from 'utils/analytics'
import {loadTeams} from 'lib/teams'
import TeamName from '../../components/team/team-name'
import {getTokenFromCookieHeaders} from 'utils/auth'
import isEmpty from 'lodash/isEmpty'
import BillingSection from 'components/team/billing-section'
import MemberTable from 'components/team/member-table'

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

const TeamComposition = ({teamData}: {teamData: TeamData}) => {
  const {numberOfMembers, capacity} = teamData

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

type SubscriptionData = {
  portalUrl: string | undefined
}

const AtCapacityNotice = ({teamData}: {teamData: TeamData}) => {
  const {accountSlug, stripeCustomerId} = teamData
  const [
    subscriptionData,
    setSubscriptionData,
  ] = React.useState<SubscriptionData>({} as SubscriptionData)

  React.useEffect(() => {
    if (stripeCustomerId) {
      axios
        .get(`/api/stripe/billing/session`, {
          params: {
            customer_id: stripeCustomerId,
            account_slug: accountSlug,
          },
        })
        .then(({data}) => {
          if (data) {
            setSubscriptionData(data)
          }
        })
    }
  }, [stripeCustomerId, accountSlug])

  if (!teamData.isFull) {
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
      <div className="ml-8 flex flex-col space-y-2 p-2">
        <span>
          Your team account is full. You can add more seats to your account
          through the Stripe Billing Portal.
        </span>
        {subscriptionData?.portalUrl && (
          <Link href={subscriptionData.portalUrl}>
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
    </div>
  )
}

type TeamPageProps = {
  team: TeamData | undefined
}

const Team = ({team: teamData}: TeamPageProps) => {
  const router = useRouter()

  const teamDataNotAvailable = isEmpty(teamData)

  React.useEffect(() => {
    if (teamDataNotAvailable) {
      router.push('/')
    }
  }, [teamDataNotAvailable])

  return (
    <LoginRequired>
      {!!teamData && (
        <div className="max-w-screen-xl mx-auto mb-24">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight md:text-left text-center mt-4 md:mt-0">
            Team Account
          </h1>
          <p className="mt-6 leading-6">
            We are in the process of migrating team accounts to our new website.
            If you would like to manage your account please visit{' '}
            <a href="https://app.egghead.io">https://app.egghead.io</a> and log
            in there. If you need direct assistance please dont hesitate to
            email <a href="mailto:support@egghead.io">support@egghead.io</a>
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
          <AtCapacityNotice teamData={teamData} />
          <h2 className="font-semibold text-xl mt-16">
            Current Team Members <TeamComposition teamData={teamData} />
          </h2>
          <MemberTable members={teamData.members} />
        </div>
      )}
    </LoginRequired>
  )
}

export const getServerSideProps: GetServerSideProps<TeamPageProps> = async function (
  context: any,
) {
  const {eggheadToken} = getTokenFromCookieHeaders(
    context.req.headers.cookie as string,
  )

  const {data: teams} = await loadTeams(eggheadToken)

  let team: TeamData | undefined = undefined

  const fetchedTeam = teams && teams[0]
  if (fetchedTeam) {
    team = {
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
  }

  return {
    props: {
      team,
    },
  }
}

export default Team
