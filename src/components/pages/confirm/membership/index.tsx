import * as React from 'react'
import useLastResource from '@/hooks/use-last-resource'
import {isEmpty} from 'lodash'
import Link from 'next/link'
import Image from 'next/legacy/image'
import Spinner from '@/components/spinner'
import {IconTwitter} from '@/components/share'
import usePurchaseAndPlay from '@/hooks/use-purchase-and-play'
import {Topic} from '@/types'
import {trpc} from '@/app/_trpc/client'
import Stripe from 'stripe'

type HeaderProps = {
  heading: React.ReactElement
  primaryMessage: React.ReactElement
}

type ConfirmMembershipProps = {
  session_id: string
}

const ExistingMemberConfirmation: React.FC<
  React.PropsWithChildren<{session_id: string}>
> = ({session_id}) => {
  const {data, status: postCheckoutStatus} =
    trpc.stripe.postCheckoutDetails.useQuery({
      checkoutSessionId: session_id as string,
    })

  return data ? (
    <>
      <Header
        heading={<>Thank you so much for joining egghead!</>}
        primaryMessage={
          <>
            <p className="text-lg text-center">
              We've charged your credit card{' '}
              <strong>
                ${(data?.session?.amount_total || 0) / 100} for your egghead
                membership
              </strong>{' '}
              and sent a receipt to <strong>{data.customer.email}</strong>.
            </p>

            <LinkToLatestInvoice
              charge={data.charge}
              chargeLoadingStatus={postCheckoutStatus}
            />
            <Support />
            <p className="pt-5 text-lg text-center">
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
    </>
  ) : null
}

const LinkToLatestInvoice = ({
  charge,
  chargeLoadingStatus,
}: {
  charge: Stripe.Charge | null
  chargeLoadingStatus: string
}) => {
  const dataLoading = chargeLoadingStatus === 'loading'

  return (
    <div className="mt-5">
      {charge?.balance_transaction ? (
        <p className="text-center">
          <Link
            href={`/invoices/${charge?.balance_transaction}`}
            className="px-5 py-3 text-white bg-blue-500 border-0 rounded-md hover:bg-blue-600 inline-block"
          >
            Get Your Invoice
          </Link>
        </p>
      ) : dataLoading ? (
        <div className="relative flex justify-center items-center w-full h-12">
          <Spinner className="w-6 h-6 text-gray-600" />
        </div>
      ) : null}
    </div>
  )
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

const Heading: React.FC<React.PropsWithChildren<unknown>> = ({children}) => {
  return (
    <h1 className="text-xl font-bold leading-tight text-center sm:leading-tighter sm:text-2xl">
      {children}
    </h1>
  )
}

const PrimaryMessage: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  return <div className="text-gray-800 dark:text-gray-200">{children}</div>
}

const tweet = `https://twitter.com/intent/tweet/?text=Just joined @eggheadio to level up my development skills.`

const Header: React.FC<React.PropsWithChildren<HeaderProps>> = ({
  heading,
  primaryMessage,
}) => {
  return (
    <header className="flex flex-col items-start justify-center w-full h-full">
      <div className="flex flex-col items-center justify-center space-y-6">
        <Illustration />
        <Heading>{heading}</Heading>
        <PrimaryMessage>{primaryMessage}</PrimaryMessage>
      </div>
    </header>
  )
}

const Support: React.FC<React.PropsWithChildren<unknown>> = () => {
  return (
    <div className="grid-cols-2 gap-5 py-16 border-y border-gray-100 dark:border-gray-800 sm:grid mt-16">
      <div className="">
        <h4 className="pb-3 text-lg font-bold">Support</h4>
        <p className="prose dark:prose-dark max-w-none">
          If you have any issues, please email support{' '}
          <strong>
            <a
              className="prose dark:prose-dark"
              href="mailto:support@egghead.io"
            >
              support@egghead.io
            </a>
          </strong>{' '}
          and we will help you as soon as possible.
        </p>
      </div>
      <div className="">
        <h4 className="pb-3 text-lg font-bold">Share</h4>
        <a
          href={tweet}
          rel="noopener noreferrer"
          target="_blank"
          className="inline-flex items-center px-3 py-2 mt-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          <IconTwitter className="w-5" />{' '}
          <span className="pl-2">Share egghead with your friends!</span>
        </a>
        <p className="text-xs pt-3 text-left">this really helps us out 🙏</p>
      </div>
    </div>
  )
}

const PopularTopics: React.FC<React.PropsWithChildren<unknown>> = () => {
  return (
    <div>
      <h4 className="pb-4 text-lg font-semibold text-center">
        Start with one of these popular topics
      </h4>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {topics.map((topic) => (
          <li key={topic.path}>
            <Link
              href={topic.path}
              className="flex flex-col items-center justify-center px-6 pt-6 pb-5 bg-white border border-gray-200 border-opacity-50 rounded-lg dark:bg-gray-800 dark:hover:bg-gray-700 hover:shadow-lg dark:border-transparent"
            >
              <Image
                src={topic.image}
                alt={topic.title}
                width={40}
                height={40}
              />
              <div className="pt-3">{topic.title}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

const IconMail: React.FC<React.PropsWithChildren<{className: string}>> = ({
  className,
}) => {
  return (
    <div className={className}>
      <svg
        className="transition-transform transform animate-bounce"
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
      <h4 className="pb-2 text-lg font-bold">Continue where you left off</h4>
      <Link
        href={lastResource.path}
        className="inline-flex items-center p-5 space-x-3 font-semibold bg-white border border-gray-200 border-opacity-50 rounded-lg sm:p-8 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-transparent hover:shadow-lg"
      >
        <Image src={lastResource.image_url} width={32} height={32} alt="" />
        <span>{lastResource.title}</span>
      </Link>
    </div>
  ) : null
}

const Callout: React.FC<React.PropsWithChildren<unknown>> = ({children}) => {
  return (
    <div className="inline-flex items-center w-full p-5 mb-5 space-x-3 border border-gray-200 rounded-lg sm:p-6">
      {children}
    </div>
  )
}

const StartLearning: React.FC<React.PropsWithChildren<unknown>> = () => {
  return (
    <Link
      href="/q"
      className="px-5 py-3 text-white bg-blue-500 border-0 rounded-md hover:bg-blue-600"
    >
      Browse All Courses
    </Link>
  )
}

const NewMemberConfirmation: React.FC<
  React.PropsWithChildren<{session_id: string; currentState: any}>
> = ({session_id, currentState}) => {
  const {data} = trpc.stripe.checkoutSessionById.useQuery({
    checkoutSessionId: session_id as string,
  })

  return data ? (
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
                    Please check your inbox ({data.customer.email}) to{' '}
                    <strong>confirm your email address</strong> and{' '}
                    <strong>access your membership</strong>.
                  </p>
                </Callout>
                <p className="text-lg">
                  We've charged your credit card{' '}
                  <strong>
                    ${(data.session.amount_subtotal || 0) / 100} for an egghead
                    membership
                  </strong>{' '}
                  and sent an email along with a receipt to{' '}
                  <strong>{data.customer.email}</strong> so you can log in and
                  access your membership.
                </p>
              </>
            )}
          </>
        }
      />
      <Support />
    </>
  ) : null
}

export const ConfirmMembership: React.FC<
  React.PropsWithChildren<ConfirmMembershipProps>
> = ({session_id}) => {
  const [alreadyAuthenticated, currentState] = usePurchaseAndPlay()

  return (
    <div className="w-full max-w-screen-lg mx-auto space-y-16 text-gray-900 dark:text-white">
      {alreadyAuthenticated || currentState.matches('authTokenRetrieved') ? (
        <ExistingMemberConfirmation session_id={session_id} />
      ) : (
        <NewMemberConfirmation
          session_id={session_id}
          currentState={currentState}
        />
      )}
    </div>
  )
}

export const ConfirmLifetimeMembership: React.FC<
  React.PropsWithChildren<ConfirmMembershipProps>
> = ({session_id}) => {
  // TODO: can this line be deleted?
  const [alreadyAuthenticated, currentState] = usePurchaseAndPlay()

  if (!session_id) {
    return null
  }

  const {data, status: postCheckoutStatus} =
    trpc.stripe.postCheckoutDetails.useQuery({
      checkoutSessionId: session_id as string,
    })

  if (!data) {
    return null
  }

  return (
    <div className="w-full max-w-screen-lg mx-auto space-y-16 text-gray-900 dark:text-white">
      <Header
        heading={<>Thank you so much for joining egghead!</>}
        primaryMessage={
          <>
            <p className="text-lg text-center">
              We've charged your credit card{' '}
              <strong>
                ${(data?.session?.amount_total || 0) / 100} for your lifetime
                egghead membership
              </strong>{' '}
              and sent a receipt to <strong>{data.customer.email}</strong>.
            </p>

            <LinkToLatestInvoice
              charge={data.charge}
              chargeLoadingStatus={postCheckoutStatus}
            />
            <Support />
            <p className="pt-5 text-lg text-center">
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
    </div>
  )
}

const topics: Topic[] = [
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
    slug: '@/typescript',
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
