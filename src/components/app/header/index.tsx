'use client'
import * as React from 'react'
import {FunctionComponent} from 'react'
import Link from '../../link'
import NextLink from 'next/link'
import Image from 'next/legacy/image'
import Eggo from '@/components/icons/eggo'
import {useViewer} from '@/context/viewer-context'
import {track} from '@/utils/analytics'
import {isEmpty} from 'lodash'
import FeedbackInput from '@/components/feedback-input'
import {useRouter, usePathname} from 'next/navigation'
import useCio from '@/hooks/use-cio'
import PortfolioFoundationsCTA from '@/components/survey/portfolio-foundations'
import OnlinePresenceCTA from '@/components/survey/online-presence-cta'
import {HeaderButtonShapedLink} from './header-button-shaped-link'
import SearchBar from './search-bar'
import {Fragment} from 'react'
import {Popover, Transition} from '@headlessui/react'
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MicrophoneIcon,
  PresentationChartBarIcon,
  DocumentTextIcon,
  MenuIcon,
  XIcon,
  PlayIcon,
  MapIcon,
} from '@heroicons/react/solid'
import {
  BookOpenIcon,
  PlayIcon as PlayIconOutline,
  MapIcon as MapIconOutline,
  DocumentTextIcon as DocumentTextIconOutline,
  CodeIcon,
  SearchIcon,
} from '@heroicons/react/outline'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion'
import SaleHeaderBanner from '@/components/cta/sale/header-banner'
import {MazePattern} from './images'
import {isMember} from '@/utils/is-member'
import analytics from '@/utils/analytics'
import cx from 'classnames'
import {twMerge} from 'tailwind-merge'
import {Search} from 'lucide-react'

type NavLink = {
  name: string
  href?: string
  image?: React.JSX.Element | string
  items?: NavLink[]
}

const navLinks = [
  {
    name: 'Topics',
    image: (
      <BookOpenIcon
        className="text-gray-600 dark:text-gray-400"
        strokeWidth={1.5}
        height={20}
        width={20}
        aria-hidden="true"
      />
    ),
    href: '/topics',
    items: [
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
    ],
  },
  {
    name: 'Courses',
    href: '/q?type=playlist',
    image: (
      <CodeIcon
        className="text-gray-600 dark:text-gray-400"
        strokeWidth={1.5}
        height={20}
        width={20}
        aria-hidden="true"
      />
    ),
  },
  {
    name: 'Tips',
    href: '/tips',
    image: (
      <PlayIconOutline
        className="text-gray-600 dark:text-gray-400"
        strokeWidth={1.5}
        height={20}
        width={20}
        aria-hidden="true"
      />
    ),
  },
  {
    name: 'Guides',
    href: '/guides',
    image: (
      <MapIconOutline
        className=" text-gray-600 dark:text-gray-400"
        strokeWidth={1.5}
        height={20}
        width={20}
        aria-hidden="true"
      />
    ),
  },
  {
    name: 'Articles',
    href: '/blog',
    image: (
      <DocumentTextIconOutline
        className="text-gray-600 dark:text-gray-400"
        strokeWidth={1.5}
        height={20}
        width={20}
        aria-hidden="true"
      />
    ),
  },
]

const NavLink: React.FC<React.PropsWithChildren<NavLink>> = ({
  name,
  href,
  items,
  image,
}) => {
  const props = {
    className:
      'flex items-center h-full px-3 dark:hover:bg-white transition hover:bg-gray-50 gap-1 dark:hover:bg-opacity-5',
    children: (
      <>
        {image}
        {name}
      </>
    ),
    onClick: () => {
      track(`clicked ${name}`, {
        location: 'header',
      })
    },
  }

  const LinkOrButton = () =>
    items ? (
      <NavDropdown
        name={name}
        items={items}
        href={href}
        className={props.className}
      />
    ) : href ? (
      React.createElement(NextLink, {href, ...props})
    ) : (
      React.createElement('button', {
        ...props,
        onClick: () => {
          props.onClick()
          // do stuff
        },
      })
    )

  return <LinkOrButton />
}

const NavDropdown: React.FC<
  React.PropsWithChildren<NavLink & {className?: string}>
