import * as React from 'react'
import LoginRequired from 'components/login-required'
import axios from 'axios'
import {useRouter} from 'next/router'
import {useViewer} from 'context/viewer-context'
import toast from 'react-hot-toast'

async function confirmEmailChangeRequest(token: any) {
  const {data} = await axios.get(
    `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/email_change_requests/${token}`,
  )

  return data
}

const EmailChangeRequest: React.FunctionComponent = () => {
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
              <p className="text-center pb-8">
                Click 'confirm' to complete your email change request.
              </p>
              <div className="flex justify-center items-center w-full">
                <button
                  className="text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-600 rounded"
                  onClick={async () => {
                    try {
                      const {
                        success,
                        new_email,
                      } = await confirmEmailChangeRequest(token)

                      if (success === true) {
                        setViewerEmail(new_email)

                        toast.success(
                          "You've successfully updated your email address",
                        )
                        router.replace('/user')
                      }
                    } catch (e) {
                      toast.error(
                        'This link for changing your email has been used or has expired. Feel free to request a new link.',
                        {duration: 6000, icon: '❌'},
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
