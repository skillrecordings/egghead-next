import * as React from 'react'
import {useViewer} from '../../context/viewer-context'
import {GetServerSideProps} from 'next'
import {AUTH_DOMAIN, getAuthorizationHeader} from 'utils/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
import {useRouter} from 'next/router'

const handleJoinTeam = async (token: string, router: any) => {
  try {
    await axios.post(
      `${AUTH_DOMAIN}//api/v1/accounts/team_invite/${token}`,
      {},
      {
        headers: {...getAuthorizationHeader()},
      },
    )

    toast.success("You've successfully joined this team", {
      icon: '✅',
    })

    router.replace('/')
  } catch (e) {
    toast.error(
      "There was an issue joining the team. Please contact the team's account administrator if the issue persists.",
      {
        duration: 6000,
        icon: '❌',
      },
    )
  }
}

const TeamName = ({teamName}: {teamName: string | undefined}) => {
  if (!teamName) {
    return <>their team</>
  } else {
    return (
      <>
        {' '}
        the <span className="font-bold">{teamName}</span> team
      </>
    )
  }
}

const TOKEN_NOT_RECOGNIZED = 'TOKEN_NOT_RECOGNIZED'

const TeamInvite: React.FunctionComponent<TeamInviteProps> = ({
  inviteToken,
  teamName,
  teamOwnerEmail,
}) => {
  const {authToken, loading} = useViewer()
  const router = useRouter()

  const alreadySignedIn = !loading && typeof authToken === 'string'

  React.useEffect(() => {
    if (inviteToken === TOKEN_NOT_RECOGNIZED) {
      toast.error('This is not a recognized team invite link.', {
        duration: 6000,
        icon: '❌',
      })
      router.replace('/')
    }
  }, [inviteToken])

  return (
    <section className="mb-32">
      <div className="p-4 w-full">
        <div className="w-full mx-auto md:py-32 py-16 flex flex-col items-center justify-center text-gray-900 dark:text-trueGray-100">
          <h2 className="text-center text-3xl leading-9 font-bold">
            Team Invite
          </h2>
          <div className="sm:mt-8 mt-4 sm:mx-auto sm:w-full sm:max-w-xl">
            <p className="text-center pb-4">
              You've been invited by{' '}
              <span className="font-bold">{teamOwnerEmail}</span> to join
              <TeamName teamName={teamName} /> on egghead. Click 'Join Team' to
              accept the invitation and get full access to everything on
              egghead.
            </p>
            {!alreadySignedIn && (
              <p className="text-center mb-4 p-4 bg-blue-50 dark:bg-gray-800 rounded">
                You need to{' '}
                <a
                  href="/login"
                  className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors ease-in-out duration-150"
                >
                  sign in
                </a>{' '}
                before you can accept this invitation. Revisit this page after
                signing in to proceed.
              </p>
            )}
            <div className="flex justify-center items-center w-full">
              <button
                className={`text-white bg-green-600 border-0 py-2 px-8 focus:outline-none rounded
                    ${
                      alreadySignedIn
                        ? 'hover:bg-green-700'
                        : 'cursor-not-allowed opacity-50'
                    }`}
                disabled={!alreadySignedIn}
                onClick={() => handleJoinTeam(inviteToken, router)}
              >
                Join Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

interface TeamInviteProps {
  teamOwnerEmail: string
  teamName: string | undefined
  inviteToken: string
}

export const getServerSideProps: GetServerSideProps<TeamInviteProps> = async ({
  params,
}) => {
  try {
    const token = params && (params.token as string)
    if (!token) {
      throw new Error('The invite token is not defined')
    }

    const viewTeamInviteUrl = `${AUTH_DOMAIN}/api/v1/accounts/team_invite/${token}`
    const {data} = await axios.get(viewTeamInviteUrl)

    let teamName = undefined
    // All accounts were defaulted to have names of 'acc' or 'saml_acc'. We'll
    // treat the name us `undefined` unless it has been set to something else.
    if (data.team_name !== 'acc' && data.team_name !== 'saml_acc') {
      teamName = data.team_name
    }

    return {
      props: {
        teamOwnerEmail: data.team_owner_email,
        teamName,
        inviteToken: token,
      },
    }
  } catch (e) {
    return {
      props: {
        teamOwnerEmail: '',
        teamName: undefined,
        inviteToken: TOKEN_NOT_RECOGNIZED,
      },
    }
  }
}

export default TeamInvite
