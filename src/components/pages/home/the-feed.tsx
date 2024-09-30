import React from 'react'
import {TYPESENSE_COLLECTION_NAME} from '@/utils/typesense'
import {Configure, InstantSearch} from 'react-instantsearch'
import Hits from '@/components/search/hits'
import {typesenseAdapter} from '@/pages/q/[[...all]]'
import config from '@/lib/config'
import {Element as ScrollElement, scroller} from 'react-scroll'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import Pagination from '@/components/search/pagination'
import {useToggle} from 'react-use'
import PresetOptions from '@/components/search/components/preset-options'

const searchClient = typesenseAdapter.searchClient
const queryClient = new QueryClient()

const TheFeed = () => {
  const [mounted, setMounted] = React.useState<boolean>(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <div className="dark:bg-gray-1000 bg-gray-100 relative">
        <InstantSearch
          indexName={TYPESENSE_COLLECTION_NAME}
          searchClient={searchClient}
          future={{
            preserveSharedStateOnUnmount: true,
          }}
        >
          <Configure hitsPerPage={config.searchResultCount} />
          <ScrollElement name="page" />

          <div className="max-w-screen-xl mx-auto w-full">
            <div>
              <div className="flex flex-col relative gap-3">
                <main className="flex flex-col col-span-full w-full relative dark:bg-gray-900 bg-gray-50">
                  <ScrollElement name="hits" />
                  <div className="flex items-center justify-between">
                    <h2 className="sm:px-5 px-3 mt-4 lg:text-2xl sm:text-xl text-lg dark:text-white font-semibold leading-tight">
                      The Feed
                    </h2>
                    <PresetOptions classNames="bg-gray-50" />
                  </div>
                  <QueryClientProvider client={queryClient}>
                    <Hits />
                  </QueryClientProvider>
                  {mounted && (
                    <div className="pb-16 pt-10 flex-grow bg-gradient-to-t dark:from-gray-1000 dark:to-transparent from-gray-100 to-transparent">
                      <Pagination />
                    </div>
                  )}
                </main>
              </div>
            </div>
          </div>
        </InstantSearch>
      </div>
    </>
  )
}

export default TheFeed
