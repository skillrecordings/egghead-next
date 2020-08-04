import Link from 'next/link'

function Content() {
  return (
    <section>
      <h2 className="uppercase text-sm font-semibold text-white text-opacity-75">
        Content
      </h2>
      <ul className="text-sm text-white text-opacity-50">
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
    </section>
  )
}
function About() {
  return (
    <section>
      <h3 className="uppercase text-sm font-semibold text-white text-opacity-75">
        About
      </h3>
      <ul className="text-sm text-white text-opacity-50">
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
          <Link href="/Store">
            <a>Store</a>
          </Link>
        </li>
      </ul>
    </section>
  )
}

function SearchFooter() {
  return (
    <div>
      <h2 className="text-base text-white text-opacity-75">
        Search for Lessons and Courses
      </h2>
      {/* Todo - Searchbox */}
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="center px-6 py-4 bg-base-secondary font-sans">
      <div className="flex justify-between">
        <div className="flex justify-between w-40">
          <Content></Content>
          <About></About>
        </div>
        <div>
          <SearchFooter></SearchFooter>
        </div>
      </div>
      <div className="text-sm pt-3 text-white text-opacity-50 font-light">
        <Link href="/terms">
          <a>Terms & Conditions</a>
        </Link>
        <span className="ml-4">©egghead.io</span>
      </div>
    </footer>
  )
}
