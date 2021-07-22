import * as React from 'react'
import {FunctionComponent} from 'react'
import Image from 'next/image'
import Link from 'next/link'

type HeaderProps = {
  heading?: string
  subheading?: string
  primaryCta?: {
    label?: string
    url?: string
  }
  secondaryCta?: {
    label?: string
    url?: string
  }
}

const Header: FunctionComponent<HeaderProps> = ({
  heading = `Craft your developer portfolio and get a better job in 2021`,
  subheading = `learn modern frameworks, libraries, and tools to build real-world projects and improve your public body of work to shine as a professional web developer`,
  primaryCta = {label: 'Create an account', url: '/login'},
  secondaryCta = {label: 'Learn more', url: '/about'},
}) => {
  return (
    <header className="md:px-16 px-8 md:py-24 py-16 md:-mt-5 md:rounded-b-lg md:rounded-t-none rounded-lg bg-gray-900 text-white relative overflow-hidden">
      <div className="relative z-10">
        <div className="text-center space-y-5 max-w-2xl mx-auto">
          <h1 className="md:text-3xl text-2xl font-extrabold leading-tighter tracking-tight">
            {heading}
          </h1>
          <h2 className="md:text-xl text-lg font-light leading-tight">
            {subheading}
          </h2>
        </div>
        {primaryCta || secondaryCta ? (
          <div className="pt-10 flex md:flex-row flex-col md:space-y-0 space-y-4 items-center justify-center space-x-2">
            {primaryCta.url && (
              <Link href={primaryCta.url}>
                <a className="md:w-auto w-full px-5 py-3 text-center rounded-md bg-blue-600 text-white font-semibold shadow-lg hover:bg-indigo-600 hover:scale-105 transition-all duration-150 ease-in-out">
                  {primaryCta.label}
                </a>
              </Link>
            )}
            {secondaryCta.url && (
              <Link href={secondaryCta.url}>
                <a className="md:w-auto w-full px-5 py-3 text-center rounded-md bg-white text-black bg-opacity-100 hover:bg-opacity-100 font-semibold shadow-lg hover:bg-blue-50 hover:scale-105 transition-all duration-150 ease-in-out">
                  {secondaryCta.label}
                </a>
              </Link>
            )}
          </div>
        ) : null}
      </div>
      <Image
        src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1608137337/next.egghead.io/pages/home/header_2x.png"
        layout="fill"
        priority={true}
        quality={100}
        objectFit="cover"
        className="absolute left-0 top-0 z-0"
        alt=""
      />
    </header>
  )
}

export default Header
