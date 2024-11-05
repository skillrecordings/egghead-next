import * as React from 'react'
import {useViewer} from '@/context/viewer-context'
import emailIsValid from '@/utils/email-is-valid'
import PoweredByStripe from '@/components/pricing/powered-by-stripe'
import useCio from '@/hooks/use-cio'
import {INTERESTED_IN_LIFETIME_SINCE} from '@/utils/cio/subscriber-attributes'
import {requestSignInEmail} from '@/utils/request-signin-email'
import {cx} from 'class-variance-authority'
import {CheckCircleIcon} from '@heroicons/react/solid'
import {PlanTitle} from './active-sale'

const UpcomingSale = () => {
  const {viewer} = useViewer()
  const {subscriber, cioIdentify} = useCio()

  const [email, setEmail] = React.useState<string>('')
  const [signedUp, setSignedUp] = React.useState<boolean>(false)

  async function handleClick(submittedEmail?: string) {
    setSignedUp(true)

    // there will only be a submittedEmail if there is no viewer.
    // subscriber can still exist because it looks at cookies in the browser but would be confusing for the user if a different email was used than the one they submitted
    if (submittedEmail) {
      const {contact_id} = await requestSignInEmail(submittedEmail)

      cioIdentify(contact_id, {
        email: submittedEmail,
        [INTERESTED_IN_LIFETIME_SINCE]: Math.floor(Date.now() / 1000),
      })
    } else if (subscriber) {
      cioIdentify(subscriber.id, {
        [INTERESTED_IN_LIFETIME_SINCE]: Math.floor(Date.now() / 1000),
      })
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative p-2 bg-gray-100 rounded-md shadow-lg dark:bg-gray-800 dark:shadow-none">
        <div className="relative z-10 flex flex-col items-center max-w-sm px-5 py-5 text-gray-900 bg-white rounded-sm dark:text-white dark:bg-gray-900 sm:px-8 sm:py-12">
          <PlanTitle className="mb-4">Lifetime Membership</PlanTitle>
          <div className="flex flex-col items-center space-y-2">
            <p className="text-sm text-gray-500">
              {' '}
              The sale for lifetime memberships is currently closed.{' '}
            </p>
            <p className="text-sm text-gray-500">
              If you'd like to receive updates when the sale opens up again,
              sign up below.
            </p>
          </div>

          <div
            className={`transition-all duration-300 w-full ${cx({
              ' hidden': signedUp,
              '': !signedUp,
            })}`}
          >
            {viewer ? (
              <button
                className="w-full px-5 py-2 h-[60px] flex justify-center items-center mt-8 font-semibold text-center text-white transition-all duration-300 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700 hover:scale-105"
                onClick={(event) => {
                  event.preventDefault()
                  handleClick()
                }}
                type="button"
              >
                Notify Me
              </button>
            ) : (
              <form className="flex flex-col items-center space-y-2 w-full mt-4">
                <label htmlFor="email" className="sr-only">
                  email input
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-5 py-2 h-[60px] flex justify-center items-center mt-8 font-semibold text-center dark:text-white text-black rounded-md border-2 border-gray-300  focus:ring-0"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <button
                  className="w-full px-5 py-2 h-[60px] flex justify-center items-center mt-8 font-semibold text-center text-white transition-all duration-300 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700 hover:scale-105 cursor-pointer disabled:opacity-60 disabled:hover:bg-blue-600 disabled:hover:scale-100 disabled:hover:cursor-not-allowed"
                  disabled={!emailIsValid(email)}
                  onClick={(event) => {
                    event.preventDefault()
                    handleClick(email)
                  }}
                  type="submit"
                >
                  Notify Me
                </button>
              </form>
            )}
          </div>
          <div
            className={`transition-all duration-300 w-full mt-4 ${cx({
              'opacity-0': !signedUp,
              'opacity-100': signedUp,
            })}`}
          >
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <CheckCircleIcon className="w-12 h-12 text-green-500" /> You've
              been added to the list! We'll notify you when the sale opens up
              again.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpcomingSale
