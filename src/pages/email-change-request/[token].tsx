import * as React from 'react'
import LoginRequired from 'components/login-required'
import {useRouter} from 'next/router'
import {useViewer} from 'context/viewer-context'
import toast from 'react-hot-toast'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import {
  getAuthorizationHeader,
  getTokenFromCookieHeaders,
  AUTH_DOMAIN,
} from 'utils/auth'

async function confirmEmailChangeRequest(token: any) {
  const {data} = await axios.patch(
    `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/email_change_requests/${token}`,
    {},
    {
      headers: {...getAuthorizationHeader()},
    },
  )

  return data
}

type emailChangeRequestData = {
  new_email: string
  current_email: string
}

export async function getServerSideProps(context: any) {
  const {token} = context.params
  const {eggheadToken} = getTokenFromCookieHeaders(
    context.req.headers.cookie as string,
  )

  try {
    const {data}: {data: emailChangeRequestData} = await axios.get(
      `${AUTH_DOMAIN}/api/v1/email_change_requests/${token}`,
      {
        headers: {
          Authorization: `Bearer ${eggheadToken}`,
        },
      },
    )

    const newEmail = data['new_email']
    const currentEmail = data['current_email']

    return {
      props: {
        validToken: !isEmpty(newEmail) && !isEmpty(currentEmail),
        newEmail,
        currentEmail,
      },
    }
  } catch (e) {
    return {
      props: {
        validToken: false,
        newEmail: '',
        currentEmail: '',
      },
    }
  }
}

const EmailChangeRequest: React.FunctionComponent<{
  validToken: boolean
  newEmail: string
  currentEmail: string
}> = ({validToken, newEmail, currentEmail}) => {
  const router = useRouter()
  const {token} = router.query
  const {setViewerEmail} = useViewer()

  return (
    <LoginRequired>
      <section className="mb-32">
        <div className="p-4 w-full">
          <div className="w-full mx-auto md:py-32 py-16 flex flex-col items-center justify-center text-gray-900 dark:text-trueGray-100">
            <h2 className="text-center text-3xl leading-9 font-bold">
              Email Change Request
            </h2>
            <div className="sm:mt-8 mt-4 sm:mx-auto sm:w-full sm:max-w-xl">
              <p className="text-center pb-4">
                Click 'confirm' to complete your email change request.
              </p>
              {validToken && (
                <p className="text-center mb-4 p-4 bg-blue-50 dark:bg-gray-800 rounded">
                  {currentEmail} → {newEmail}
                </p>
              )}
              {!validToken && (
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
                    This link for changing your email has been used or has
                    expired. Feel free to{' '}
                    <a
                      className="font-bold underline transition-colors ease-in-out duration-150"
                      href="/user/account"
                    >
                      request a new link
                    </a>
                    . Please contact{' '}
                    <a
                      className="font-bold underline transition-colors ease-in-out duration-150"
                      href="mailto:support@egghead.io"
                    >
                      support@egghead.io
                    </a>{' '}
                    to get further help with this request.
                  </p>
                </div>
              )}
              <div className="flex justify-center items-center w-full">
                <button
                  className={`text-white bg-red-500 border-0 py-2 px-8 focus:outline-none rounded
                    ${
                      validToken
                        ? 'hover:bg-red-600'
                        : 'cursor-not-allowed opacity-50'
                    }`}
                  disabled={!validToken}
                  onClick={async () => {
                    try {
                      const {success, new_email} =
                        await confirmEmailChangeRequest(token)

                      if (success === true) {
                        setViewerEmail(new_email)

                        toast.success(
                          "You've successfully updated your email address",
                          {icon: '✅'},
                        )
                        router.replace('/user/account')
                      }
                    } catch (e) {
                      toast.error(
                        'This link for changing your email has been used or has expired. Feel free to request a new link.',
                        {
                          duration: 6000,
                          icon: '❌',
                        },
                      )
                    }
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

export default EmailChangeRequest
