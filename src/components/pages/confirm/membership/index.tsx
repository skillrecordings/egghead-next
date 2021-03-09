import * as React from 'react'
import useLastResource from 'hooks/use-last-resource'
import {find, isEmpty} from 'lodash'
import Link from 'next/link'
import Image from 'next/image'
import homepageData from 'components/pages/home/homepage-data'

type HeaderProps = {
  heading: React.ReactElement
  primaryMessage: React.ReactElement
}

type ConfirmMembershipProps = {
  session: any
  viewer: any
}

const Illustration = () => (
  <Image
    src={
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1614168840/next.egghead.io/illustrations/3d-objects_2x.png'
    }
    width={860 / 5}
    height={624 / 5}
    quality={100}
    alt="eggo astronaut floating in space"
  />
)

const Heading: React.FC = ({children}) => {
  return (
    <h1 className="sm:leading-tighter leading-tight sm:text-2xl text-xl font-bold">
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
      <div className="flex flex-col justify-center space-y-6 max-w-screen-sm">
        <Illustration />
        <Heading>{heading}</Heading>
        <PrimaryMessage>{primaryMessage}</PrimaryMessage>
      </div>
    </header>
  )
}

const Support: React.FC = () => {
  return (
    <div className="border-t dark:border-gray-800 border-gray-100 pt-16">
      <div className="sm:max-w-xs">
        <h4 className="text-lg font-bold pb-3">Support</h4>
        <p className="prose dark:prose-dark">
          If you have any issues, please email support{' '}
          <strong>
            <a href="mailto:support@egghead.io">support@egghead.io</a>
          </strong>{' '}
          and we will help you as soon as possible.
        </p>
      </div>
    </div>
  )
}

const PopularTopics: React.FC = () => {
  const topics: any = find(homepageData, {id: 'topics'})

  return (
    <div>
      <h4 className="text-lg font-semibold pb-2">
        Start with one of popular topics
      </h4>
      <ul className="grid lg:grid-cols-8 sm:grid-cols-4 grid-cols-2 gap-3">
        {topics.resources.map((topic: any) => (
          <li key={topic.path}>
            <Link href={topic.path}>
              <a className="px-6 py-5 rounded-lg dark:bg-gray-800 bg-white dark:hover:bg-gray-700 hover:shadow-lg border dark:border-transparent border-gray-200 border-opacity-50 flex flex-col items-center justify-center">
                <Image
                  src={topic.image}
                  alt={topic.title}
                  width={40}
                  height={40}
                  className="mb-2"
                />
                {topic.title}
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
    <div className="sm:p-6 p-5 border dark:border-gray-800 border-rose-100 rounded-lg mb-5 inline-flex items-center space-x-3">
      {children}
    </div>
  )
}

export const ConfirmMembership: React.FC<ConfirmMembershipProps> = ({
  session,
  viewer,
}) => {
  return (
    <div className="max-w-screen-lg mx-auto dark:text-white text-gray-900 w-full space-y-16">
      {viewer ? (
        <>
          <Header
            heading={<>Thank you so much for joining egghead!</>}
            primaryMessage={
              <>
                <p className="text-lg">
                  We've charged your credit card{' '}
                  <strong className="dark:text-yellow-300 text-rose-500">
                    ${session.amount} for your egghead membership
                  </strong>{' '}
                  and sent a receipt to{' '}
                  <strong className="dark:text-yellow-300 text-rose-500">
                    {session.email}
                  </strong>
                  .
                </p>
                <p className="text-lg pt-5">
                  You can now learn from all premium resources on egghead,
                  including courses, talks, podcasts, articles, and more. Enjoy!
                </p>
              </>
            }
          />
          <div className="space-y-10">
            <PopularTopics />
            <LastResource />
          </div>
          <Support />
        </>
      ) : (
        <>
          <Header
            heading={<>Thank you so much for joining egghead! </>}
            primaryMessage={
              <>
                <Callout>
                  <IconMail className="p-3 rounded-full dark:bg-rose-500 dark:text-white bg-rose-100 text-rose-500" />
                  <p className="text-lg">
                    Please check your inbox to{' '}
                    <strong>confirm your email address</strong>.
                  </p>
                </Callout>
                <p className="text-lg">
                  We've charged your credit card{' '}
                  <strong className="dark:text-yellow-300 text-rose-500">
                    ${session.amount} for an egghead membership
                  </strong>{' '}
                  and sent an email to{' '}
                  <strong className="dark:text-yellow-300 text-rose-500">
                    {session.email}
                  </strong>{' '}
                  so you can log in and access your membership.
                </p>
              </>
            }
          />
          <Support />
        </>
      )}
    </div>
  )
}

export default ConfirmMembership
