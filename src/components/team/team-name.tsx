import * as React from 'react'
import {TeamData} from '../../pages/team/index'
import {AUTH_DOMAIN, getAuthorizationHeader} from '../../utils/auth'
import toast from 'react-hot-toast'
import axios from 'axios'

const updateTeamName = async (
  name: string,
  accountId: number | undefined,
  {
    onSuccess = () => {},
    onFailure = () => {},
  }: {onSuccess: Function; onFailure: Function},
) => {
  const errorResponse = () => {
    onFailure()
    toast.error(
      'There was an issue updating your team name. Please contact support@egghead.io if the issue persists.',
      {
        duration: 6000,
        icon: '❌',
      },
    )
  }

  if (typeof accountId === 'undefined') {
    errorResponse()
    return
  }

  try {
    await axios.patch(
      `${AUTH_DOMAIN}/api/v1/accounts/${accountId}`,
      {name},
      {
        headers: {...getAuthorizationHeader()},
      },
    )

    onSuccess()

    toast.success('Your team name has been updated.', {
      icon: '✅',
    })
  } catch (e) {
    errorResponse()
  }
}

const getCurrentTeamName = ({name}: {name: string}): string => {
  if (name === 'acc' || name === 'saml_acc') {
    return ''
  }

  return name
}

type TeamNameProps = {
  teamData: TeamData | undefined
}

const TeamName = ({teamData}: TeamNameProps) => {
  const accountId: number | undefined = teamData?.accountId
  const [currentTeamName, setCurrentTeamName] = React.useState<string>(
    getCurrentTeamName(teamData || {name: ''}),
  )
  const [teamName, setTeamName] = React.useState<string>(currentTeamName)
  const teamNameNeedsSaving = currentTeamName !== teamName

  return (
    <div>
      <h2 className="pb-3 md:pb-4 text-lg font-medium md:font-normal md:text-xl leading-none">
        Team Name
      </h2>
      <div className="flex flex-col space-y-2">
        <input
          className="bg-gray-50 dark:bg-gray-800 focus:outline-none focus:shadow-outline border border-gray-300 dark:border-gray-700 rounded-md py-2 px-4 block w-full sm:w-1/2 md:w-1/3 appearance-none leading-normal"
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Name"
        />
        <div className="flex flex-row space-x-2">
          <button
            className={`text-white bg-green-600 border-0 py-2 px-4 focus:outline-none rounded-md
                    ${
                      teamNameNeedsSaving
                        ? 'hover:bg-green-700'
                        : 'cursor-not-allowed opacity-50'
                    }`}
            type="button"
            onClick={() => {
              updateTeamName(teamName, accountId, {
                onSuccess: () => {
                  setCurrentTeamName(teamName)
                },
                onFailure: () => {
                  setTeamName(currentTeamName)
                },
              })
            }}
          >
            Save
          </button>
          <button
            className={`border border-gray-300 dark:border-0 dark:bg-gray-700 py-2 px-4 focus:outline-none rounded-md
                    ${
                      teamNameNeedsSaving
                        ? 'hover:bg-gray-200 dark:hover:bg-gray-800'
                        : 'cursor-not-allowed opacity-50'
                    }`}
            type="button"
            onClick={() => setTeamName(currentTeamName)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default TeamName
