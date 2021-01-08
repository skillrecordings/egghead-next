import * as React from 'react'
import {FunctionComponent} from 'react'
import Link from '../link'
import Eggo from 'components/icons/eggo'
import {useViewer} from 'context/viewer-context'
import {track} from 'utils/analytics'
import {isEmpty} from 'lodash'
import Feedback from 'components/feedback-input'
import useBreakpoint from 'utils/breakpoints'

const ACCOUNT_LINK_ENABLED =
  process.env.NEXT_PUBLIC_FEATURE_ACCOUNT_LINK_IN_HEADER === 'true'

const Header: FunctionComponent = () => {
  const {viewer, loading} = useViewer()
  const {sm} = useBreakpoint()
  const [isOpen, setOpen] = React.useState<boolean>(false)
  React.useEffect(() => {
    !sm && setOpen(sm)
  }, [sm])

  const Navigation: FunctionComponent<{
    className?: string
    children?: React.ReactElement
  }> = ({
    className = 'flex items-center justify-center space-x-1',
    children,
  }) => {
    return !loading ? (
      <div className={`text-sm`}>
        {viewer ? (
          <div className={className}>
            <Feedback
              user={viewer}
              className="px-3 py-2 hover:bg-gray-100 active:bg-gray-200 rounded-md inline-flex transition-all ease-in-out duration-300 leading-tight"
            >
              Feedback
            </Feedback>
            {!isEmpty(viewer) && (
              <Link href={`/bookmarks`}>
                <a
                  onClick={() =>
                    track('clicked bookmarks', {
                      location: 'header',
                    })
                  }
                  className="px-3 py-2 hover:bg-gray-100 active:bg-gray-200 rounded-md inline-flex transition-all ease-in-out duration-300 leading-tight"
                >
                  Bookmarks
                </a>
              </Link>
            )}
            {ACCOUNT_LINK_ENABLED && !isEmpty(viewer.accounts) ? (
              <Link href={`/accounts/${viewer.accounts[0].slug}`}>
                <a
                  onClick={() =>
                    track('clicked account', {
                      location: 'header',
                    })
                  }
                  className="flex items-center space-x-2 pl-3 hover:text-blue-700 hover:underline"
                >
                  <img
                    alt="avatar"
                    className="w-8 rounded-full"
                    src={viewer.avatar_url}
                  />
                  <span>
                    {viewer.name}
                    {viewer.is_pro && ' ⭐️'}
                  </span>
                </a>
              </Link>
            ) : (
              <div
                className="flex items-center space-x-2 pl-3"
                onClick={() => {
                  track(`clicked user name area`, {
                    location: 'header',
                  })
                }}
              >
                <img
                  alt="avatar"
                  className="w-8 rounded-full"
                  src={viewer.avatar_url}
                />
                <span>
                  {viewer.name}
                  {viewer.is_pro && ' ⭐️'}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className={className}>
            <Link href="/pricing" activeClassName="hidden">
              <a
                onClick={() =>
                  track('clicked pricing', {
                    location: 'header',
                  })
                }
                className="inline-flex px-3 py-2 text-center rounded-md bg-blue-600 text-white font-semibold shadow-lg hover:bg-indigo-600 transform hover:scale-105 transition-all duration-150 ease-in-out"
              >
                Join egghead
              </a>
            </Link>
            <Link href="/login" activeClassName="bg-gray-100">
              <a
                onClick={() =>
                  track('clicked sign in', {
                    location: 'header',
                  })
                }
                className="px-3 py-2 hover:opacity-100 hover:bg-gray-100  active:bg-gray-100 rounded-md inline-flex transition-all ease-in-out duration-300"
              >
                Sign in
              </a>
            </Link>
          </div>
        )}
        {children}
      </div>
    ) : null
  }

  return (
    <>
      <header className="px-5 py-3 sm:mb-5 mb-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center">
                <Eggo className="w-8 mr-1" />
                <span className="sm:inline-block hidden text-lg font-semibold">
                  egghead.io
                </span>
              </a>
            </Link>
            {!loading && (
              <nav className="sm:pl-5 pl-0 text-sm font-medium">
                <ul className="flex items-center space-x-1">
                  <li className="">
                    <Link href="/q" activeClassName="bg-gray-100">
                      <a
                        className="px-3 py-2 hover:bg-gray-100 active:bg-gray-200 rounded-md inline-flex transition-all ease-in-out duration-300 leading-tight"
                        onClick={() =>
                          track('clicked learning resources', {
                            location: 'header',
                          })
                        }
                      >
                        Search Learning Resources
                      </a>
                    </Link>
                  </li>
                </ul>
              </nav>
            )}
          </div>
          {!sm && <Navigation />}
          {sm && (
            <>
              <button
                onClick={() => setOpen(!isOpen)}
                aria-labelledby="menubutton"
                aria-expanded={isOpen}
                className="p-1 -mr-2"
              >
                {isOpen ? <IconX /> : <IconMenu />}
              </button>
            </>
          )}
        </div>
      </header>
      {isOpen && (
        <Navigation className="flex flex-col items-start bg-white p-3 w-full space-y-2 absolute top-14 z-10 shadow-xl" />
      )}
    </>
  )
}

export default Header

const IconMenu = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none">
      <path
        d="M4 6h16M4 12h16M4 18h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
)

const IconX = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none">
      <path
        d="M6 18L18 6M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
)
