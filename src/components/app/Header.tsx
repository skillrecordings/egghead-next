import {FunctionComponent} from 'react'
import Link from 'next/link'
import Eggo from '../images/eggo.svg'
import {useViewer} from 'context/viewer-context'

const Header: FunctionComponent = () => {
  const {viewer, loading} = useViewer()

  return (
    <header className="px-4 py-3 border-b border-gray-100 mb-5 flex items-center justify-between">
      <div className="flex items-center justify-between w-full">
        <Link href="/">
          <a className="flex items-center">
            <Eggo className="w-8 mr-1" />
            <span className="sm:inline-block hidden text-lg font-semibold">
              egghead.io
            </span>
          </a>
        </Link>
        <nav className="pl-5 overflow-x-auto">
          <ul className="flex sm:gap-8 gap-5 items-center">
            <li>
              <Link href="/learn">
                <a>Topics</a>
              </Link>
            </li>
            <li>
              <Link href="/s">
                <a>Search</a>
              </Link>
            </li>
            {!loading && (
              <>
                {viewer ? (
                  <li className="flex items-center justify-center">
                    <span>
                      {viewer.full_name || 'member'} {viewer.is_pro && '⭐️'}
                    </span>
                    <img className="w-8 rounded-full" src={viewer.avatar_url} />
                  </li>
                ) : (
                  <li>
                    <Link href="/login">
                      <a>Sign in</a>
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
