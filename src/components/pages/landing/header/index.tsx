import * as React from 'react'
import {useTheme} from 'next-themes'
import CreateAccount from '../create-account'
import HeroBgLight from './hero-bg-light.png'
import HeroBgDark from './hero-bg-dark.png'
import Image from 'next/image'
import TechLogos from '../tech-logos'

const Header = () => {
  const {resolvedTheme} = useTheme()
  const [isMounted, setIsMounted] = React.useState(false)
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <header className="-mt-5 -mx-5">
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
          className="h-64 bg-gradient-to-t dark:from-gray-900 dark:to-transparentDark from-white to-transparentLight w-full absolute bottom-0 left-0"
        />
        <div className="flex flex-col items-center justify-center max-w-screen-lg relative z-10 pb-8">
          <h1 className="font-semibold lg:text-4xl sm:text-3xl text-2xl leading-tighter text-center lg:max-w-none md:max-w-screen-md">
            Learn the best JavaScript tools and frameworks from industry
            professionals
          </h1>
          <h2 className="text-blue-500 dark:text-amber-400 pt-3 pb-10 sm:text-lg text-center">
            high-quality video tutorials and learning resources for badass web
            developers
          </h2>
          <CreateAccount location="homepage header" />
          <p className="sm:text-sm text-xs opacity-60 max-w-sm text-center pt-10">
            Enter your email to create an account and start learning from more
            than 3,000 free lessons on egghead.
          </p>
        </div>
        <div className="sm:absolute bottom-10">
          <TechLogos />
        </div>
      </div>
    </header>
  )
}

export default Header
