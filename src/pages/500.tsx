import * as React from 'react'
import Image from 'next/legacy/image'
import Link from 'next/link'

/**
 * Custom 500 error page
 *
 * This page is displayed when a server-side error occurs, such as
 * when Typesense or other third-party services time out.
 */
const Custom500Page: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center space-y-10 md:space-y-0 md:space-x-10 px-5 py-16 min-h-[80vh]">
      <div className="max-w-sm">
        <Image
          src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1610722602/next.egghead.io/pages/broken-eggo.png"
          width={691}
          height={493}
          alt="Broken egg illustration"
        />
      </div>
      <div className="flex flex-col max-w-md">
        <h1 className="font-extrabold text-7xl md:text-9xl mb-4">500</h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Well dang, something broke on our end.
        </h2>
        <p className="mb-6 text-lg">
          Our search service is currently having a moment. This isn't your fault
          at all. We're already looking into it, but if you give us details
          about what happened, we can fix it faster.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="text-center py-3 px-5 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Go back home
          </Link>
          <a
            href="mailto:support@egghead.io?subject=Search Error Report"
            className="text-center py-3 px-5 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Report this issue
          </a>
        </div>
      </div>
    </div>
  )
}

export default Custom500Page
