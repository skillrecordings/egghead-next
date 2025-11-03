import Search from './_components/search'
import type {Metadata} from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Typesense Test - App Router',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function TypesenseTestPage() {
  return (
    <div className="max-w-screen-xl mx-auto w-full p-5">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 dark:text-white">
          Typesense Test Page (App Router)
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Testing InstantSearch with Typesense adapter
        </p>
      </div>
      <Search />
    </div>
  )
}
