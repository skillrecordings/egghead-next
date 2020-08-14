import Link from 'next/link'
import Eggo from '../images/eggo.svg'

export default function Header() {
  return (
    <header className="p-5 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/">
          <a className="flex items-center">
            <Eggo />
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
              <Link href="/search">
                <a>Search</a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <Link href="/login">
        <a>Sign in</a>
      </Link>
    </header>
  )
}
