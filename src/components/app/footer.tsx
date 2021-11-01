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
  <li className="py-1 md:text-sm text-base leading-relaxed">
    <Link href={path} activeClassName="underline">
      <a
        onClick={onClick}
        className="hover:text-blue-600 transition-colors ease-in-out duration-150"
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
      return item.viewerRequired && !viewer
    })
  }
  return (
    <nav
      aria-label="footer"
      className="w-full md:space-y-0 space-y-6 flex md:flex-row flex-col items-center md:items-start justify-between gap-6 md:pt-14 pt-16 lg:pb-40 pb-16"
    >
      <div className="space-y-5 h-full flex flex-col md:items-start items-center w-72">
        <Link href="/">
          <a className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left md:space-x-2 space-y-3 md:space-y-0">
            <div className="md:w-8 w-12 flex-shrink-0">
              <Image src={Eggo} alt="egghead.io logo" />
            </div>
            <div className="mt-1 text-lg font-semibold leading-tighter tracking-tight">
              Build your Developer Portfolio and climb the engineering career
              ladder.
            </div>
          </a>
        </Link>
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 lg:pr-6 md:gap-10 md:text-left text-center md:items-start items-center md:w-auto w-full">
        <ul>
          {filterViewerRequired(content).map((link) => (
            <Item
              onClick={() => track(`clicked ${link.label} (footer)`)}
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
              onClick={() => track(`clicked ${link.label} (footer)`)}
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
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 print:hidden dark:text-gray-200 px-5">
      <div className="max-w-screen-xl w-full mx-auto">
        <FooterNavigation />
        <small className="space-x-6 py-6 text-xs w-full flex items-center md:justify-end justify-center text-gray-500 dark:text-gray-300">
          <div>©egghead.io</div>
          <Link href="/privacy">
            <a onClick={() => track(`clicked privacy`, {location: 'footer'})}>
              Terms & Conditions
            </a>
          </Link>
          <DarkModeToggle />
        </small>
      </div>
    </footer>
  )
}

const DarkModeToggle = () => {
  const [isMounted, setIsMounted] = React.useState<boolean>(false)
  const {subscriber, cioIdentify} = useCio()
  const {theme, setTheme} = useTheme()
  React.useEffect(() => setIsMounted(true), [])
  const handleClick = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    track(`toggled dark mode`, {
      mode: nextTheme,
    })
    if (subscriber) {
      cioIdentify(subscriber.id, {
        theme_preference: nextTheme,
      })
    }
  }
  return (
    <div className="flex justify-between items-center">
      <h2 className="mr-3">
        {isMounted && (theme === 'dark' ? 'Dark' : 'Light')} Mode
      </h2>
      <div
        className="w-16 h-10 bg-gray-300 dark:bg-gray-1000 rounded-full flex-shrink-0 p-1"
        onClick={handleClick}
        aria-label="Toggle Dark Mode"
        role="button"
      >
        <div
          className={`bg-white w-8 h-8 rounded-full shadow-md duration-300 ease-in-out flex items-center justify-center dark:bg-gray-800 ${
            isMounted && (theme === 'dark' ? 'translate-x-6' : '')
          }`}
        >
          {isMounted && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              className="h-4 w-4 text-gray-400 dark:text-gray-200"
            >
              {theme === 'dark' ? (
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
          )}
        </div>
      </div>
    </div>
  )
}
export default Footer
