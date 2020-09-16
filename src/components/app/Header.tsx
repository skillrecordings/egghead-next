import {FunctionComponent} from 'react'
import Link from 'next/link'
import Eggo from '../images/eggo.svg'
import {useViewer} from 'context/viewer-context'

const Header: FunctionComponent = () => {
  const {viewer, loading} = useViewer()

  return (
    <header className="p-5 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/">
          <a className="flex items-center">
            <Eggo className="w-10 mr-1" />
            <span className="text-xl font-semibold">egghead.io</span>
          </a>
        </Link>
        <nav className="ml-8">
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
          </ul>
        </nav>
      </div>
      {!loading && (
        <>
          {viewer ? (
            <div className="flex space-x-4 justify-center items-center">
              <div>
                {viewer.full_name || 'member'} {viewer.is_pro && '⭐️'}
              </div>
              <img className="w-8 rounded-full" src={viewer.avatar_url} />
            </div>
          ) : (
            <Link href="/login">
              <a>Sign in</a>
            </Link>
          )}
        </>
      )}
    </header>
  )
}

export default Header