> = ({name, items, className, href}) => {
  const {viewer, loading} = useViewer()
  const {subscriber, loadingSubscriber} = useCio()

  return (
    <Popover className={'h-full'}>
      {({open, close}) => (
        <>
          <Popover.Button
            className={twMerge(
              'flex items-center gap-1 h-full px-3 dark:hover:bg-white hover:bg-gray-50 dark:hover:bg-opacity-5',
              className,
            )}
          >
            <BookOpenIcon
              strokeWidth={1.5}
              className="text-gray-600 dark:text-gray-400"
              height={20}
              width={20}
            />
            <span>{name}</span>
            <ChevronDownIcon
              className="h-4 -ml-1 text-gray-600 dark:text-gray-400 mt-px"
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
              className="absolute left-0 z-50 w-full sm:left-auto lg:max-w-xl md:max-w-lg sm:max-w-md sm:px-0"
            >
              {({close}) => (
                <div className="overflow-hidden max-w-[300px] rounded-b-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative bg-white dark:bg-gray-800">
                    <div className="flex flex-col w-full">
                      {items?.map(({name, href, image}) => (
                        <a
                          key={name}
                          href={href}
                          onClick={() => {
                            track(`clicked ${name}`, {
                              location: 'header',
                            })
                          }}
                          className="flex items-center justify-start px-5 py-3 transition-all duration-150 ease-in-out rounded-sm hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:bg-opacity-40 hover:shadow-smooth"
                        >
                          <div className="flex items-center justify-center flex-shrink-0">
                            {typeof image === 'string' && (
                              <Image
                                width={24}
                                height={24}
                                src={image}
                                alt={name}
                                quality={100}
                                priority
                              />
                            )}
                          </div>
                          <span className="pl-2 font-medium text-gray-700 transition duration-150 ease-in-out dark:text-white hover:text-black">
                            {name}
                          </span>
                        </a>
                      ))}
                    </div>
                    {href && (
                      <Link href={href}>
                        <a
                          onClick={() => {
                            track(`clicked All ${name}`, {
                              location: 'header',
                            })
                          }}
                          className="flex items-center w-full px-5 py-3 font-medium leading-tight transition duration-150 ease-in-out rounded-sm lg:col-span-2 lg:px-5 sm:px-3 group hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:bg-opacity-40 hover:shadow-smooth justify-between"
                        >
                          All {name}{' '}
                          <span
                            className="inline-flex pl-1 transition group-hover:translate-x-1 dark:text-gray-400 text-gray-600"
                            aria-hidden="true"
                          >
                            &rarr;
                          </span>
                        </a>
                      </Link>
                    )}
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

const Header: FunctionComponent<React.PropsWithChildren<unknown>> = () => {
  const router = useRouter()
  const {viewer, loading} = useViewer()
  const {subscriber, loadingSubscriber} = useCio()

  const pathname = usePathname() || ''

  const isSearch = pathname.includes('/q')
  const isTopics = pathname.includes('/topics')

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

  return (
    <>
      {!viewer?.is_pro && !viewer?.is_instructor && pathname !== '/pricing' && (
        <SaleHeaderBanner />
      )}
      <nav
        aria-label="header"
        className="relative h-12 text-sm border-b border-gray-100 dark:bg-gray-900 dark:border-gray-800 print:hidden dark:text-white text-gray-1000"
      >
        <div className="container flex items-center justify-between w-full h-full relative">
          <div className="flex h-full">
            <Logo />
            <div className="hidden items-center h-full lg:flex">
              {navLinks.map((link) => {
                return <NavLink key={link.name} {...link} />
              })}
            </div>
          </div>
          <div className="flex items-center h-full">
            {loading ? null : (
              <>
                {!isSearch && <SearchBar className="lg:block hidden" />}
                {!isEmpty(viewer) && <Feedback className="lg:flex hidden" />}
                <div className="flex items-center px-1">{activeCTA}</div>

                {isEmpty(viewer) ? (
                  <NavLink href="/login" name="Sign in" />
                ) : (
                  <ProfileDropdown />
                )}
              </>
            )}
            <MobileNavigation />
          </div>
        </div>
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
          analytics.events.activityInternalLinkClick(
            'page',
            'header',
            'team',
            '/team',
          )
        }
        className="flex items-center h-full px-2 dark:hover:bg-white hover:bg-gray-50 dark:hover:bg-opacity-5"
      >
        Team
      </a>
    </Link>
  )
}

const ProfileDropdown: React.FC<React.PropsWithChildren> = () => {
  const {viewer} = useViewer()

  const isInstructor = viewer?.is_instructor || false
  const isProOrInstructor = viewer?.is_pro || isInstructor
  const profileLink = isInstructor ? '/instructor' : '/user/membership'

  const showTeamNavLink =
    viewer?.accounts &&
    !isEmpty(
      viewer.accounts.filter(
        (account: {account_capacity: string}) =>
          account.account_capacity === 'team',
      ),
    )

  return (
    <Popover className="relative h-full">
      {({open, close}) => (
        <>
          <Popover.Button className="flex items-center h-full w-full">
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
                            analytics.events.activityInternalLinkClick(
                              'page',
                              'header',
                              'membership',
                              '/user/membership',
                            )
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
                            analytics.events.activityInternalLinkClick(
                              'page',
                              'header',
                              'profile',
                              '/user/profile',
                            )
                          }
                          className="flex items-center justify-start px-5 py-2 font-medium transition-all duration-150 ease-in-out rounded-sm hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:bg-opacity-40 hover:shadow-smooth"
                        >
                          Profile
                        </a>
                      </Link>
                      <Link href={`/user/activity`}>
                        <a
                          onClick={() =>
                            analytics.events.activityInternalLinkClick(
                              'page',
                              'header',
                              'activity',
                              '/user/activity',
                            )
                          }
                          className="flex items-center justify-start px-5 py-2 font-medium transition-all duration-150 ease-in-out rounded-sm hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:bg-opacity-40 hover:shadow-smooth"
                        >
                          Activity
                        </a>
                      </Link>
                      <Link href={`/bookmarks`}>
                        <a
                          onClick={() =>
                            analytics.events.activityInternalLinkClick(
                              'page',
                              'header',
                              'bookmarks',
                              '/bookmarks',
                            )
                          }
                          className="flex items-center justify-start px-5 py-2 font-medium transition-all duration-150 ease-in-out rounded-sm hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:bg-opacity-40 hover:shadow-smooth"
                        >
                          Bookmarks
                        </a>
                      </Link>
                      <hr className="opacity-20" />

                      <FeedbackInput
                        user={viewer}
                        className="flex items-center justify-start px-5 py-2 font-medium transition-all duration-150 ease-in-out rounded-sm hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:bg-opacity-40 hover:shadow-smooth"
                      >
                        Feedback
                      </FeedbackInput>

                      <Link href={`/logout`}>
                        <a
                          onClick={() =>
                            analytics.events.activityInternalLinkClick(
                              'logout',
                              'header',
                              'logout',
                            )
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

const MobileNavigation = () => {
  const {viewer, loading} = useViewer()
  const [isOpen, setOpen] = React.useState<boolean>(false)
  const showEnrollNow = !viewer?.is_pro && !viewer?.is_instructor

  // React.useEffect(() => {
  //   const originalStyle = window.getComputedStyle(document.body).overflow
  //   if (isOpen) {
  //     document.body.style.overflow = 'hidden'
  //   } else {
  //     document.body.style.overflow = originalStyle
  //   }

  //   // Cleanup function to reset overflow style
  //   return () => {
  //     document.body.style.overflow = originalStyle
  //   }
  // }, [isOpen])

  const MobileNavLinkButton = ({
    href,
    children,
  }: {
    href: string
    children: any
  }) => {
    return (
      <Link href={href}>
        <a
          onClick={() =>
            analytics.events.activityInternalLinkClick(
              'page',
              'mobile header',
              href,
            )
          }
          className="dark:bg-gray-700 bg-gray-100 rounded p-2 flex flex-col items-center font-semibold min-w-[72px] dark:hover:bg-white hover:bg-gray-50 dark:hover:bg-opacity-5"
        >
          {children}
        </a>
      </Link>
    )
  }

  const showTeamNavLink =
    viewer?.accounts &&
    !isEmpty(
      viewer.accounts.filter(
        (account: {account_capacity: string}) =>
          account.account_capacity === 'team',
      ),
    )

  return (
    <>
      <div className="inline-flex items-center gap-4 lg:hidden h-full -mr-3">
        {/* {!isSearch && <MobileSearch />} */}
        <button
          onClick={() => setOpen(!isOpen)}
          aria-labelledby="menubutton"
          aria-expanded={isOpen}
          className="flex items-center justify-center p-3 transition"
        >
          <span className="sr-only">
            {isOpen ? 'Close navigation' : 'Open navigation'}
          </span>
          {isOpen ? (
            <XIcon className="w-5" strokeWidth={0.5} aria-hidden="true" />
          ) : (
            <MenuIcon className="w-5" strokeWidth={0.5} aria-hidden="true" />
          )}
        </button>
      </div>
      {isOpen ? (
        <div className="fixed top-12 w-full h-screen dark:bg-gray-900 bg-white z-50 left-0 lg:hidden flex flex-col">
          <div className="flex w-full justify-center gap-4 py-4">
            <MobileNavLinkButton href="/q">
              <CodeIcon className="mb-1" height={40} width={40} />
              Courses
            </MobileNavLinkButton>

            <MobileNavLinkButton href="/tips">
              <PlayIcon className="mb-1" height={40} width={40} />
              Tips
            </MobileNavLinkButton>

            <MobileNavLinkButton href="/guides">
              <MapIcon className="mb-1" height={40} width={40} />
              Guides
            </MobileNavLinkButton>

            <MobileNavLinkButton href="/blog">
              <DocumentTextIcon className="mb-1" height={40} width={40} />
              Articles
            </MobileNavLinkButton>
          </div>
          <div className="flex flex-col h-full justify-between">
            <div className="flex flex-col w-full pb-5 text-lg ">
              <MobileTopicsList />
              {!isEmpty(viewer) && (
                <div className="bg-white dark:bg-gray-800">
                  <div className="flex flex-col w-full">
                    <FeedbackInput
                      user={viewer}
                      className="flex items-center justify-start px-5 py-4 font-medium transition-all duration-150 ease-in-out rounded-sm hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:bg-opacity-40 hover:shadow-smooth border-b border-gray-100 border-opacity-40"
                    >
                      Feedback
                    </FeedbackInput>
                    <Link href={`/user/membership`}>
                      <a
                        onClick={() =>
                          analytics.events.activityInternalLinkClick(
                            'page',
                            'mobile header',
                            'membership',
                            '/user/membership',
                          )
                        }
                        className="flex items-center justify-start px-5 py-4 font-medium transition-all duration-150 ease-in-out rounded-sm hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:bg-opacity-40 hover:shadow-smooth border-b border-gray-100  border-opacity-40"
                      >
                        Membership
                      </a>
                    </Link>
                    {showTeamNavLink && <Team />}
                    <Link href={`/user/profile`}>
                      <a
                        onClick={() =>
                          analytics.events.activityInternalLinkClick(
                            'page',
                            'mobile header',
                            'profile',
                            '/user/profile',
                          )
                        }
                        className="flex items-center justify-start px-5 py-4 font-medium transition-all duration-150 ease-in-out rounded-sm hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:bg-opacity-40 hover:shadow-smooth border-b border-gray-100  border-opacity-40"
                      >
                        Profile
                      </a>
                    </Link>
                    <Link href={`/user/activity`}>
                      <a
                        onClick={() =>
                          analytics.events.activityInternalLinkClick(
                            'page',
                            'mobile header',
                            'activity',
                            '/user/activity',
                          )
                        }
                        className="flex items-center justify-start px-5 py-4 font-medium transition-all duration-150 ease-in-out rounded-sm hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:bg-opacity-40 hover:shadow-smooth border-b border-gray-100  border-opacity-40"
                      >
                        Activity
                      </a>
                    </Link>
                    <Link href={`/bookmarks`}>
                      <a
                        onClick={() =>
                          analytics.events.activityInternalLinkClick(
                            'page',
                            'mobile header',
                            'bookmarks',
                            '/bookmarks',
                          )
                        }
                        className="flex items-center justify-start px-5 py-4 font-medium transition-all duration-150 ease-in-out rounded-sm hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:bg-opacity-40 hover:shadow-smooth border-b border-gray-100  border-opacity-40"
                      >
                        Bookmarks
                      </a>
                    </Link>
                  </div>
                </div>
              )}
              <div>
                {showEnrollNow && (
                  <Link href={`/pricing`}>
                    <a
                      onClick={() =>
                        analytics.events.activityInternalLinkClick(
                          'page',
                          'mobile header',
                          'pricing',
                          '/pricing',
                        )
                      }
                      className="flex text-lg font-medium items-center justify-start px-5 py-4  transition-all duration-150 ease-in-out rounded-sm hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:bg-opacity-40 hover:shadow-smooth bg-blue-500"
                    >
                      Enroll Now
                    </a>
                  </Link>
                )}
              </div>
            </div>
            <div className="sticky bottom-2">
              <Link href={`/logout`}>
                <a
                  onClick={() =>
                    analytics.events.activityInternalLinkClick(
                      'logout',
                      'mobile header',
                      'logout',
                    )
                  }
                  className="flex text-lg items-center justify-start px-5 py-2 transition-all duration-150 ease-in-out rounded-sm hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:bg-opacity-40 hover:shadow-smooth"
                >
                  Log Out
                </a>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

const MobileTopicsList = () => {
  const [open, setOpen] = React.useState<string>('')

  return (
    <Accordion
      type="single"
      collapsible
      value={open}
      onValueChange={setOpen}
      className="font-medium border-y border-gray-100 border-opacity-40 w-full "
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="flex justify-between items-center px-5 py-4 w-full">
          <div>Topics</div>
          {open.includes(`item-1`) ? (
            <ChevronDownIcon
              className="relative h-8 w-8 transition group-radix-state-open:rotate-180"
              aria-hidden="true"
            />
          ) : (
            <ChevronRightIcon
              className="relative h-8 w-8 transition"
              aria-hidden="true"
            />
          )}
        </AccordionTrigger>
        <AccordionContent className="dark:bg-gray-700 bg-gray-100 w-full data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <div className="py-2 flex flex-col w-full">
            {navLinks[0]?.items?.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => {
                  analytics.events.activityInternalLinkClick(
                    'curated topic page',
                    'header mobile browse',
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
            <Link href="/topics">
              <a
                onClick={() => {
                  analytics.events.activityInternalLinkClick(
                    'search all topics',
                    'header mobile browse',
                    'all topics',
                    '/topics',
                  )
                }}
                className="flex items-center w-full px-5 py-3 font-medium leading-tight transition duration-150 ease-in-out rounded-sm lg:col-span-2 lg:px-5 sm:px-3 group hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:bg-opacity-40 hover:shadow-smooth justify-between border-t border-gray-100"
              >
                Browse all topics{' '}
                <span
                  className="inline-flex pl-1 transition group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  &rarr;
                </span>
              </a>
            </Link>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

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

const Feedback: React.FC<{className?: string}> = ({className}) => {
  const {viewer, loading} = useViewer()
  return loading ? null : (
    <FeedbackInput
      user={viewer}
      className={twMerge(
        'flex items-center h-full px-3 dark:hover:bg-white hover:bg-gray-50 dark:hover:bg-opacity-5',
        className,
      )}
    >
      Feedback
    </FeedbackInput>
  )
}

const MobileSearch = () => {
  const [open, setOpen] = React.useState<boolean>(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center dark:bg-gray-700 bg-gray-100 rounded-full w-8 h-8 transition duration-150 ease-in-out"
      >
        <div className="">
          <XIcon
            className={twMerge(
              'w-5 transition-transform duration-300 ease-in-out',
              cx({
                'scale-100': open,
                'scale-0': !open,
              }),
            )}
          />
          <SearchIcon
            className={twMerge(
              'absolute top-[20%] w-5 transition-transform duration-300 ease-in-out',
              cx({
                'scale-0': open,
                'scale-100': !open,
              }),
            )}
          />
        </div>
      </button>
      {open && (
        <SearchBar className="absolute top-[41px] right-[-58px] w-screen z-10 dark:bg-gray-700 bg-gray-100" />
      )}
    </div>
  )
}
