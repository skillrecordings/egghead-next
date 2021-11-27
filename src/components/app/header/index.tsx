import * as React from 'react'
import {FunctionComponent} from 'react'
import Link from '../../link'
import Image from 'next/image'
import Eggo from 'components/icons/eggo'
import {useViewer} from 'context/viewer-context'
import {track} from 'utils/analytics'
import {isEmpty} from 'lodash'
import FeedbackInput from 'components/feedback-input'
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
  PlayIcon,
  MenuIcon,
  XIcon,
} from '@heroicons/react/solid'
import {holidaySaleOn} from 'lib/holiday-sale'
import HolidaySaleHeaderBanner from 'components/cta/holiday-sale/header-banner'

const Header: FunctionComponent = () => {
  const [isMounted, setIsMounted] = React.useState<boolean>(false)
  const router = useRouter()
  const {viewer, loading} = useViewer()
  const {subscriber, loadingSubscriber} = useCio()
  const {sm, md} = useBreakpoint()
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

  const [activeCTA, setActiveCTA] = React.useState<any>(null)
  React.useEffect(() => {
    switch (true) {
      case !subscriber?.attributes?.portfolio_foundations:
        setActiveCTA(<PortfolioFoundationsCTA variant="header" />)
        break
      case !subscriber?.attributes?.online_presence:
        setActiveCTA(<OnlinePresenceCTA variant="header" />)
        break
      case !subscriber && !loadingSubscriber:
        setActiveCTA(<OnlinePresenceCTA variant="header" />)
        break
      case !viewer?.is_pro && !viewer?.is_instructor:
        setActiveCTA(
          <HeaderButtonShapedLink
            url="/pricing"
            label="Go Pro"
            onClick={() => {
              track('clicked go pro', {location: 'header'})
            }}
          />,
        )
        break
      default:
        setActiveCTA(null)
    }
  }, [subscriber, viewer])

  const Logo = () => {
    return (
      <Link href="/">
        <a className="flex items-center pr-2">
          <Eggo className="sm:w-8 w-7 mr-1" />
          <span className="sm:text-lg text-base font-semibold inline-block">
            egghead.io
          </span>
        </a>
      </Link>
    )
  }

  const User = () => {
    return (
      <Link href="/user">
        <a
          onClick={() =>
            track('clicked account', {
              location: 'header',
            })
          }
          className="flex items-center h-full dark:hover:bg-white hover:bg-gray-50 dark:hover:bg-opacity-5 px-2"
        >
          <img
            width={32}
            height={32}
            alt="avatar"
            className="rounded-full"
            src={viewer.avatar_url}
          />
          <span className="pl-1">
            {viewer.name}
            {viewer.is_pro && <sup>⭐️</sup>}
          </span>
        </a>
      </Link>
    )
  }

  const Feedback = () => {
    return (
      <FeedbackInput
        user={viewer}
        className="flex items-center h-full dark:hover:bg-white hover:bg-gray-50 dark:hover:bg-opacity-5 px-3"
      >
        Feedback
      </FeedbackInput>
    )
  }

  const Bookmarks = () => {
    return (
      <Link href={`/bookmarks`}>
        <a
          onClick={() =>
            track('clicked bookmarks', {
              location: 'header',
            })
          }
          className="flex items-center h-full dark:hover:bg-white hover:bg-gray-50 dark:hover:bg-opacity-5 px-3"
        >
          Bookmarks
        </a>
      </Link>
    )
  }

  const Team = () => {
    return (
      <Link href={`/team`}>
        <a
          onClick={() =>
            track('clicked team', {
              location: 'header',
            })
          }
          className="flex items-center h-full dark:hover:bg-white hover:bg-gray-50 dark:hover:bg-opacity-5 px-2"
        >
          Team
        </a>
      </Link>
    )
  }

  const Login = () => {
    return (
      <div>
        <Link href="/login" activeClassName="underline">
          <a
            onClick={() =>
              track('clicked sign in', {
                location: 'header',
              })
            }
            className="flex items-center h-full dark:hover:bg-white hover:bg-gray-50 dark:hover:bg-opacity-5 px-2"
          >
            Sign in
          </a>
        </Link>
      </div>
    )
  }

  const Learn = () => {
    return (
      <div>
        <Link href="/learn" activeClassName="underline">
          <a className="flex items-center h-full dark:hover:bg-white hover:bg-gray-50 dark:hover:bg-opacity-5 px-2">
            Learn
          </a>
        </Link>
      </div>
    )
  }

  const MobileNavigation = () => {
    return (
      <ul className="dark:bg-gray-800 bg-gray-50 shadow-smooth w-full flex flex-col px-3 pb-5 relative z-20 text-base space-y-2">
        {[
          SearchBar,
          !isEmpty(viewer) && Bookmarks,
          !isEmpty(viewer) && Feedback,
          showTeamNavLink && Team,
          !isEmpty(viewer) && User,
          isEmpty(viewer) && Login,
        ].map((Item: any, i) => {
          return Item ? (
            <li key={i} className="w-full h-12 flex items-stretch">
              <Item />
            </li>
          ) : null
        })}
        <li>{activeCTA}</li>
      </ul>
    )
  }

  return isMounted ? (
    <>
      {holidaySaleOn &&
        viewer &&
        !viewer?.is_pro &&
        router.pathname !== '/pricing' && <HolidaySaleHeaderBanner />}
      <nav
        aria-label="header"
        className="text-sm h-12 border-b border-gray-100 dark:bg-gray-900 dark:border-gray-800 print:hidden dark:text-white text-gray-1000 relative"
      >
        <div className="container h-full flex items-center w-full justify-between">
          <div className="flex h-full">
            <Logo />
            {!viewer?.is_pro && <Learn />}
            {!isTopics && <Browse />}
          </div>
          <div className="flex h-full">
            {!md && !isSearch && <SearchBar />}
            {!sm && (
              <>
                {!isEmpty(viewer) && <Bookmarks />}
                {!isEmpty(viewer) && <Feedback />}
                {showTeamNavLink && <Team />}
                <div className="px-1 flex items-center">{activeCTA}</div>
                {!isEmpty(viewer) && <User />}
                {isEmpty(viewer) && <Login />}
              </>
            )}
            {sm && !loading && (
              <button
                onClick={() => setOpen(!isOpen)}
                aria-labelledby="menubutton"
                aria-expanded={isOpen}
                className="flex items-center justify-center py-2 px-3 -mr-4"
              >
                <span className="sr-only">
                  {isOpen ? 'Close navigation' : 'Open navigation'}
                </span>
                {isOpen ? (
                  <XIcon className="w-5" />
                ) : (
                  <MenuIcon className="w-5" />
                )}
              </button>
            )}
          </div>
        </div>
        {isOpen && <MobileNavigation />}
      </nav>
    </>
  ) : null
}

