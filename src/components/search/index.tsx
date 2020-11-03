import React, {FunctionComponent} from 'react'
import {motion, AnimateSharedLayout} from 'framer-motion'
import Head from 'next/head'
import Hits from './hits'
import SearchBox from './search-box'
import RefinementList from './refinement-list'
import Pagination from './pagination'
import {
  Configure,
  InstantSearch,
  ClearRefinements,
} from 'react-instantsearch-dom'
import {get, isEqual, isEmpty} from 'lodash'
import {useToggle} from 'react-use'

import config from 'lib/config'

import SearchReact from './curated/react'

type SearchProps = {
  searchClient: any
  indexName: string
  searchState: any
}

const Search: FunctionComponent<SearchProps> = ({
  children = [],
  searchClient,
  indexName,
  searchState,

  ...rest
}) => {
  const [isFilterShown, setShowFilter] = useToggle(false)
  const noInstructorsSelected = (searchState: any) => {
    return get(searchState, 'refinementList.instructor_name', []).length === 0
  }

  const noTagsSelected = (searchState: any) => {
    return get(searchState, 'refinementList._tags', []).length === 0
  }

  const onlyTheseTagsSelected = (tags: string[], searchState: any) => {
    const selectedTags = get(
      searchState,
      'refinementList._tags',
      [],
    ) as string[]
    return isEqual(tags, selectedTags)
  }

  const onlyTheseInstructorsSelected = (
    instructors: string[],
    searchState: any,
  ) => {
    const selectedTags = get(
      searchState,
      'refinementList.instructor_name',
      [],
    ) as string[]
    return isEqual(instructors, selectedTags)
  }

  const isRefinementOn =
    !isEmpty(get(searchState, 'refinementList.instructor_name')) ||
    !isEmpty(get(searchState, 'refinementList._tags')) ||
    !isEmpty(get(searchState, 'refinementList.type'))

  const numberOfRefinements =
    get(searchState, 'refinementList.instructor_name', []).length +
    get(searchState, 'refinementList._tags', []).length +
    get(searchState, 'refinementList.type', []).length

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/instantsearch.css@7.3.1/themes/algolia-min.css"
        />
      </Head>
      <InstantSearch
        indexName={indexName}
        searchClient={searchClient}
        searchState={searchState}
        {...rest}
      >
        <Configure hitsPerPage={config.searchResultCount} />
        <div className="max-w-screen-lg mx-auto">
          <header className="flex ">
            <SearchBox className="w-full" />
            <button
              onClick={setShowFilter}
              className={`ml-2 flex items-center sm:px-5 px-3 py-2 rounded-md border-2 ${
                isRefinementOn ? 'border-blue-500' : 'border-transparent'
              } focus:border-blue-300 focus:outline-none`}
            >
              <span className="sm:block hidden">Filter</span>
              {numberOfRefinements > 0 ? (
                <div className="-mr-1 w-6 h-6 transform scale-75 flex items-center justify-center bg-blue-600 rounded-full text-white text-xs font-bold">
                  {numberOfRefinements}
                </div>
              ) : (
                <>
                  {isFilterShown ? (
                    // prettier-ignore
                    <svg className="sm:ml-1" width="14" height="14" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><g fill="none" ><path fillRule="evenodd" clipRule="evenodd" d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414z" fill="currentColor"/></g></svg>
                  ) : (
                    // prettier-ignore
                    <svg className="sm:ml-1" xmlns="http://www.w3.org/2000/svg" width="14" height="12" viewBox="0 0 14 12"><g fill="none" fillRule="evenodd" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" transform="translate(1 1)"><line x1="3.5" x2="3.5" y1="5"/><line x1=".5" x2="3.5" y1="2.5" y2="2.5"/><line x1="5.5" x2="11.5" y1="2.5" y2="2.5"/><line x1="8.5" x2="8.5" y1="10" y2="5"/><line x1="11.5" x2="8.5" y1="7.5" y2="7.5"/><line x1="6.5" x2=".5" y1="7.5" y2="7.5"/></g></svg>
                  )}
                </>
              )}
            </button>
          </header>
          <AnimateSharedLayout>
            <motion.div
              layout
              className={`overflow-hidden rounded-md border border-transparent shadow-lg ${
                isFilterShown
                  ? 'h-auto border-gray-200 my-2'
                  : 'h-0 border-transparent my-0'
              }`}
            >
              <motion.div
                layout
                className={`${
                  isFilterShown ? 'top-full ' : 'top-0'
                } sm:p-8 p-5 grid sm:grid-cols-3 grid-cols-1 sm:gap-8 gap-5  relative`}
              >
                <div>
                  <h3 className="font-semibold mb-1">Topics</h3>
                  <RefinementList limit={6} attribute="_tags" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Instructors</h3>
                  <RefinementList limit={6} attribute="instructor_name" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Content Type</h3>
                  <RefinementList attribute="type" />
                </div>
                <div className="absolute top-0 right-0 mr-3 mt-3">
                  <ClearRefinements />
                </div>
              </motion.div>
            </motion.div>
            <motion.div layout>
              {onlyTheseInstructorsSelected(['Kent C. Dodds'], searchState) &&
                noTagsSelected(searchState) && <div>Learn from Kent</div>}

              {onlyTheseInstructorsSelected(['Kent C. Dodds'], searchState) &&
                onlyTheseTagsSelected(['react'], searchState) && (
                  <div>Learn React from Kent</div>
                )}

              {noInstructorsSelected(searchState) &&
                onlyTheseTagsSelected(['react'], searchState) && (
                  <SearchReact></SearchReact>
                )}
            </motion.div>
            <motion.div layout className="mt-6">
              <Hits />
            </motion.div>
            <motion.div
              layout
              className="w-full flex items-center justify-between mt-8 mb-4 overflow-x-auto"
            >
              <Pagination />
            </motion.div>
          </AnimateSharedLayout>
        </div>
        {children}
      </InstantSearch>
    </>
  )
}

export default Search
