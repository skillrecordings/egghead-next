import * as React from 'react'
import {FunctionComponent} from 'react'
import Link from '../../link'
import Image from 'next/legacy/image'
import Eggo from '@/components/icons/eggo'
import {useViewer} from '@/context/viewer-context'
import {track} from '@/utils/analytics'
import {isEmpty} from 'lodash'
import FeedbackInput from '@/components/feedback-input'
import useBreakpoint from '@/utils/breakpoints'
import {useRouter, usePathname} from 'next/navigation'
import useCio from '@/hooks/use-cio'
import PortfolioFoundationsCTA from '@/components/survey/portfolio-foundations'
import OnlinePresenceCTA from '@/components/survey/online-presence-cta'
import {HeaderButtonShapedLink} from './header-button-shaped-link'
import SearchBar from './search-bar'
import {Fragment} from 'react'
import {Popover, Transition} from '@headlessui/react'
import {
  ChevronDownIcon,
  MicrophoneIcon,
  PresentationChartBarIcon,
  DocumentTextIcon,
  MenuIcon,
  XIcon,
  MapIcon,
} from '@heroicons/react/solid'
import {
  BookOpenIcon,
  PlayIcon,
  MapIcon as MapIconOutline,
  DocumentTextIcon as DocumentTextIconOutline,
  CodeIcon,
} from '@heroicons/react/outline'
import SaleHeaderBanner from '@/components/cta/sale/header-banner'
import {MazePattern} from './images'
import {isMember} from '@/utils/is-member'
import analytics from '@/utils/analytics'

