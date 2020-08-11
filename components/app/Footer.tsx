import Link from 'next/link'

function Nav() {
  return (
    <nav className="flex gap-8">
      <div>
        <h5 className="font-bold">Content</h5>
        <ul>
          <li>
            <Link href="/browse">
              <a>Browse</a>
            </Link>
          </li>
          <li>
            <Link href="/courses">
              <a>Courses</a>
            </Link>
          </li>
          <li>
            <Link href="/lessons">
              <a>Lessons</a>
            </Link>
          </li>
          <li>
            <Link href="/podcasts">
              <a>Podcasts</a>
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <h5 className="font-bold">About</h5>
        <ul>
          <li>
            <Link href="/pricing">
              <a>Pricing</a>
            </Link>
          </li>
          <li>
            <Link href="/instructors">
              <a>Instructors</a>
            </Link>
          </li>
          <li>
            <Link href="/stories">
              <a>Stories</a>
            </Link>
          </li>
          <li>
            <Link href="/team">
              <a>Team</a>
            </Link>
          </li>
          <li>
            <a href="https://store.egghead.io">Store</a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default function Footer() {
  return (
    <footer className="max-w-screen-lg w-full mx-auto sm:p-8 p-5">
      <Nav />
      <div className="mt-8 w-full flex items-center justify-between">
        <Link href="/terms">
          <a>Terms & Conditions</a>
        </Link>
        <small>©egghead.io</small>
      </div>
    </footer>
  )
}
