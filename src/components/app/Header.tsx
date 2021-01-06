import * as React from 'react'
import {FunctionComponent} from 'react'
import Link from '../Link'
import Eggo from 'components/icons/eggo'
import {useViewer} from 'context/viewer-context'
import {track} from 'utils/analytics'
import {isEmpty} from 'lodash'
import FeedbackInput from 'components/feedback-input'

const ACCOUNT_LINK_ENABLED =
  process.env.NEXT_PUBLIC_FEATURE_ACCOUNT_LINK_IN_HEADER === 'true'

const Header: FunctionComponent = () => {
  const {viewer, loading} = useViewer()
  return (
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
        {!loading && (
          <div className="text-sm">
            {viewer ? (
              <div
                onClick={() => {
                  track(`clicked user name area`, {
                    location: 'header',
                  })
                }}
                className="flex items-center justify-center space-x-2"
              >
                <FeedbackInput dark={false} />
                <span>{viewer.is_pro && ' ⭐️ '}</span>

                {ACCOUNT_LINK_ENABLED && !isEmpty(viewer.accounts) ? (
                  <div>
                    <Link href={`/accounts/${viewer.accounts[0].slug}`}>
                      <a
                        onClick={() =>
                          track('clicked account', {
                            location: 'header',
                          })
                        }
                        className="hover:text-blue-700 hover:underline"
                      >
                        <img
                          alt="avatar"
                          className="w-8 rounded-full"
                          src={viewer.avatar_url}
                        />
                      </a>
                    </Link>
                  </div>
                ) : (
                  <img
                    alt="avatar"
                    className="w-8 rounded-full"
                    src={viewer.avatar_url}
                  />
                )}
                {!isEmpty(viewer) && (
                  <div>
                    <Link href={`/bookmarks`}>
                      <a
                        onClick={() =>
                          track('clicked bookmarks', {
                            location: 'header',
                          })
                        }
                        className="hover:text-blue-700 hover:underline"
                      >
                        bookmarks
                      </a>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-row space-x-2">
                <div>
                  <Link href="/pricing" activeClassName="hidden">
                    <a
                      onClick={() =>
                        track('clicked pricing', {
                          location: 'header',
                        })
                      }
                      className="inline-flex md:w-auto w-full px-3 py-2 text-center rounded-md bg-blue-600 text-white font-semibold shadow-lg hover:bg-indigo-600 transform hover:scale-105 transition-all duration-150 ease-in-out"
                    >
                      Join egghead
                    </a>
                  </Link>
                </div>
                <Link href="/login" activeClassName="bg-gray-100">
                  <a
                    onClick={() =>
                      track('clicked sign in', {
                        location: 'header',
                      })
                    }
                    className="px-3 py-2  hover:opacity-100 hover:bg-gray-100  active:bg-gray-100 rounded-md inline-flex transition-all ease-in-out duration-300"
                  >
                    Sign in
                  </a>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
