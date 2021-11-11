import * as React from 'react'
import {FunctionComponent} from 'react'
import Link from '../../link'
import Image from 'next/image'
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
  const [isMounted, setIsMounted] = React.useState<boolean>(false)
  const router = useRouter()
  const {viewer, loading} = useViewer()
  const {subscriber, loadingSubscriber} = useCio()
  const {sm} = useBreakpoint()
  const [isOpen, setOpen] = React.useState<boolean>(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

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
    case !subscriber?.attributes?.portfolio_foundations:
      ActiveCTA = () => <PortfolioFoundationsCTA variant="header" />
      break
    case !subscriber?.attributes?.online_presence:
      ActiveCTA = () => <OnlinePresenceCTA variant="header" />
      break
    case !subscriber && !loadingSubscriber:
      ActiveCTA = () => <OnlinePresenceCTA variant="header" />
      break
    case !viewer?.is_pro && !viewer?.is_instructor:
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
      <div className="flex-shrink-0 text-sm">
        {viewer ? (
          <div className={className}>
            {children}
            <ActiveCTA />
            <Feedback
              user={viewer}
              className="inline-flex px-3 py-2 leading-tight transition-all duration-300 ease-in-out rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white active:bg-gray-200"
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
                  className="inline-flex px-3 py-2 leading-tight transition-all duration-300 ease-in-out rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:hover:text-white"
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
                  className="inline-flex px-3 py-2 leading-tight transition-all duration-300 ease-in-out rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:hover:text-black"
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
                className="flex items-center space-x-2 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
              >
                <img
                  width={32}
                  height={32}
                  alt="avatar"
                  className="rounded-full"
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
                className="inline-flex px-3 py-2 transition-all duration-300 ease-in-out rounded-md dark:active:text-gray-900 dark:text-gray-200 dark:border-gray-200 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800 dark:active:bg-gray-700 active:bg-gray-100"
              >
                Sign in
              </a>
            </Link>
          </div>
        )}
      </div>
    ) : null
  }

  return isMounted ? (
    <nav aria-label="header">
      <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:bg-gray-900 dark:border-gray-800 print:hidden dark:text-gray-100">
        <div className="container flex items-center justify-between w-full space-x-4">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center">
                <Eggo className="w-8 mr-1" />
                <span className="hidden text-lg font-semibold sm:inline-block dark:text-gray-200">
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
          {!sm && <Navigation />}
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
      </div>
      {isOpen && (
        <>
          <Navigation className="absolute z-50 flex flex-col items-start w-full p-3 space-y-2 bg-white shadow-xl dark:bg-gray-900 top-14 dark:text-gray-100">
            {!isSearch && <SearchBar />}
          </Navigation>
        </>
      )}
    </nav>
  ) : null
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
      image:
        'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/square_64/react.png',
    },
    {
      name: 'JavaScript',
      href: '/q/javascript',
      image:
        'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/205/square_64/javascriptlang.png',
    },
    {
      name: 'Angular',
      href: '/q/angular',
      image:
        'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/300/square_64/angular2.png',
    },
    {
      name: 'CSS',
      href: '/q/css',
      image:
        'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/175/square_64/csslang.png',
    },
    {
      name: 'TypeScript',
      href: '/q/typescript',
      image:
        'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/377/square_64/typescriptlang.png',
    },
    {
      name: 'AWS',
      href: '/q/aws',
      image:
        'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/090/square_64/aws.png',
    },
    {
      name: 'Node.js',
      href: '/q/node',
      image:
        'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/256/square_64/nodejslogo.png',
    },
    {
      name: 'Next.js',
      href: '/q/next',
      image:
        'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/074/square_64/nextjs.png',
    },
    {
      name: 'Docker',
      href: '/q/docker',
      image:
        'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/947/square_64/docker%282%29.png',
    },
    {
      name: 'Vue.js',
      href: '/q/vue',
      image:
        'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/036/square_64/vue.png',
    },
    {
      name: 'ReactNative',
      href: '/q/react-native',
      image:
        'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/969/square_64/reactnativelogo.png',
    },
    {
      name: 'Algolia',
      href: '/q/algolia',
      image:
        'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/230/square_64/aloglia_logo_1000x1000.png',
    },
    {
      name: 'Python',
      href: '/q/python',
      image:
        'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/138/square_64/2000px-Python-logo-notext.svg.png',
    },
    {
      name: 'Go',
      href: '/q/go',
      image:
        'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/247/square_64/go_logo.png',
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
                className="absolute z-20 w-screen max-w-xl px-2 mt-3 sm:px-0 min-w-max"
              >
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative grid gap-1 py-6 bg-white grid-cols-flyoutmenu dark:bg-gray-800 px-7">
                    {browse.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={() =>
                          track(`clicked topic`, {
                            resource: item.href,
                            location: 'header browse',
                          })
                        }
                        className="flex items-center justify-start px-3 py-2 transition duration-150 ease-in-out rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900"
                      >
                        <Image
                          width={24}
                          height={24}
                          src={item.image}
                          alt={item.name}
                          quality={100}
                        />
                        <span className="pl-2 text-base font-medium text-gray-700 transition duration-150 ease-in-out dark:text-white hover:text-black">
                          {item.name}
                        </span>
                      </a>
                    ))}
                    <div className="px-3 py-2 mr-6 text-base font-medium transition duration-150 ease-in-out rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 dark:bg-gray-700">
                      <a
                        href="/topics"
                        onClick={() =>
                          track(`clicked all topics`, {
                            location: 'header browse',
                          })
                        }
                        className="text-blue-500 dark:text-gray-200"
                      >
                        Browse all topics <span aria-hidden="true">&rarr;</span>
                      </a>
                    </div>
                  </div>
                  <div className="relative grid gap-1 py-5 bg-gray-100 grid-cols-flyoutmenu dark:bg-gray-700 px-7">
                    {contentSectionLinks.map((item) => (
                      <div key={item.name} className="flow-root">
                        <a
                          href={item.href}
                          onClick={() =>
                            track(`clicked browse section`, {
                              resource: item.href,
                              location: 'header browse',
                            })
                          }
                          className="flex items-center px-3 py-3 text-base font-medium text-gray-700 transition duration-150 ease-in-out rounded-md dark:text-white hover:bg-gray-200 dark:hover:bg-gray-900"
                        >
                          <item.icon
                            className="flex-shrink-0 w-6 h-6 text-gray-400"
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
