import * as React from 'react'
import useLastResource from 'hooks/use-last-resource'
import {isEmpty} from 'lodash'
import Link from 'next/link'
import Image from 'next/image'
import Spinner from 'components/spinner'
import {IconTwitter} from 'components/share'
import usePurchaseAndPlay from 'hooks/use-purchase-and-play'

type HeaderProps = {
  heading: React.ReactElement
  primaryMessage: React.ReactElement
}

type ConfirmMembershipProps = {
  session: any
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

const tweet = `https://twitter.com/intent/tweet/?text=Just joined @eggheadio to level up my development skills.`

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

const Support: React.FC = () => {
  return (
    <div className="border-t dark:border-gray-800 border-gray-100 pt-16 sm:grid grid-cols-2 gap-5">
      <div className="">
        <h4 className="text-lg font-bold pb-3">Support</h4>
        <p className="prose dark:prose-dark max-w-none">
          If you have any issues, please email support{' '}
          <strong>
            <a href="mailto:support@egghead.io">support@egghead.io</a>
          </strong>{' '}
          and we will help you as soon as possible.
        </p>
      </div>
      <div className="">
        <h4 className="text-lg font-bold pb-3">Share</h4>
        <a
          href={tweet}
          rel="noopener noreferrer"
          target="_blank"
          className="mt-1 text-white rounded-md text-sm inline-flex items-center px-3 py-2 bg-blue-500 hover:bg-blue-600"
        >
          <IconTwitter className="w-5" />{' '}
          <span className="pl-2">Share with your friends!</span>
        </a>
      </div>
    </div>
  )
}

const PopularTopics: React.FC = () => {
  return (
    <div>
      <h4 className="text-lg font-semibold pb-4 text-center">
        Start with one of these popular topics
      </h4>
      <ul className="grid sm:grid-cols-4 grid-cols-2 gap-3">
        {topics.resources.map((topic: any) => (
          <li key={topic.path}>
            <Link href={topic.path}>
              <a className="px-6 pt-6 pb-5 rounded-lg dark:bg-gray-800 bg-white dark:hover:bg-gray-700 hover:shadow-lg border dark:border-transparent border-gray-200 border-opacity-50 flex flex-col items-center justify-center">
                <Image
                  src={topic.image}
                  alt={topic.title}
                  width={40}
                  height={40}
                />
                <div className="pt-3">{topic.title}</div>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
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

const LastResource = () => {
  const {lastResource} = useLastResource()

  return !isEmpty(lastResource) ? (
    <div>
      <h4 className="text-lg font-bold pb-2">Continue where you left off</h4>
      <Link href={lastResource.path}>
        <a className="inline-flex items-center space-x-3 font-semibold sm:p-8 p-5 rounded-lg dark:bg-gray-800 bg-white dark:hover:bg-gray-700 border dark:border-transparent border-gray-200 border-opacity-50 hover:shadow-lg">
          <Image src={lastResource.image_url} width={32} height={32} alt="" />
          <span>{lastResource.title}</span>
        </a>
      </Link>
    </div>
  ) : null
}

const Callout: React.FC = ({children}) => {
  return (
    <div className="sm:p-6 p-5 border border-gray-200 rounded-lg mb-5 inline-flex items-center space-x-3 w-full">
      {children}
    </div>
  )
}

const StartLearning: React.FC = () => {
  return (
    <Link href="/q">
      <a className="text-white bg-blue-500 border-0 py-3 px-5 rounded-md hover:bg-blue-600">
        Browse Catalog
      </a>
    </Link>
  )
}

const ExistingMemberConfirmation: React.FC<{session: any}> = ({session}) => {
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
          </>
        }
      />
      <div className="space-y-10">
        <PopularTopics />
        <LastResource />
        <div className="flex justify-center">
          <StartLearning />
        </div>
      </div>
      <Support />
    </>
  )
}

const NewMemberConfirmation: React.FC<{session: any; currentState: any}> = ({
  session,
  currentState,
}) => {
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
                <div className="pt-8">
                  <PopularTopics />
                </div>
                <div className="flex justify-center pt-6">
                  <StartLearning />
                </div>
              </>
            )}
          </>
        }
      />
      <Support />
    </>
  )
}

export const ConfirmMembership: React.FC<ConfirmMembershipProps> = ({
  session,
}) => {
  const [alreadyAuthenticated, currentState] = usePurchaseAndPlay()

  return (
    <div className="max-w-screen-lg mx-auto dark:text-white text-gray-900 w-full space-y-16">
      {alreadyAuthenticated ? (
        <ExistingMemberConfirmation session={session} />
      ) : (
        <NewMemberConfirmation session={session} currentState={currentState} />
      )}
    </div>
  )
}

const topics: any = [
  {
    title: 'React',
    path: '/q/react',
    slug: 'react',
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png',
  },
  {
    title: 'JavaScript',
    path: '/q/javascript',
    slug: 'javascript',
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/205/thumb/javascriptlang.png',
  },
  {
    title: 'CSS',
    path: '/q/css',
    slug: 'css',
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/175/square_480/csslang.png',
  },
  {
    title: 'Angular',
    path: '/q/angular',
    slug: 'angular',
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/300/thumb/angular2.png',
  },
  {
    title: 'Node',
    path: '/q/node',
    slug: 'node',
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/256/thumb/nodejslogo.png',
  },
  {
    title: 'TypeScript',
    path: '/q/typescript',
    slug: 'typescript',
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/377/thumb/typescriptlang.png',
  },
  {
    title: 'GraphQL',
    path: '/q/graphql',
    slug: 'graphql',
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/034/thumb/graphqllogo.png',
  },
  {
    title: 'AWS',
    path: '/q/aws',
    slug: 'aws',
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/090/thumb/aws.png',
  },
]

export default ConfirmMembership
