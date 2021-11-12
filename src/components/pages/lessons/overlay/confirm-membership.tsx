import * as React from 'react'
import Image from 'next/image'
import Spinner from 'components/spinner'
import usePurchaseAndPlay from 'hooks/use-purchase-and-play'

type HeaderProps = {
  heading: React.ReactElement
  primaryMessage: React.ReactElement
}

type ConfirmMembershipProps = {
  session: any
  viewLesson: Function
}

const Illustration = () => (
  <div>
    <Image
      src={
        'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1606467216/next.egghead.io/eggodex/playful-eggo_2x.png'
      }
      width={646 / 3}
      height={622 / 3}
      quality={100}
      alt="welcome to egghead"
    />
  </div>
)

const Heading: React.FC = ({children}) => {
  return (
    <h1 className="sm:leading-tighter leading-tight sm:text-2xl text-xl font-bold text-center">
      {children}
    </h1>
  )
}

const PrimaryMessage: React.FC = ({children}) => {
  return <div className="dark:text-gray-200 text-gray-800">{children}</div>
}

const Header: React.FC<HeaderProps> = ({heading, primaryMessage}) => {
  return (
    <header className="w-full h-full flex flex-col items-start justify-center">
      <div className="flex flex-col justify-center items-center space-y-6">
        <Illustration />
        <Heading>{heading}</Heading>
        <PrimaryMessage>{primaryMessage}</PrimaryMessage>
      </div>
    </header>
  )
}

const IconMail: React.FC<{className: string}> = ({className}) => {
  return (
    <div className={className}>
      <svg
        className="animate-bounce transition-transform transform"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="none">
          <path
            d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0 0 16 4H4a2 2 0 0 0-1.997 1.884z"
            fill="currentColor"
          />
          <path
            d="M18 8.118l-8 4-8-4V14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.118z"
            fill="currentColor"
          />
        </g>
      </svg>
    </div>
  )
}

const Callout: React.FC = ({children}) => {
  return (
    <div className="sm:p-6 p-5 border border-gray-200 rounded-lg mb-5 inline-flex items-center space-x-3 w-full">
      {children}
    </div>
  )
}

const ExistingMemberConfirmation: React.FC<{
  session: any
  viewLesson: Function
}> = ({session, viewLesson}) => {
  return (
    <>
      <Header
        heading={<>Thank you so much for joining egghead!</>}
        primaryMessage={
          <>
            <p className="text-lg text-center">
              We've charged your credit card{' '}
              <strong>${session.amount} for your egghead membership</strong> and
              sent a receipt to <strong>{session.email}</strong>.
            </p>
            <p className="text-lg pt-5 text-center">
              You can now learn from all premium resources on egghead, including
              courses, talks, podcasts, articles, and more. Enjoy!
            </p>
            <button
              className="px-10 py-4 mt-5 h-[60px] font-medium flex justify-center items-center text-white transition-all duration-300 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700 hover:scale-105 hover:bg-blue-700 hover:scale-105"
              onClick={(_e) => viewLesson()}
            >
              Watch this Lesson
            </button>
          </>
        }
      />
    </>
  )
}

const NewMemberConfirmation: React.FC<{
  session: any
  currentState: any
  viewLesson: Function
}> = ({session, currentState, viewLesson}) => {
  return (
    <>
      <Header
        heading={<>Thank you so much for joining egghead! </>}
        primaryMessage={
          <>
            {currentState.matches('pending') && (
              <Callout>
                <Spinner color="gray-700" />
                <p className="text-lg">Setting up your account...</p>
              </Callout>
            )}
            {currentState.matches('pollingExpired') && (
              <>
                <Callout>
                  <IconMail className="p-3 rounded-full dark:bg-rose-500 dark:text-white bg-rose-100 text-rose-500" />
                  <p className="text-lg">
                    Please check your inbox ({session.email}) to{' '}
                    <strong>confirm your email address</strong> and{' '}
                    <strong>access your membership</strong>.
                  </p>
                </Callout>
                <p className="text-lg">
                  We've charged your credit card{' '}
                  <strong>${session.amount} for an egghead membership</strong>{' '}
                  and sent an email along with a receipt to{' '}
                  <strong>{session.email}</strong> so you can log in and access
                  your membership.
                </p>
              </>
            )}
            {currentState.matches('authTokenRetrieved') && (
              <>
                <Callout>
                  <p className="text-lg w-full text-center">
                    <span role="img" aria-label="party popper">
                      🎉
                    </span>{' '}
                    Your egghead membership is ready to go!
                  </p>
                </Callout>
                <p className="text-lg pb-8 border-b border-gray-100 text-center max-w-lg mx-auto">
                  We've charged your credit card{' '}
                  <strong>${session.amount} for an egghead membership</strong>{' '}
                  and sent a receipt to <strong>{session.email}</strong>. Please
                  check your inbox to{' '}
                  <strong>confirm your email address</strong>.
                </p>
                <button
                  className="px-10 py-4 mt-5 h-[60px] font-medium flex justify-center items-center text-white transition-all duration-300 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700 hover:scale-105 hover:bg-blue-700 hover:scale-105"
                  onClick={(_e) => viewLesson()}
                >
                  Watch this Lesson
                </button>
              </>
            )}
          </>
        }
      />
    </>
  )
}

export const ConfirmMembership: React.FC<ConfirmMembershipProps> = ({
  session,
  viewLesson,
}) => {
  const [alreadyAuthenticated, currentState] = usePurchaseAndPlay()

  return (
    <div className="max-w-screen-lg mx-auto dark:text-white text-gray-900 w-full space-y-16">
      {alreadyAuthenticated ? (
        <ExistingMemberConfirmation session={session} viewLesson={viewLesson} />
      ) : (
        <NewMemberConfirmation
          session={session}
          currentState={currentState}
          viewLesson={viewLesson}
        />
      )}
    </div>
  )
}

export default ConfirmMembership
