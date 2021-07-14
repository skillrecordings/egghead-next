import * as React from 'react'
import toast from 'react-hot-toast'
import {AUTH_DOMAIN, getAuthorizationHeader} from '../../utils/auth'
import axios from 'axios'
import {track} from 'utils/analytics'
import {useViewer} from 'context/viewer-context'

const sendOwnershipTransferInvite = async (
  inviteeEmail: string,
  accountId: number | undefined,
) => {
  const account_id = accountId || ''

  return axios.post(
    `${AUTH_DOMAIN}/api/v1/account_ownership_transfer_invitations`,
    {account_id, invitee_email: inviteeEmail},
    {
      headers: {...getAuthorizationHeader()},
    },
  )
}

const AccountOwnershipTransfer = ({accountId}: {accountId: number}) => {
  const {viewer} = useViewer()
  const [loading, setLoading] = React.useState<boolean>(false)
  const [inviteeEmail, setInviteeEmail] = React.useState<string>('')

  return (
    <>
      <h2 className="font-semibold text-xl mt-16">
        Account Ownership Transfer
      </h2>
      <p>
        You are current the owner of this egghead team account. You can transfer
        that ownership to another egghead user. Submit their egghead user email
        address with this form and we will email them an invite. Once they
        accept the invite, ownership of this team account will be tranferred
        from you to them.
      </p>
      <div className="flex flex-col space-y-2 mt-6">
        <input
          className="bg-gray-50 dark:bg-gray-800 focus:outline-none focus:shadow-outline border border-gray-300 dark:border-gray-700 rounded-md py-2 px-4 block w-full sm:w-1/2 md:w-1/3 appearance-none leading-normal"
          type="email"
          value={inviteeEmail}
          onChange={(e) => setInviteeEmail(e.target.value)}
          placeholder="Invitee Email"
        />
        <div className="flex flex-row space-x-2">
          <button
            className={`text-white bg-green-600 border-0 py-2 px-4 focus:outline-none rounded-md
                    ${
                      loading || inviteeEmail === ''
                        ? 'cursor-not-allowed opacity-50'
                        : 'hover:bg-green-700'
                    }`}
            type="button"
            disabled={loading || inviteeEmail === ''}
            onClick={async () => {
              const invitationDetails = {
                accountId,
                inviteeEmail,
                ownerId: viewer?.id,
              }

              try {
                setLoading(true)

                await sendOwnershipTransferInvite(inviteeEmail, accountId)

                setInviteeEmail('')

                track(
                  'sent account ownership transfer invite',
                  invitationDetails,
                )

                toast.success(
                  'Your account ownership transfer invitation has been sent.',
                  {
                    icon: '✅',
                  },
                )
              } catch (e) {
                const {data} = e.response

                track('encountered error transfering account ownership', {
                  ...invitationDetails,
                  error: data.error,
                })

                const defaultMessage =
                  'There was an issue sending the ownership transfer invite. Please contact support@egghead.io if the issue persists.'

                toast.error(data.error || defaultMessage, {
                  duration: 6000,
                  icon: '❌',
                })
              } finally {
                setLoading(false)
              }
            }}
          >
            Send Invite
          </button>
          <button
            className={`border border-gray-300 dark:border-0 dark:bg-gray-700 py-2 px-4 focus:outline-none rounded-md
                    ${
                      loading || inviteeEmail === ''
                        ? 'cursor-not-allowed opacity-50'
                        : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                    }`}
            disabled={loading || inviteeEmail === ''}
            type="button"
            onClick={() => setInviteeEmail('')}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}

export default AccountOwnershipTransfer