export default Header

const Browse = () => {
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
    {name: 'Courses', href: '/q', icon: PlayIcon},
    {name: 'Articles', href: '/blog', icon: DocumentTextIcon},
    {name: 'Podcasts', href: '/q?type=podcast', icon: MicrophoneIcon},
    {name: 'Talks', href: '/q?type=talk', icon: PresentationChartBarIcon},
  ]

  return (
    <Popover>
      {({open}) => (
        <>
          <Popover.Button className="flex items-center h-full dark:hover:bg-white hover:bg-gray-50 dark:hover:bg-opacity-5 px-2">
            <span>Browse</span>
            <ChevronDownIcon className="mt-px h-4" aria-hidden="true" />
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
              className="absolute sm:left-auto left-0 z-50 lg:max-w-xl md:max-w-md sm:max-w-sm w-full px-2 sm:px-0"
            >
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative grid gap-1 bg-white sm:grid-cols-3 grid-cols-2 dark:bg-gray-800 sm:p-5 p-3">
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
                      <div className="flex-shrink-0">
                        <Image
                          width={24}
                          height={24}
                          src={item.image}
                          alt={item.name}
                          quality={100}
                          priority
                        />
                      </div>
                      <span className="pl-2 font-medium text-gray-700 transition duration-150 ease-in-out dark:text-white hover:text-black">
                        {item.name}
                      </span>
                    </a>
                  ))}

                  <a
                    href="/topics"
                    onClick={() =>
                      track(`clicked all topics`, {
                        location: 'header browse',
                      })
                    }
                    className="px-3 py-2 font-medium transition duration-150 ease-in-out rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 dark:bg-gray-700 text-blue-500 dark:text-gray-200 flex justify-between items-center w-full"
                  >
                    Browse all topics <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
                <div className="relative grid gap-1 bg-gray-100 sm:grid-cols-4 grid-cols-2 dark:bg-gray-700 px-5 py-2">
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
                        className="flex items-center px-3 py-3 font-medium text-gray-700 transition duration-150 ease-in-out rounded-md dark:text-white hover:bg-gray-200 dark:hover:bg-gray-900"
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
  )
}
