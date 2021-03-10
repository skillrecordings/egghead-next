import * as React from 'react'
import {useViewer} from '../../context/viewer-context'
import LoginRequired from '../../components/login-required'
import {useRouter} from 'next/router'
import {FunctionComponent} from 'react'
import useClipboard from 'react-use-clipboard'
import isEmpty from 'lodash/isEmpty'

interface TeamData {
  inviteUrl: string
  members: Array<any>
  isFull: boolean
}

const normalizeTeamData = (viewer: any): TeamData | undefined => {
  if (!!viewer?.team) {
    // Managed Subscription
    return {
      inviteUrl: viewer.team.invite_url,
      members: viewer.team.members || [],
      isFull: viewer.team.user_limit <= viewer.team.members.length,
    }
  } else if (!isEmpty(viewer?.team_accounts)) {
    // Team Account that this user is an Owner of
    // *grab the first, assuming just one team account for now
    const team = viewer.team_accounts[0]

    return {
      inviteUrl: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/team-invite/${team.invite_token}`,
      members: team.members || [],
      isFull: team.user_limit <= team.members.length,
    }
  }
  // implicitly return undefined if the user doesn't have a team
}

const Team = () => {
  const {viewer, loading} = useViewer()
  const router = useRouter()

  const teamData = normalizeTeamData(viewer)
  const teamDataAvailable = typeof teamData !== 'undefined'

  React.useEffect(() => {
    if (!loading && !teamDataAvailable) {
      router.push('/')
    }
  }, [loading, teamDataAvailable])

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
          <h3>Current Team Members:</h3>
          <ul>
            {teamData.members.map((member: any) => {
              return <li key={member.email}>{member.email}</li>
            })}
          </ul>
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

export default Team
