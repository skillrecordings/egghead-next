import * as React from 'react'
import {FunctionComponent} from 'react'
import Link from '../../link'
import Eggo from 'components/icons/eggo'
import {useViewer} from 'context/viewer-context'
import {track} from 'utils/analytics'
import {isEmpty} from 'lodash'
import Feedback from 'components/feedback-input'
import useBreakpoint from 'utils/breakpoints'
import {useRouter} from 'next/router'
import useCio from 'hooks/use-cio'
import PortfolioFoundationsCTA from 'components/survey/portfolio-foundations'
import OnlinePresenceCTA from 'components/survey/online-presence-cta'
import {HeaderButtonShapedLink} from './header-button-shaped-link'
import SearchBar from './search-bar'
import {Fragment} from 'react'
import {Popover, Transition} from '@headlessui/react'
import {
  ChevronDownIcon,
  MicrophoneIcon,
  PresentationChartBarIcon,
  DocumentTextIcon,
} from '@heroicons/react/solid'

const Header: FunctionComponent = () => {
  const router = useRouter()
  const {viewer, loading} = useViewer()
  const {subscriber, loadingSubscriber} = useCio()
  const {sm} = useBreakpoint()
  const [isOpen, setOpen] = React.useState<boolean>(false)

  React.useEffect(() => {
    !sm ? setOpen(sm) : setOpen(false)
  }, [sm, router])

  const isSearch = router.pathname.includes('/q')
  const isTopics = router.pathname.includes('/topics')

  const showTeamNavLink =
    viewer?.accounts &&
    !isEmpty(
      viewer.accounts.filter(
        (account: {account_capacity: string}) =>
          account.account_capacity === 'team',
      ),
    )

  let ActiveCTA: React.FC = () => null

  switch (true) {
    case !subscriber?.attributes?.online_presence:
      ActiveCTA = () => <OnlinePresenceCTA variant="header" />
      break
    case viewer?.is_pro && !subscriber?.attributes?.portfolio_foundations:
      ActiveCTA = () => <PortfolioFoundationsCTA variant="header" />
      break
    case !subscriber && !loadingSubscriber:
      ActiveCTA = () => <OnlinePresenceCTA variant="header" />
      break
    case !viewer?.is_pro:
      ActiveCTA = () => (
        <HeaderButtonShapedLink
          url="/pricing"
          label="Go Pro"
          onClick={() => {
            track('clicked go pro', {location: 'header'})
          }}
        />
      )
      break
    default:
      ActiveCTA = () => null
  }

  const Navigation: FunctionComponent<{
    className?: string
  }> = ({
    className = 'flex items-center justify-center space-x-1',
    children,
  }) => {
    return !loading ? (
      <div className="text-sm flex-shrink-0">
        {viewer ? (
          <div className={className}>
            {children}
            <ActiveCTA />
            <Feedback
              user={viewer}
              className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white active:bg-gray-200 rounded-md inline-flex transition-all ease-in-out duration-300 leading-tight"
            >
              Feedback
            </Feedback>
            {!isEmpty(viewer) && (
              <Link href={`/bookmarks`}>
                <a
                  onClick={() =>
                    track('clicked bookmarks', {
                      location: 'header',
                    })
                  }
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:hover:text-white rounded-md inline-flex transition-all ease-in-out duration-300 leading-tight"
                >
                  Bookmarks
                </a>
              </Link>
            )}
            {showTeamNavLink && (
              <Link href={`/team`}>
                <a
                  onClick={() =>
                    track('clicked team', {
                      location: 'header',
                    })
                  }
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:hover:text-black rounded-md inline-flex transition-all ease-in-out duration-300 leading-tight"
                >
                  Team
                </a>
              </Link>
            )}
            <Link href="/user">
              <a
                onClick={() =>
                  track('clicked account', {
                    location: 'header',
                  })
                }
                className="flex items-center space-x-2 p-3 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
              >
                <img
                  alt="avatar"
                  className="w-8 rounded-full"
                  src={viewer.avatar_url}
                />
                <span>
                  {viewer.name}
                  {viewer.is_pro && ' ⭐️'}
                </span>
              </a>
            </Link>
          </div>
        ) : (
          <div className={className}>
            <ActiveCTA />
            {children}
            <Link href="/login" activeClassName="bg-gray-100 dark:bg-gray-400">
              <a
                onClick={() =>
                  track('clicked sign in', {
                    location: 'header',
                  })
                }
                className="px-3 py-2 dark:active:text-gray-900 dark:text-gray-200 dark:border-gray-200 hover:opacity-100 hover:bg-gray-100  dark:hover:bg-gray-800  dark:active:bg-gray-700 active:bg-gray-100 rounded-md inline-flex transition-all ease-in-out duration-300"
              >
                Sign in
              </a>
            </Link>
          </div>
        )}
      </div>
    ) : null
  }

  return (
    <>
      <header className="h-16 px-5 py-5 sm:mb-5 mb-3 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between print:hidden dark:text-gray-100">
        <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto space-x-4">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center">
                <Eggo className="w-8 mr-1" />
                <span className="sm:inline-block hidden text-lg font-semibold dark:text-gray-200">
                  egghead.io
                </span>
              </a>
            </Link>
          </div>
          {!sm && !isTopics && (
            <div className={`${isSearch ? 'flex-grow' : ''}`}>
              <FlyoutMenu />
            </div>
          )}
          {!sm && !isSearch && <SearchBar />}
          {!sm && <Navigation></Navigation>}
          {sm && !loading && (
            <button
              onClick={() => setOpen(!isOpen)}
              aria-labelledby="menubutton"
              aria-expanded={isOpen}
              className="p-1 -mr-2"
            >
              {isOpen ? <IconX /> : <IconMenu />}
            </button>
          )}
        </div>
      </header>
      {isOpen && (
        <>
          <Navigation className="flex flex-col items-start bg-white dark:bg-gray-900 p-3 w-full space-y-2 absolute top-14 z-50 shadow-xl dark:text-gray-100">
            {!isSearch && <SearchBar />}
          </Navigation>
        </>
      )}
    </>
  )
}

