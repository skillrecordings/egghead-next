import * as React from 'react'
import {FunctionComponent} from 'react'
import Link from '../Link'
import Eggo from '../images/eggo.svg'
import {track} from 'utils/analytics'

const content = [
  {
    path: '/q',
    label: 'Content',
  },
  {
    path: '/learn',
    label: 'Topics',
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
    path: '/site-directory',
    label: 'Directory',
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
  // {
  //   path: '/instructors',
  //   label: 'Instructors',
  // },
  // {
  //   path: '/stories',
  //   label: 'Stories',
  // },
  // {
  //   path: '/team',
  //   label: 'Team',
  // },
]

// const Title: FunctionComponent<{children: React.ReactNode}> = ({children}) => (
//   <h5 className="font-light font-mono tracking-wider text-xs text-gray-600 mb-2 uppercase">
//     {children}
//   </h5>
// )

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
  return (
    <nav className="w-full md:space-y-0 space-y-6 flex md:flex-row flex-col items-start justify-between gap-6 md:pt-14 pt-16 lg:pb-40 pb-16">
      <div className="space-y-5 h-full flex flex-col md:items-start items-center lg:w-72 w-full">
        <Link href="/">
          <a className="flex md:flex-row flex-col lg:items-start md:items-center items-center md:text-left text-center md:space-x-2 md:space-y-0 space-y-2">
            <Eggo className="md:w-8 w-12 flex-shrink-0" />
            <div className="mt-1 text-lg font-semibold leading-tighter tracking-tight">
              {/* egghead.io */}
              Build your Developer Portfolio and climb the engineering career
              ladder.
            </div>
          </a>
        </Link>
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 lg:pr-6 md:gap-10 md:text-left text-center md:items-start items-center md:w-auto w-full">
        {/* <Title>Content</Title> */}
        <ul>
          {content.map((link) => (
            <Item
              onClick={() => track(`clicked ${link.label} (footer)`)}
              path={link.path}
              key={link.path}
            >
              {link.label}
            </Item>
          ))}
        </ul>
        {/* <Title>About</Title> */}
        <ul>
          {about.map((link) => (
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
    <div className="bg-gray-50">
      <footer className="max-w-screen-xl w-full mx-auto xl:px-0 px-5">
        <FooterNavigation />
        <small className="space-x-6 py-6 text-xs w-full flex items-center md:justify-end justify-center text-gray-500">
          <div>©egghead.io</div>
          <Link href="/privacy">
            <a onClick={() => track(`clicked Privacy (footer)`)}>
              Terms & Conditions
            </a>
          </Link>
        </small>
      </footer>
    </div>
  )
}

export default Footer
