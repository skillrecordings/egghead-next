'use client'

import React from 'react'
import {InstantSearchNext} from 'react-instantsearch-nextjs'
import {SearchBox, Configure, useInstantSearch} from 'react-instantsearch'
import {typesenseAdapter} from '@/pages/q/[[...all]]'
import {
  TYPESENSE_COLLECTION_NAME,
  typsenseAdapterConfig,
} from '@/utils/typesense'
import Hits from '@/components/pages/home/hits'
import Pagination from '@/components/search/pagination'
import PresetOptions from '@/components/search/components/preset-options'
import {usePagination} from 'react-instantsearch'
import {ErrorBoundary, FallbackProps} from 'react-error-boundary'
import {useQueryState} from 'nuqs'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

// Configure Typesense adapter for "the feed" preset
typesenseAdapter.updateConfiguration({
  ...typsenseAdapterConfig,
  additionalSearchParameters: {
    preset: 'the_feed',
  },
})

const searchClient = typesenseAdapter.searchClient

const ErrorFallback = ({error}: FallbackProps) => (
  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
    <h3 className="font-semibold text-red-800">Search Error</h3>
    <p className="text-red-600">
      {error.message || 'An error occurred while loading search'}
    </p>
    <button
      onClick={() => window.location.reload()}
      className="mt-2 rounded bg-red-100 px-4 py-2 text-red-800 hover:bg-red-200"
    >
      Try Again
    </button>
  </div>
)

function SearchWithErrorBoundary() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Search />
    </ErrorBoundary>
  )
}

export default SearchWithErrorBoundary

function ConfigureHitsPerPage() {
  const {isFirstPage} = usePagination()
  return <Configure hitsPerPage={isFirstPage ? 23 : 22} />
}

/**
 * Inner search content that triggers refresh on mount to handle client-side navigation
 */
function SearchContent() {
  const {refresh} = useInstantSearch()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    refresh()
    setMounted(true)
  }, [refresh])

  return (
    <>
      <ConfigureHitsPerPage />

      <div className="mb-6">
        <SearchBox
          placeholder="Search courses, lessons, talks..."
          classNames={{
            root: 'w-full',
            form: 'relative',
            input:
              'w-full py-4 px-5 pr-16 lg:text-lg sm:text-base text-sm rounded-lg dark:bg-gray-1000 border dark:border-gray-800 bg-white border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400',
            submit: 'absolute right-2 top-1/2 -translate-y-1/2',
            reset: 'absolute right-12 top-1/2 -translate-y-1/2',
          }}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex sm:items-end items-center justify-between">
          <h2 className="lg:text-2xl sm:text-xl text-lg dark:text-white font-semibold leading-tight">
            Search Results
          </h2>
          <PresetOptions classNames="bg-gray-100" />
        </div>

        <Hits />

        {mounted && (
          <div className="pb-16 pt-10">
            <Pagination />
          </div>
        )}
      </div>
    </>
  )
}

/**
 * Main search component with URL state synchronization via nuqs.
 */
function Search() {
  const [query, setQuery] = useQueryState('q')
  const [queryClient] = React.useState(() => new QueryClient())

  // Build initial InstantSearch state from URL parameters
  const initialUiState = {
    [TYPESENSE_COLLECTION_NAME]: {
      query: query || '',
    },
  }

  return (
    <QueryClientProvider client={queryClient}>
      <InstantSearchNext
        searchClient={searchClient}
        indexName={TYPESENSE_COLLECTION_NAME}
        routing={false}
        onStateChange={({uiState, setUiState}) => {
          const indexState = uiState[TYPESENSE_COLLECTION_NAME]

          // Sync query to URL
          setQuery(indexState?.query || null)

          setUiState(uiState)
        }}
        initialUiState={initialUiState}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        <SearchContent />
      </InstantSearchNext>
    </QueryClientProvider>
  )
}
