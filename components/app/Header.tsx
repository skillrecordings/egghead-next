import Link from 'next/link'

export default function Header() {
  return (
    <header className="flex px-8 mx-auto min-w-full flex-col bg-base-secondary w-full py-2">
      <div className="flex justify-between">
        <div className="flex justify-between w-1/3">
          <nav className="flex w-full">
            <ul className="flex text-white text-opacity-50 w-full justify-between">
              <li>
                <Link href="/">
                  <a>egghead.io</a>
                </Link>
              </li>
              <li>
                <Link href="/browse/frameworks">Topics</Link>
              </li>
              <li>
                <Link href="/search">Search Catalog</Link>
              </li>
            </ul>
          </nav>
        </div>
        <Link href="/login">
          <a className="text-white text-opacity-50">Sign in</a>
        </Link>
      </div>
      <div className="text-white text-sm">Search</div>
    </header>
  )
}
