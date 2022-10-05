import * as React from 'react'
import {FunctionComponent} from 'react'
import Link from '../link'
import Image from 'next/image'
import Eggo from '../images/eggo.svg'
import {track} from 'utils/analytics'
import {useViewer} from 'context/viewer-context'
import {reject} from 'lodash'
import {useTheme} from 'next-themes'
import useCio from 'hooks/use-cio'

const content = [
  {
    path: '/q',
    label: 'Search',
  },
  {
    path: '/blog',
    label: 'Articles',
  },
  {
    path: '/talks',
    label: 'Talks',
  },
  {
    path: '/podcasts',
    label: 'Podcasts',
  },
  {
    path: '/topics',
    label: 'Topics',
  },
  {
    path: '/site-directory',
    label: 'Machine',
  },
]

const about = [
  {
    path: '/pricing',
    label: 'Pricing',
    nonMemberRequired: true,
  },
  {
    path: 'https://store.egghead.io/',
    label: 'Store',
  },
  {
    path: 'mailto:support@egghead.io',
    label: 'support@egghead.io',
  },
  {
    path: '/logout',
    label: 'Log Out',
    viewerRequired: true,
  },
]

const Item: FunctionComponent<{
  children: React.ReactNode
  path: string
  onClick: any
}> = ({children, path, onClick}) => (
  <li className="py-1 text-base leading-relaxed md:text-sm">
    <Link href={path} activeClassName="underline">
      <a
        onClick={onClick}
        className="transition-colors duration-150 ease-in-out hover:text-blue-600"
      >
        {children}
      </a>
    </Link>
  </li>
)

const FooterNavigation: FunctionComponent = () => {
  const {viewer} = useViewer()
  const filterViewerRequired = (items: any[]) => {
    return reject(items, (item) => {
      return (
        (item.viewerRequired && !viewer) ||
        (item.nonMemberRequired && viewer?.is_pro)
      )
    })
  }
  return (
    <nav
      aria-label="footer"
      className="flex flex-col items-center justify-between w-full gap-6 pt-16 pb-16 space-y-6 md:space-y-0 md:flex-row md:items-start md:pt-14 lg:pb-40"
    >
      <div className="flex flex-col items-center h-full space-y-5 md:items-start max-w-[18rem]">
        <Link href="/">
          <a className="flex flex-col items-center space-y-3 text-center md:flex-row md:items-start md:text-left md:space-x-2 md:space-y-0">
            <div className="flex-shrink-0 w-12 md:w-8">
              <Image src={Eggo} alt="egghead.io logo" />
            </div>
            <div className="mt-1 text-lg font-semibold tracking-tight leading-tighter">
              Expert led courses for professional front-end web developers.
            </div>
          </a>
        </Link>
      </div>
      <div className="grid items-center w-full grid-cols-1 text-center md:grid-cols-2 lg:pr-6 md:gap-10 md:text-left md:items-start md:w-auto">
        <ul>
          {filterViewerRequired(content).map((link) => (
            <Item
              onClick={() =>
                track(`clicked ${link.label}`, {location: 'footer'})
              }
              path={link.path}
              key={link.path}
            >
              {link.label}
            </Item>
          ))}
        </ul>
        <ul>
          {filterViewerRequired(about).map((link) => (
            <Item
              onClick={() =>
                track(`clicked ${link.label}`, {location: 'footer'})
              }
              path={link.path}
              key={link.path}
            >
              {link.label}
            </Item>
          ))}
        </ul>
      </div>
    </nav>
  )
}

const Footer: FunctionComponent = () => {
  const [isMounted, setIsMounted] = React.useState<boolean>(false)
  React.useEffect(() => setIsMounted(true), [])
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 print:hidden dark:text-gray-200">
      <div className="container">
        {isMounted && <FooterNavigation />}
        <small className="flex items-center justify-center w-full py-6 space-x-6 text-xs text-gray-500 md:justify-end dark:text-gray-300">
          <div>©egghead.io</div>
          <Link href="/privacy">
            <a onClick={() => track(`clicked privacy`, {location: 'footer'})}>
              Terms & Conditions
            </a>
          </Link>
          <Link href="/faq">
            <a onClick={() => track(`clicked faq`, {location: 'footer'})}>
              FAQ
            </a>
          </Link>
          {isMounted && <DarkModeToggle />}
        </small>
      </div>
    </footer>
  )
}

const DarkModeToggle = () => {
  const {subscriber, cioIdentify} = useCio()
  const {resolvedTheme, setTheme} = useTheme()
  const handleClick = () => {
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    track(`toggled dark mode`, {
      mode: nextTheme,
      location: 'footer',
    })
    if (subscriber) {
      cioIdentify(subscriber.id, {
        theme_preference: nextTheme,
      })
    }
  }
  return (
    <div className="flex items-center justify-between">
      <h2 className="hidden mr-3 sm:block">
        {resolvedTheme === 'dark' ? 'Dark' : 'Light'} Mode
      </h2>
      <div
        className="flex-shrink-0 w-16 h-10 p-1 bg-gray-300 rounded-full dark:bg-gray-1000"
        onClick={handleClick}
        aria-label="Toggle Dark Mode"
        role="button"
      >
        <div
          className={`bg-white w-8 h-8 rounded-full shadow-md duration-300 ease-in-out flex items-center justify-center dark:bg-gray-800 ${
            resolvedTheme === 'dark' ? 'translate-x-6' : ''
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            className="w-4 h-4 text-gray-400 dark:text-gray-200"
          >
            {resolvedTheme === 'dark' ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            )}
          </svg>
        </div>
      </div>
    </div>
  )
}
export default Footer
