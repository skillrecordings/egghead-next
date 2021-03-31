import * as React from 'react'
import {GetServerSideProps} from 'next'
import Link from 'next/link'
import {useViewer} from '../../context/viewer-context'
import LoginRequired from '../../components/login-required'
import {useRouter} from 'next/router'
import {FunctionComponent} from 'react'
import useClipboard from 'react-use-clipboard'
import isEmpty from 'lodash/isEmpty'
import axios from 'axios'
import {track} from 'utils/analytics'
import {loadTeams} from 'lib/teams'
import {getTokenFromCookieHeaders} from 'utils/auth'

interface TeamData {
  inviteUrl: string
  members: Array<any>
  numberOfMembers: number
  capacity: number
  isFull: boolean
  accountSlug: string | undefined
  stripeCustomerId: string | undefined
}

const normalizeTeamData = (viewer: any): TeamData | undefined => {
  if (!!viewer?.team) {
    const members = viewer.team.members || []

    // Managed Subscription
    return {
      inviteUrl: viewer.team.invite_url,
      members: members,
      numberOfMembers: members.length,
      capacity: viewer.team.user_limit,
      isFull: viewer.team.user_limit <= members.length,
      accountSlug: undefined,
      stripeCustomerId: undefined,
    }
  } else if (!isEmpty(viewer?.team_accounts)) {
    // Team Account that this user is an Owner of
    // *grab the first, assuming just one team account for now
    const team = viewer.team_accounts[0]
    const members = team.members || []

    return {
      inviteUrl: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/team-invite/${team.invite_token}`,
      members,
      numberOfMembers: members.length,
      capacity: team.user_limit,
      isFull: team.user_limit <= members.length,
      accountSlug: team.slug,
      stripeCustomerId: team.stripe_customer_id,
    }
  }
  // implicitly return undefined if the user doesn't have a team
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

interface SubscriptionData {
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
              className="transition-all duration-150 ease-in-out text-white font-semibold rounded-md"
            >
              Visit Stripe Billing Portal
            </a>
          </Link>
        )}
      </div>
    </div>
  )
}

// TODO: Ideally team will eventually be typeable as TeamData.
const Team = ({team}: {team: any}) => {
  const {viewer, loading} = useViewer()
  const router = useRouter()

  const teamData = normalizeTeamData(viewer)
  const teamDataAvailable = typeof teamData !== 'undefined'

  React.useEffect(() => {
    if (!loading && !teamDataAvailable) {
      router.push('/')
    }
  }, [loading, teamDataAvailable])

  // TODO: This munging of sources to find members is temporary. The concept of
  // a Team is spread across Accounts and ManagedSubs, one coming from GraphQL
  // and the other coming from the viewer payload.
  const members = team.members || teamData?.members || []

  return (
    <LoginRequired>
      {!loading && !!teamData && (
        <div className="lg:prose-lg prose xl:prose-xl max-w-screen-xl mx-auto mb-24">
          <h1>Team Account</h1>
          <p>
            We are in the process of migrating team accounts to our new website.
            If you would like to manage your account please visit{' '}
            <a href="https://app.egghead.io">https://app.egghead.io</a> and log
            in there. If you need direct assistance please dont hesitate to
            email <a href="mailto:support@egghead.io">support@egghead.io</a>
          </p>
          <p>Your invite link to add new team members is: </p>
          <div className="flex items-center">
            <code>{teamData.inviteUrl}</code>
            <CopyToClipboard
              stringToCopy={teamData.inviteUrl}
              className="inline-block"
              label={true}
            />
          </div>
          <AtCapacityNotice teamData={teamData} />
          <h3>
            Current Team Members <TeamComposition teamData={teamData} />
          </h3>
          <table>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role(s)</th>
              <th>Date Added</th>
            </tr>
            {members.map((member: any, i: number) => {
              return (
                <tr
                  key={member.id || member.email}
                  className={i % 2 === 0 ? 'bg-gray-100' : ''}
                >
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                  <td>{member.roles.join(', ')}</td>
                  <td>{member.date_added}</td>
                </tr>
              )
            })}
          </table>
        </div>
      )}
    </LoginRequired>
  )
}

const CopyToClipboard: FunctionComponent<{
  stringToCopy: string
  className?: string
  label?: boolean
}> = ({stringToCopy = '', className = '', label = false}) => {
  const [isCopied, setCopied] = useClipboard(stringToCopy, {
    successDuration: 1000,
  })

  return (
    <div className={className}>
      <button
        type="button"
        onClick={setCopied}
        className={`group flex text-sm items-center space-x-1 rounded p-2 bg-gray-50 hover:bg-blue-100 hover:text-blue-600 transition-colors ease-in-out duration-150`}
      >
        {isCopied ? (
          'Copied'
        ) : (
          <>
            <IconLink className="w-5" />
            {label && (
              <span>
                Copy link
                <span className="hidden lg:inline"> to clipboard</span>
              </span>
            )}
          </>
        )}
      </button>
    </div>
  )
}

const IconLink: FunctionComponent<{className?: string}> = ({
  className = '',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
    />
  </svg>
)

export const getServerSideProps: GetServerSideProps = async function (
  context: any,
) {
  const {eggheadToken} = getTokenFromCookieHeaders(
    context.req.headers.cookie as string,
  )

  const {data: teams} = await loadTeams(eggheadToken)

  return {
    props: {
      team: teams[0],
    },
  }
}

export default Team
