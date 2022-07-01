import * as React from 'react'
import {useTheme} from 'next-themes'
import {useViewer} from 'context/viewer-context'
import CreateAccount from '../create-account'
import Join from '../join'
import Browse from '../browse'
import HeroBgLight from './hero-bg-light.png'
import HeroBgDark from './hero-bg-dark.png'
import Image from 'next/image'
import TechLogos from '../tech-logos'
import title from 'title'
import {isMember} from 'utils/is-member'
import {useRouter} from 'next/router'
import toast, {Toaster} from 'react-hot-toast'

const ProvideEmail: React.FC<{topic?: string}> = ({topic}) => (
  <>
    <CreateAccount location="homepage header" />
    <p className="max-w-sm pt-10 text-xs text-center sm:text-sm opacity-60">
      Enter your email to create an account and start learning from more than
      3,000 free {title(topic?.replace('_', ' ') ?? 'Full Stack')} lessons on
      egghead.
    </p>
  </>
)

const Header: React.FC<{topic?: string; customer?: any}> = ({
  topic,
  customer,
}) => {
  const router = useRouter()
  const {viewer} = useViewer()
  const {resolvedTheme} = useTheme()
  const [isMounted, setIsMounted] = React.useState(false)
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const userPresent = Boolean(viewer || customer)
  const userIsNonMember = userPresent && !isMember(viewer, customer)

  let Offer

  switch (true) {
    case userIsNonMember:
      Offer = Join
      break
    case userPresent:
      Offer = Browse
      break
    default:
      Offer = ProvideEmail
  }

  React.useEffect(() => {
    const {query} = router
    if (query.message) {
      toast(query.message as string, {
        icon: '✅',
      })
    }
  }, [router])

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
          <h1 className="text-2xl font-bold text-center lg:text-4xl sm:text-3xl leading-tighter sm:max-w-[22ch] tracking-tight">
            Concise {title(topic?.replace('_', ' ') ?? 'Full Stack')} Courses
            for Busy Web Developers
          </h1>
          <h2 className="pt-3 pb-10 text-center text-blue-500 dark:text-amber-400 lg:text-lg sm:text-base text-sm leading-tight">
            high-quality video tutorials and curated learning resources with
            zero cruft
          </h2>
          <Offer topic={topic} />
        </div>
        <div className="sm:absolute bottom-10">
          <TechLogos />
        </div>
      </div>
    </header>
  )
}

export default Header
