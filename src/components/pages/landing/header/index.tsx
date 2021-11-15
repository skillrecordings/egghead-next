import * as React from 'react'
import {useTheme} from 'next-themes'
import {useViewer} from 'context/viewer-context'
import CreateAccount from '../create-account'
import Join from '../join'
import HeroBgLight from './hero-bg-light.png'
import HeroBgDark from './hero-bg-dark.png'
import Image from 'next/image'
import TechLogos from '../tech-logos'

const Header = () => {
  const {viewer} = useViewer()
  const {resolvedTheme} = useTheme()
  const [isMounted, setIsMounted] = React.useState(false)
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <header>
      <div className="sm:min-h-[90vh] relative w-full flex flex-col items-center justify-center sm:py-32 py-24 px-5">
        {isMounted && (
          <Image
            src={resolvedTheme === 'dark' ? HeroBgDark : HeroBgLight}
            alt=""
            aria-hidden
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            className="pointer-events-none"
            placeholder="blur"
            loading="eager"
            priority
          />
        )}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t dark:from-gray-900 dark:to-transparentDark from-white to-transparentLight"
        />
        <div className="relative z-10 flex flex-col items-center justify-center max-w-screen-lg pb-8">
          <h1 className="text-2xl font-semibold text-center lg:text-4xl sm:text-3xl leading-tighter sm:max-w-[22ch]">
            Concise Programming Courses for Busy Web Developers
          </h1>
          <h2 className="pt-3 pb-10 text-center text-blue-500 dark:text-amber-400 lg:text-lg sm:text-base text-sm leading-tight">
            high-quality video tutorials and curated learning resources without
            any cruft
          </h2>
          {viewer ? (
            <Join />
          ) : (
            <>
              <CreateAccount location="homepage header" />
              <p className="max-w-sm pt-10 text-xs text-center sm:text-sm opacity-60">
                Enter your email to create an account and start learning from
                more than 3,000 free lessons on egghead.
              </p>
            </>
          )}
        </div>
        <div className="sm:absolute bottom-10">
          <TechLogos />
        </div>
      </div>
    </header>
  )
}

export default Header