const Header: FunctionComponent<React.PropsWithChildren<unknown>> = () => {
  const [isMounted, setIsMounted] = React.useState<boolean>(false)
  const router = useRouter()
  const {viewer, loading} = useViewer()
  const {subscriber, loadingSubscriber} = useCio()
  const {sm, md, lg} = useBreakpoint()
  const [isOpen, setOpen] = React.useState<boolean>(false)
  const {is_instructor} = viewer || false
  const pathname = usePathname() || ''

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  React.useEffect(() => {
    !sm ? setOpen(sm) : setOpen(false)
  }, [sm, router])

  const isSearch = pathname.includes('/q')
  const isTopics = pathname.includes('/topics')

  const showTeamNavLink =
    viewer?.accounts &&
    !isEmpty(
      viewer.accounts.filter(
        (account: {account_capacity: string}) =>
          account.account_capacity === 'team',
      ),
    )

  const isProOrInstructor = viewer?.is_pro || is_instructor
  const profileLink = is_instructor ? '/instructor' : '/user/membership'

  const [activeCTA, setActiveCTA] = React.useState<any>(null)
  React.useEffect(() => {
    switch (true) {
      // case !isProOrInstructor && !subscriber?.attributes?.team_interest:
      //   setActiveCTA(
      //     <HeaderButtonShapedLink
      //       url="/egghead-for-teams"
      //       label="egghead for teams"
      //       onClick={() => {
      //         track('clicked egghead for teams', {location: 'header'})
      //       }}
      //     />,
      //   )
      //   break
      case !viewer?.is_pro && !viewer?.is_instructor:
        setActiveCTA(
          <HeaderButtonShapedLink
            url="/pricing"
            label="Enroll Today"
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
          <Eggo className="mr-1 sm:w-8 w-7" />
          <span className="inline-block text-base font-semibold sm:text-lg">
            egghead.io
          </span>
        </a>
      </Link>
    )
  }

  const User = () => {
    return (
      <Link href={profileLink}>
        <a
          onClick={() =>
            track('clicked account', {
              location: 'header',
            })
          }
          className="flex items-center h-full px-2 dark:hover:bg-white hover:bg-gray-50 dark:hover:bg-opacity-5"
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
        className="flex items-center h-full px-3 dark:hover:bg-white hover:bg-gray-50 dark:hover:bg-opacity-5"
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
          className="flex items-center h-full px-3 dark:hover:bg-white hover:bg-gray-50 dark:hover:bg-opacity-5"
        >
          Bookmarks
        </a>
      </Link>
    )
  }

  const Tips = () => {
    return (
      <Link href={`/tips`}>
        <a
          onClick={() =>
            analytics.events.activityInternalLinkClick(
              'tips',
              'header',
              'tips',
              '/tips',
            )
          }
          className="flex items-center h-full px-3 dark:hover:bg-white hover:bg-gray-50 dark:hover:bg-opacity-5"
        >
          Tips
        </a>
      </Link>
    )
  }

  const MobileNavigation = () => {
    return (
      <div className="relative z-20 dark:bg-gray-800 bg-gray-50 shadow-smooth h-screen">
        <div className="flex w-full justify-center gap-4 py-4">
          <Link href="/q">
            <a className="dark:bg-gray-700 bg-gray-100 rounded p-2 flex flex-col items-center font-semibold min-w-[72px] dark:hover:bg-white hover:bg-gray-50 dark:hover:bg-opacity-5">
              <CodeIcon
                className="text-blue-400 self-center mb-1"
                height={40}
                width={40}
              />
              Courses
            </a>
          </Link>

          <Link href="/tips">
            <a className="dark:bg-gray-700 bg-gray-100 rounded p-2 flex flex-col items-center font-semibold min-w-[72px] dark:hover:bg-white hover:bg-gray-50 dark:hover:bg-opacity-5">
              <PlayIcon
                className="text-blue-400 self-center mb-1"
                height={40}
                width={40}
              />
              Tips
            </a>
          </Link>

          <Link href="/guides">
            <a className="dark:bg-gray-700 bg-gray-100 rounded p-2 flex flex-col items-center font-semibold min-w-[72px] dark:hover:bg-white hover:bg-gray-50 dark:hover:bg-opacity-5">
              <MapIconOutline
                className="text-blue-400 self-center mb-1"
                height={40}
                width={40}
              />
              Guides
            </a>
          </Link>

          <Link href="/blog">
            <a className="dark:bg-gray-700 bg-gray-100 rounded p-2 flex flex-col items-center font-semibold min-w-[72px] dark:hover:bg-white hover:bg-gray-50 dark:hover:bg-opacity-5">
              <DocumentTextIconOutline
                className="text-blue-400 self-center mb-1"
                height={40}
                width={40}
              />
              Articles
            </a>
          </Link>
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex flex-col w-full px-3 pb-5 space-y-2 text-lg ">
            <div className="px-5 py-2 font-medium">Topics</div>
            {!isEmpty(viewer) && (
              <div className="bg-white dark:bg-gray-800">
                <div className="flex flex-col w-full">
                  <FeedbackInput
                    user={viewer}
                    className="flex items-center justify-start px-5 py-2 font-medium transition-all duration-150 ease-in-out rounded-sm hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:bg-opacity-40 hover:shadow-smooth"
                  >
                    Feedback
                  </FeedbackInput>
                  <Link href={`/user/membership`}>
                    <a
                      onClick={() =>
                        track('clicked bookmarks', {
                          location: 'header',
                        })
                      }
                      className="flex items-center justify-start px-5 py-2 font-medium transition-all duration-150 ease-in-out rounded-sm hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:bg-opacity-40 hover:shadow-smooth"
                    >
                      Membership
                    </a>
                  </Link>
                  {showTeamNavLink && <Team />}
                  <Link href={`/user/profile`}>
                    <a
                      onClick={() =>
                        track('clicked bookmarks', {
                          location: 'header',
                        })
                      }
                      className="flex items-center justify-start px-5 py-2 font-medium transition-all duration-150 ease-in-out rounded-sm hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:bg-opacity-40 hover:shadow-smooth"
                    >
                      Profile
                    </a>
                  </Link>
                  <Link href={`/user/activity`}>
                    <a
                      onClick={() =>
                        track('clicked bookmarks', {
                          location: 'header',
                        })
                      }
                      className="flex items-center justify-start px-5 py-2 font-medium transition-all duration-150 ease-in-out rounded-sm hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:bg-opacity-40 hover:shadow-smooth"
                    >
                      Activity
                    </a>
                  </Link>
                  <Link href={`/bookmarks`}>
                    <a
                      onClick={() =>
                        track('clicked bookmarks', {
                          location: 'header',
                        })
                      }
                      className="flex items-center justify-start px-5 py-2 font-medium transition-all duration-150 ease-in-out rounded-sm hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:bg-opacity-40 hover:shadow-smooth"
                    >
                      Bookmarks
                    </a>
                  </Link>
                  <hr className="opacity-20" />
                </div>
              </div>
            )}
          </div>
          <div>
            <Link href={`/logout`}>
              <a
                onClick={() =>
                  track('clicked bookmarks', {
                    location: 'header',
                  })
                }
                className="flex items-center justify-start px-5 py-2 font-medium transition-all duration-150 ease-in-out rounded-sm hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:bg-opacity-40 hover:shadow-smooth"
              >
                Log Out
              </a>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {!viewer?.is_pro && !viewer?.is_instructor && pathname !== '/pricing' && (
        <SaleHeaderBanner />
      )}
      <nav
        aria-label="header"
        className="relative h-12 text-sm border-b border-gray-100 dark:bg-gray-900 dark:border-gray-800 print:hidden dark:text-white text-gray-1000"
      >
        {isMounted && (
          <div className="container flex items-center justify-between w-full h-full">
            <div className="flex h-full">
              <Logo />

              {!sm && (
                <>
                  {!isTopics && <Browse viewer={viewer} />}
                  <div className="flex items-center h-full">
                    <Link href="/q">
                      <a className="flex items-center h-full px-3 dark:hover:bg-white hover:bg-gray-50 dark:hover:bg-opacity-5">
                        <CodeIcon
                          className=" text-blue-400 mr-1"
                          height={20}
                          width={20}
                        />
                        Courses
                      </a>
                    </Link>
                    <Link href="/tips">
                      <a
                        className="flex items-center h-full px-3 dark:hover:bg-white hover:bg-gray-50 dark:hover:bg-opacity-5"
                        onClick={() =>
                          analytics.events.activityInternalLinkClick(
                            'tips',
                            'header',
                            'tips',
                            '/tips',
                          )
                        }
                      >
                        <PlayIcon
                          className=" text-blue-400 mr-1"
                          height={20}
                          width={20}
                        />
                        Tips
                      </a>
                    </Link>
                    <Link href="/guides">
                      <a className="flex items-center h-full px-3 dark:hover:bg-white hover:bg-gray-50 dark:hover:bg-opacity-5">
                        <MapIconOutline
                          className=" text-blue-400 mr-1"
                          height={20}
                          width={20}
                        />
                        Guides
                      </a>
                    </Link>
                    <Link href="/blog">
                      <a className="flex items-center h-full px-3 dark:hover:bg-white hover:bg-gray-50 dark:hover:bg-opacity-5">
                        <DocumentTextIconOutline
                          className=" text-blue-400 mr-1"
                          height={20}
                          width={20}
                        />
                        Articles
                      </a>
                    </Link>
                  </div>
                </>
              )}
            </div>
            <div className="flex h-full">
              {!md && !isSearch && <SearchBar />}
              {!lg && !isEmpty(viewer) && <Feedback />}
              {!sm && (
                <>
                  <div className="flex items-center px-1">{activeCTA}</div>
                  <ProfileDropdown viewer={viewer} profileLink={profileLink} />
                </>
              )}
              {sm && !loading && (
                <button
                  onClick={() => setOpen(!isOpen)}
                  aria-labelledby="menubutton"
                  aria-expanded={isOpen}
                  className="flex items-center justify-center px-3 py-2 -mr-2 transition"
                >
                  <span className="sr-only">
                    {isOpen ? 'Close navigation' : 'Open navigation'}
                  </span>
                  {isOpen ? (
                    <XIcon className="w-8" aria-hidden />
                  ) : (
                    <MenuIcon className="w-8" aria-hidden />
                  )}
                </button>
              )}
            </div>
          </div>
        )}
        {isOpen && <MobileNavigation />}
      </nav>
    </>
  )
}

export default Header

const Team = () => {
  return (
    <Link href={`/team`}>
      <a
        onClick={() =>
          track('clicked team', {
            location: 'header',
          })
        }
        className="flex items-center h-full px-2 dark:hover:bg-white hover:bg-gray-50 dark:hover:bg-opacity-5"
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
          className="flex items-center h-full px-2 dark:hover:bg-white hover:bg-gray-50 dark:hover:bg-opacity-5"
        >
          Sign in
        </a>
      </Link>
    </div>
  )
}

const ProfileDropdown: React.FC<React.PropsWithChildren<any>> = ({
  viewer,
  profileLink,
}) => {
  const {lg} = useBreakpoint()

  if (isEmpty(viewer)) return <Login />

  const showTeamNavLink =
    viewer?.accounts &&
    !isEmpty(
      viewer.accounts.filter(
        (account: {account_capacity: string}) =>
          account.account_capacity === 'team',
      ),
    )

  return (
    <Popover className="relative">
      {({open, close}) => (
        <>
          <Popover.Button className="flex items-center h-full w-full ">
            {!isEmpty(viewer) && (
              <div
                onClick={() =>
                  track('clicked account', {
                    location: 'header',
                  })
                }
                className="flex shrink-0 items-center h-full px-2 dark:hover:bg-white hover:bg-gray-50 dark:hover:bg-opacity-5"
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
                <ChevronDownIcon className="h-4 mt-px " aria-hidden="true" />
              </div>
            )}
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
              className="absolute right-0 z-50 w-[200px] px-2  lg:max-w-xl md:max-w-lg sm:max-w-md sm:px-0"
            >
              {({close}) => (
                <div className="overflow-hidden max-w-[200px] rounded-b-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative bg-white dark:bg-gray-800">
                    <div className="py-2 flex flex-col w-full">
                      <Link href={`/user/membership`}>
                        <a
                          onClick={() =>
                            track('clicked bookmarks', {
                              location: 'header',
                            })
                          }
                          className="flex items-center justify-start px-5 py-2 font-medium transition-all duration-150 ease-in-out rounded-sm hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:bg-opacity-40 hover:shadow-smooth"
                        >
                          Membership
                        </a>
                      </Link>
                      {showTeamNavLink && <Team />}
                      <Link href={`/user/profile`}>
                        <a
                          onClick={() =>
                            track('clicked bookmarks', {
                              location: 'header',
                            })
                          }
                          className="flex items-center justify-start px-5 py-2 font-medium transition-all duration-150 ease-in-out rounded-sm hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:bg-opacity-40 hover:shadow-smooth"
                        >
                          Profile
                        </a>
                      </Link>
                      <Link href={`/user/activity`}>
                        <a
                          onClick={() =>
                            track('clicked bookmarks', {
                              location: 'header',
                            })
                          }
                          className="flex items-center justify-start px-5 py-2 font-medium transition-all duration-150 ease-in-out rounded-sm hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:bg-opacity-40 hover:shadow-smooth"
                        >
                          Activity
                        </a>
                      </Link>
                      <Link href={`/bookmarks`}>
                        <a
                          onClick={() =>
                            track('clicked bookmarks', {
                              location: 'header',
                            })
                          }
                          className="flex items-center justify-start px-5 py-2 font-medium transition-all duration-150 ease-in-out rounded-sm hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:bg-opacity-40 hover:shadow-smooth"
                        >
                          Bookmarks
                        </a>
                      </Link>
                      <hr className="opacity-20" />
                      {lg && (
                        <FeedbackInput
                          user={viewer}
                          className="flex items-center justify-start px-5 py-2 font-medium transition-all duration-150 ease-in-out rounded-sm hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:bg-opacity-40 hover:shadow-smooth"
                        >
                          Feedback
                        </FeedbackInput>
                      )}
                      <Link href={`/logout`}>
                        <a
                          onClick={() =>
                            track('clicked bookmarks', {
                              location: 'header',
                            })
                          }
                          className="flex items-center justify-start px-5 py-2 font-medium transition-all duration-150 ease-in-out rounded-sm hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:bg-opacity-40 hover:shadow-smooth"
                        >
                          Log Out
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}

const Browse: React.FC<React.PropsWithChildren<any>> = ({viewer}) => {
  const {subscriber} = useCio()
  const browse = [
    {
      name: 'React',
      href: '/q/react',
      image:
        'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/square_64/react.png',
    },
    {
      name: 'Angular',
      href: '/q/angular',
      image:
        'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1699480502/tags/angular.png',
    },
    {
      name: 'Vue.js',
      href: '/q/vue',
      image:
        'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/036/square_64/vue.png',
    },
    {
      name: 'Next.js',
      href: '/q/next',
      image:
        'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/074/thumb/Group_1%281%29.png',
    },
    {
      name: 'TypeScript',
      href: '/q/typescript',
      image:
        'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/377/square_64/typescriptlang.png',
    },
    {
      name: 'JavaScript',
      href: '/q/javascript',
      image:
        'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/205/square_64/javascriptlang.png',
    },
    {
      name: 'CSS',
      href: '/q/css',
      image:
        'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/175/square_64/csslang.png',
    },
  ]

  return (
    <Popover>
      {({open, close}) => (
        <>
          <Popover.Button className="flex items-center h-full px-3 dark:hover:bg-white hover:bg-gray-50 dark:hover:bg-opacity-5">
            <BookOpenIcon
              className=" text-blue-400 mr-1"
              height={20}
              width={20}
            />
            <span>Topics</span>
            <ChevronDownIcon className="h-4 mt-px" aria-hidden="true" />
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
              className="absolute left-0 z-50 w-full px-2 sm:left-auto lg:max-w-xl md:max-w-lg sm:max-w-md sm:px-0"
            >
              {({close}) => (
                <div className="overflow-hidden  max-w-[300px] rounded-b-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative bg-white dark:bg-gray-800">
                    {!isMember(viewer, subscriber?.attributes) && (
                      <Link href={!viewer?.is_pro ? '/learn' : '/'}>
                        <a
                          onClick={() => {
                            close()
                          }}
                          className="relative flex items-center p-5 overflow-hidden text-white transition bg-blue-600 hover:bg-blue-500 group"
                        >
                          <div className="relative z-10">
                            <div className="text-xs font-medium tracking-wide uppercase opacity-80">
                              start here
                            </div>
                            <div className="text-base font-semibold">
                              Curated Courses{' '}
                              <span
                                aria-hidden="true"
                                className="inline-flex transition group-hover:translate-x-1"
                              >
                                &rarr;
                              </span>
                            </div>
                          </div>
                          <div className="absolute right-0 transition origin-right scale-50 sm:scale-90 group-hover:opacity-40">
                            <MazePattern />
                          </div>
                        </a>
                      </Link>
                    )}
                    <div className="px-5 pt-5 text-xs font-medium tracking-wide uppercase opacity-80">
                      Topics
                    </div>
                    <div className="py-2 flex flex-col w-full">
                      {browse.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          onClick={() => {
                            analytics.events.activityInternalLinkClick(
                              'curated topic page',
                              'header browse',
                              item.name,
                              item.href,
                            )
                          }}
                          className="flex items-center justify-start px-5 py-3 transition-all duration-150 ease-in-out rounded-sm hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:bg-opacity-40 hover:shadow-smooth"
                        >
                          <div className="flex items-center justify-center flex-shrink-0">
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
                    </div>
                    <a
                      href="/topics"
                      onClick={() => {
                        analytics.events.activityInternalLinkClick(
                          'search all topics',
                          'header browse',
                          'all topics',
                          '/topics',
                        )
                      }}
                      className="flex items-center w-full px-5 py-3 font-medium leading-tight transition duration-150 ease-in-out rounded-sm lg:col-span-2 lg:px-5 sm:px-3 group hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:bg-opacity-40 hover:shadow-smooth justify-between"
                    >
                      Browse all topics{' '}
                      <span
                        className="inline-flex pl-1 transition group-hover:translate-x-1 text-blue-300"
                        aria-hidden="true"
                      >
                        &rarr;
                      </span>
                    </a>
                  </div>
                </div>
              )}
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}
