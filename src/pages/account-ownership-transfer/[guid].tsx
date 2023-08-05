import * as React from 'react'
import LoginRequired from 'components/login-required'
import {useRouter} from 'next/router'
import {GetServerSideProps} from 'next'
import toast from 'react-hot-toast'
import axios from 'axios'
import {
  getAuthorizationHeader,
  getTokenFromCookieHeaders,
  AUTH_DOMAIN,
} from 'utils/auth'
import {track} from 'utils/analytics'
import {useViewer} from 'context/viewer-context'

async function confirmAccountOwnershipTransfer(guid: string) {
  try {
    await axios.patch(
      `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/account_ownership_transfer_invitations/${guid}/accept_invite`,
      {},
      {
        headers: {...getAuthorizationHeader()},
      },
    )

    return true
  } catch (e) {
    return false
  }
}

type AccountOwnershipTransferData = {
  ownerEmail?: string
  validInvite: boolean
}

export const getServerSideProps: GetServerSideProps<AccountOwnershipTransferData> =
  async function (context: any) {
    const {guid} = context.params
    const {eggheadToken} = getTokenFromCookieHeaders(
      context.req.headers.cookie as string,
    )

    try {
      const {data}: {data: {owner_email: string}} = await axios.get(
        `${AUTH_DOMAIN}/api/v1/account_ownership_transfer_invitations/${guid}`,
        {
          headers: {
            Authorization: `Bearer ${eggheadToken}`,
          },
        },
      )

      return {
        props: {
          validInvite: true,
          ownerEmail: data.owner_email,
        },
      }
    } catch (e) {
      return {props: {validInvite: false}}
    }
  }

const AccountOwnershipTransfer: React.FunctionComponent<
  React.PropsWithChildren<AccountOwnershipTransferData>
> = ({validInvite, ownerEmail}) => {
  const {viewer} = useViewer()
  const router = useRouter()
  const {guid} = router.query

  return (
    <LoginRequired>
      <section className="mb-32">
        <div className="p-4 w-full">
          <div className="w-full mx-auto md:py-32 py-16 flex flex-col items-center justify-center text-gray-900 dark:text-trueGray-100">
            <h2 className="text-center text-3xl leading-9 font-bold">
              Account Ownership Transfer
            </h2>
            <div className="sm:mt-8 mt-4 sm:mx-auto sm:w-full sm:max-w-xl">
              {validInvite && (
                <p className="text-center pb-4">
                  Click 'confirm' to complete the ownership transfer of this
                  account from {ownerEmail}.
                </p>
              )}
              {!validInvite && (
                <div
                  className="relative px-4 py-3 mb-4 leading-normal text-red-700 bg-red-100 dark:text-red-100 dark:bg-red-800 rounded"
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
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                  <p className="ml-8">
                    This account ownership transfer invitation is no longer
                    valid. The owner of the account can issue a new invitation
                    or you can reach out to{' '}
                    <a
                      className="font-bold underline transition-colors ease-in-out duration-150"
                      href="mailto:support@egghead.io"
                    >
                      support@egghead.io
                    </a>{' '}
                    for help with this transfer.
                  </p>
                </div>
              )}
              <div className="flex justify-center items-center w-full">
                <button
                  className={`text-white bg-red-500 border-0 py-2 px-8 focus:outline-none rounded
                    ${
                      validInvite
                        ? 'hover:bg-red-600'
                        : 'cursor-not-allowed opacity-50'
                    }`}
                  disabled={!validInvite}
                  onClick={async () => {
                    const transferSucceeded =
                      await confirmAccountOwnershipTransfer(guid as string)

                    if (transferSucceeded === true) {
                      toast.success('You are now the owner of this account.', {
                        icon: '✅',
                      })
                      router.replace('/user/profile')
                    } else {
                      toast.error(
                        'This link for transferring account ownership is no longer valid. You can either request a new invite from the current account owner or reach out to support@egghead.io for help.',
                        {
                          duration: 6000,
                          icon: '❌',
                        },
                      )
                    }

                    track(
                      `${
                        transferSucceeded ? 'accepted' : 'failed to accept'
                      } account ownership transfer`,
                      {inviteGuid: guid, inviteeId: viewer?.id},
                    )
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </LoginRequired>
  )
}

export default AccountOwnershipTransfer
