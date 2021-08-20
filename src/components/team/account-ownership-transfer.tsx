import * as React from 'react'
import toast from 'react-hot-toast'
import {AUTH_DOMAIN, getAuthorizationHeader} from '../../utils/auth'
import axios from 'axios'
import {track} from 'utils/analytics'
import {useViewer} from 'context/viewer-context'
import {useMachine} from '@xstate/react'
import strongConfirmationDialogMachine from 'machines/strong-confirmation-dialog-machine'
import TransferOwnershipConfirmDialog from 'components/team/transfer-ownership-confirm-dialog'

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
  const [inviteeEmail, setInviteeEmail] = React.useState<string>('')

  const invitationDetails = {
    accountId,
    inviteeEmail,
    ownerId: viewer?.id as string | undefined,
  }

  const [current, send] = useMachine(strongConfirmationDialogMachine, {
    actions: {
      onSuccess: (context) => {
        setInviteeEmail('')

        track(
          'sent account ownership transfer invite',
          context.invitationDetails,
        )

        toast.success(
          'Your account ownership transfer invitation has been sent.',
          {
            icon: '✅',
          },
        )
      },
      onFail: (context) => {
        track('encountered error transfering account ownership', {
          ...context.invitationDetails,
          error: context.errorMessage,
        })
      },
    },
  })

  const loading = current.matches({open: 'executingAction'})

  return (
    <>
      <TransferOwnershipConfirmDialog
        current={current}
        inviteeEmail={current.context.doubleConfirmText || ''}
        inviteeEmailConfirmation={current.context.inputConfirmText}
        onClose={() => {
          send('CANCEL')
        }}
        onConfirm={() => {
          send('CONFIRM')
        }}
        handleInputChange={(value) => {
          send({type: 'CHANGE', inputConfirmText: value})
        }}
      />
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
              send({
                type: 'OPEN_DIALOG',
                invitationDetails,
                action: async () => {
                  await sendOwnershipTransferInvite(inviteeEmail, accountId)
                },
                doubleConfirmText: inviteeEmail,
              })
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