export default Header

const IconMenu = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none">
      <path
        d="M4 6h16M4 12h16M4 18h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
)

const IconX = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none">
      <path
        d="M6 18L18 6M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
)

const FlyoutMenu = () => {
  const browse = [
    {
      name: 'React',
      href: '/q/react',
    },
    {
      name: 'JavaScript',
      href: '/q/javascript',
    },
    {name: 'Angular', href: '/q/angular'},
    {
      name: 'CSS',
      href: '/q/css',
    },
    {
      name: 'TypeScript',
      href: '/q/typescript',
    },
    {
      name: 'AWS',
      href: '/q/aws',
    },
    {
      name: 'Node.js',
      href: '/q/node',
    },
    {
      name: 'Next.js',
      href: '/q/next',
    },
    {
      name: 'Docker',
      href: '/q/docker',
    },
    {
      name: 'Vue.js',
      href: '/q/vue',
    },
    {
      name: 'ReactNative',
      href: '/q/react-native',
    },
    {
      name: 'Algolia',
      href: '/q/algolia',
    },
    {
      name: 'Python',
      href: '/q/python',
    },
    {
      name: 'Go',
      href: '/q/go',
    },
  ]
  const contentSectionLinks = [
    {name: 'Articles', href: '/blog', icon: DocumentTextIcon},
    {name: 'Podcasts', href: '/q?type=podcast', icon: MicrophoneIcon},
    {name: 'Talks', href: '/q?type=talk', icon: PresentationChartBarIcon},
  ]

  function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <div>
      <Popover className="relative">
        {({open}) => (
          <>
            <Popover.Button
              className={classNames(
                open
                  ? 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  : 'active:bg-gray-200 dark:hover:text-white',
                'group rounded-md inline-flex items-center text-base font-medium  focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:hover:text-white transition-all ease-in-out duration-200',
              )}
            >
              <span>Browse</span>
              <ChevronDownIcon
                className={classNames(
                  open
                    ? 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    : 'active:bg-gray-200 dark:hover:text-white',
                  'ml-2 h-5 w-5',
                )}
                aria-hidden="true"
              />
            </Popover.Button>
            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel
                static
                className="absolute z-20 mt-3 px-2 w-screen max-w-xl sm:px-0 min-w-max"
              >
                <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                  <div className="relative grid grid-cols-flyoutmenu bg-white dark:bg-gray-800 px-7 py-6 gap-1">
                    {browse.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={() =>
                          track(`clicked topic`, {resource: item.href})
                        }
                        className="flex items-start rounded-lg transition ease-in-out duration-150 hover:bg-gray-100 dark:hover:bg-gray-900 py-2 px-3"
                      >
                        <p className="text-base font-medium text-gray-700 transition ease-in-out duration-150 dark:text-white hover:text-black">
                          {item.name}
                        </p>
                      </a>
                    ))}
                    <div className="mr-6 text-base font-medium  transition ease-in-out duration-150 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 py-2 px-3">
                      <a
                        href="/topics"
                        onClick={() => track(`clicked all topics`)}
                        className="text-blue-500"
                      >
                        Browse all topics <span aria-hidden="true">&rarr;</span>
                      </a>
                    </div>
                  </div>
                  <div className="relative grid grid-cols-flyoutmenu bg-gray-100 dark:bg-gray-700 px-7 py-5 gap-1">
                    {contentSectionLinks.map((item) => (
                      <div key={item.name} className="flow-root">
                        <a
                          href={item.href}
                          onClick={() =>
                            track(`clicked browse section`, {
                              resource: item.href,
                            })
                          }
                          className="flex items-center rounded-md text-base text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-900 font-medium transition ease-in-out duration-150 py-3 px-3"
                        >
                          <item.icon
                            className="flex-shrink-0 h-6 w-6 text-gray-400"
                            aria-hidden="true"
                          />
                          <span className="ml-3">{item.name}</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}
