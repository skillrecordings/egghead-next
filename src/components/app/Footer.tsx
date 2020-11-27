import * as React from 'react'
import {FunctionComponent} from 'react'
import Link from '../Link'
import Eggo from '../images/eggo.svg'

const FooterNavigation: FunctionComponent = () => {
  return (
    <nav className="flex sm:flex-row flex-col sm:items-end items-center justify-between w-full sm:pt-10 pt-6">
      <div className="grid grid-cols-2 gap-10 leading-relaxed sm:text-base text-sm">
        <div>
          <h5 className="font-semibold tracking-wide text-xs text-gray-600 mb-2 uppercase">
            Content
          </h5>
          <ul>
            <li>
              <Link href="/s" activeClassName="underline">
                <a>Search</a>
              </Link>
            </li>
            <li>
              <Link href="/learn" activeClassName="underline">
                <a>Learn</a>
              </Link>
            </li>
            <li>
              <Link href="/talks" activeClassName="underline">
                <a>Talks</a>
              </Link>
            </li>
            <li>
              <Link href="/podcasts" activeClassName="underline">
                <a>Podcasts</a>
              </Link>
            </li>
            <li>
              <Link href="/site-directory" activeClassName="underline">
                <a>Directory</a>
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold tracking-wide text-xs text-gray-600 mb-2 uppercase">
            About
          </h5>
          <ul>
            <li>
              <Link href="/pricing" activeClassName="underline">
                <a>Pricing</a>
              </Link>
            </li>
            <li>
              <Link href="/instructors" activeClassName="underline">
                <a>Instructors</a>
              </Link>
            </li>
            <li>
              <Link href="/stories" activeClassName="underline">
                <a>Stories</a>
              </Link>
            </li>
            <li>
              <Link href="/team" activeClassName="underline">
                <a>Team</a>
              </Link>
            </li>
            <li>
              <a href="https://store.egghead.io">Store</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="h-full flex flex-col sm:items-end items-center sm:mt-0 mt-16">
        <Link href="/">
          <a>
            <Eggo className="sm:w-10 w-8" />
          </a>
        </Link>
        <div className="text-xs mt-8 w-full flex items-center sm:justify-end text-gray-600">
          <div className="pr-6">©egghead.io</div>
          <Link href="/privacy">
            <a>Terms & Conditions</a>
          </Link>
        </div>
      </div>
    </nav>
  )
}

const Footer: FunctionComponent = () => {
  return (
    <footer className="max-w-screen-3xl w-full mx-auto p-5">
      <FooterNavigation />
    </footer>
  )
}

export default Footer
