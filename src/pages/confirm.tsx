import * as React from 'react'
import {useRouter} from 'next/router'

const Confirm: React.FunctionComponent = () => {
  const router = useRouter()
  const email = router.query.email

  return (
    <main className="flex-grow w-full h-full py-10 text-center md:py-48 sm:py-32">
      <div className="container">
        <div className="flex flex-col items-center max-w-md mx-auto lg:max-w-screen-md">
          <NotificationIcon />
          <h1 className="pt-6 pb-2 text-xs font-semibold tracking-wide text-gray-700 uppercase sm:text-sm dark:text-gray-300">
            Email sent
          </h1>
          <h2 className="pb-2 text-lg font-semibold leading-tight sm:text-xl">
            Please check your inbox {email && `(${email})`} for your sign in
            link.
          </h2>
          <p className="max-w-md py-4 text-sm text-gray-700 dark:text-gray-300">
            Sometimes this can land in SPAM! While we hope that isn't the case
            if it doesn't arrive in a minute or three, please check.
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            If you have any trouble, you can email{' '}
            <a
              href="mailto:support@egghead.io"
              className="text-blue-600 underline dark:text-blue-400"
            >
              support@egghead.io
            </a>{' '}
            for help at any time.
          </p>
        </div>
      </div>
    </main>
  )
}

const NotificationIcon = () => {
  return (
    <svg
      aria-hidden
      width="80"
      height="80"
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        className="text-gray-400 fill-current dark:text-white"
        width="180"
        height="180"
        rx="90"
        fillOpacity="0.1"
      />
      <path
        className="text-gray-800 stroke-current dark:text-white"
        d="M48 74.1429L85.1985 98.9419C88.3656 101.053 92.4915 101.053 95.6586 98.9419L132.857 74.1429M57.4286 126H123.429C128.636 126 132.857 121.779 132.857 116.571V69.4286C132.857 64.2213 128.636 60 123.429 60H57.4286C52.2213 60 48 64.2213 48 69.4286V116.571C48 121.779 52.2213 126 57.4286 126Z"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle opacity="0.98" cx="128" cy="65" r="25" fill="#2DD4BF" />
      <path
        d="M127.344 74.75H130.803V55.0215H127.316L122.162 58.6445V61.8848L127.262 58.3848H127.344V74.75Z"
        fill="white"
      />
    </svg>
  )
}

export default Confirm
