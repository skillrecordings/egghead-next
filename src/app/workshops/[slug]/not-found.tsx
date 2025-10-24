import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center px-4">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          Workshop Not Found
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          The workshop you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/workshops"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          View Available Workshops
        </Link>
      </div>
    </div>
  )
}
