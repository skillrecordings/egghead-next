'use client'

import React from 'react'
import {
  TYPESENSE_COLLECTION_NAME,
  typsenseAdapterConfig,
  typesenseInstantsearchAdapter,
} from '@/utils/typesense'
import {Configure, InstantSearch} from 'react-instantsearch'
import {Element as ScrollElement} from 'react-scroll'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import Pagination from '@/components/search/pagination'
import {usePagination} from 'react-instantsearch'
import CompactHits from './compact-hits'

// Create dedicated adapter for compact feed with feed-specific config
const compactFeedAdapter = typesenseInstantsearchAdapter()
compactFeedAdapter.updateConfiguration({
  ...typsenseAdapterConfig,
  additionalSearchParameters: {
    // Show all content with basic query configuration
    query_by: 'title,name,description,summary',
    // Sort by published timestamp (latest first), then by text match
    sort_by: 'published_at_timestamp:desc',
    // Include all results
    per_page: 25,
  },
})
const searchClient = compactFeedAdapter.searchClient
const queryClient = new QueryClient()

function ConfigureHitsPerPage() {
  const {isFirstPage} = usePagination()

  // Show more items in compact view (no filtering)
  return <Configure hitsPerPage={isFirstPage ? 25 : 25} />
}

const CompactFeed = () => {
  const [mounted, setMounted] = React.useState<boolean>(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="dark:bg-gray-900 bg-gray-50 relative">
      <InstantSearch
        indexName={TYPESENSE_COLLECTION_NAME}
        searchClient={searchClient}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        <Configure query="" />
        <ConfigureHitsPerPage />
        <ScrollElement name="page" />

        <div className="max-w-screen-xl mx-auto w-full">
          <div className="flex flex-col relative gap-3">
            <main className="flex flex-col col-span-full w-full relative dark:bg-gray-900 bg-gray-50">
              <ScrollElement name="hits" />
              <QueryClientProvider client={queryClient}>
                <CompactHits />
              </QueryClientProvider>
              {mounted && (
                <div className="pb-16 pt-10 flex-grow">
                  <Pagination />
                </div>
              )}
            </main>
          </div>
        </div>
      </InstantSearch>
    </div>
  )
}

export default CompactFeed
