import React, {FunctionComponent} from 'react'
import Head from 'next/head'
import Hits from './hits'
import Stats from './stats'
import SearchBox from './search-box'
import RefinementList from './refinement-list'
import Pagination from './pagination'
import {
  Configure,
  InstantSearch,
  ClearRefinements,
  ScrollTo,
  SortBy,
} from 'react-instantsearch-dom'

import {get, isEqual, isEmpty, first} from 'lodash'
import {useToggle, useClickAway} from 'react-use'

import config from 'lib/config'

import InstructorsIndex from 'components/search/instructors/index'
import NoSearchResults from 'components/search/components/no-search-results'

import SearchCuratedEssential from './curated/curated-essential'
import SearchInstructorEssential from './instructors/instructor-essential'
import CuratedTopicsIndex from './curated'
import {searchQueryToArray} from '../../utils/search/topic-extractor'
import useBreakpoint from '../../utils/breakpoints'

const ALGOLIA_INDEX_NAME =
  process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'content_production'

type SearchProps = {
  searchClient?: any
  searchState?: any
  instructor?: any
  topic?: any
}

const Search: FunctionComponent<SearchProps> = ({
  children = [],
  searchClient,
  searchState,
  instructor,
  topic,
  ...rest
}) => {
  const [isFilterShown, setShowFilter] = useToggle(false)

  const {sm} = useBreakpoint()

  const noInstructorsSelected = (searchState: any) => {
    return get(searchState, 'refinementList.instructor_name', []).length === 0
  }

  const noTopicsSelected = (searchState: any) => {
    return (
      isEmpty(topic) &&
      get(searchState, 'refinementList._tags', []).length === 0
    )
  }

  const isRefinementOn =
    !isEmpty(get(searchState, 'refinementList.instructor_name')) ||
    !isEmpty(get(searchState, 'refinementList._tags')) ||
    !isEmpty(get(searchState, 'refinementList.access_state')) ||
    !isEmpty(get(searchState, 'refinementList.type'))

  const numberOfRefinements =
    get(searchState, 'refinementList.instructor_name', []).length +
    get(searchState, 'refinementList._tags', []).length +
    get(searchState, 'refinementList.access_state', []).length +
    get(searchState, 'refinementList.type', []).length

  const refinementRef = React.useRef(null)
  useClickAway(refinementRef, () => setShowFilter(false))

  const searchBoxPlaceholder = !isEmpty(instructor)
    ? `Search resources by ${instructor.full_name}`
    : undefined

  const shouldDisplayLandingPageForTopics = (topic: string) => {
    const terms = searchQueryToArray(searchState)

    return (
      (isEmpty(searchState.query) ||
        (terms.includes(topic) && terms.length === 1)) &&
      isEmpty(searchState.page) &&
      noInstructorsSelected(searchState)
    )
  }

  const shouldDisplayLandingPageForInstructor = (slug: string) => {
    return (
      isEmpty(searchState.query) &&
      isEmpty(searchState.page) &&
      noTopicsSelected(searchState)
    )
  }

  const InstructorCuratedPage =
    instructor &&
    (InstructorsIndex[instructor.slug] || SearchInstructorEssential)
  const CuratedTopicPage =
    topic && (CuratedTopicsIndex[topic.name] || SearchCuratedEssential)

  return (
    <div className="max-w-screen-xl mx-auto">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/instantsearch.css@7.3.1/themes/algolia-min.css"
        />
      </Head>

      <InstantSearch
        indexName={ALGOLIA_INDEX_NAME}
        searchClient={searchClient}
        searchState={searchState}
        {...rest}
      >
        <Configure hitsPerPage={config.searchResultCount} />
        <div className="space-y-8 bg-gray-50 dark:bg-gray-900">
          <div ref={refinementRef}>
            <header className="flex">
              <SearchBox
                placeholder={searchBoxPlaceholder}
                className="w-full "
              />
              {sm && (
                <button
                  onClick={setShowFilter}
                  className={`ml-2 flex items-center sm:px-5 px-3 py-2 rounded-md border-2 ${
                    isRefinementOn ? 'border-blue-400' : 'border-transparent'
                  } focus:border-blue-600 focus:outline-none`}
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
              )}
            </header>
            {sm && (
              <div
                className={`overflow-hidden rounded-md bg-white dark:bg-gray-800 border border-transparent shadow-lg ${
                  isFilterShown
                    ? 'h-auto border-gray-200 dark:border-gray-700 my-2'
                    : 'h-0 border-none my-0'
                }`}
              >
                <div
                  className={`${
                    isFilterShown ? 'top-full ' : 'top-0'
                  } sm:p-8 p-5 grid sm:grid-cols-3 grid-cols-1 sm:gap-8 gap-5 relative`}
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
                    <div>
                      <h3 className="font-semibold mb-1">Content Type</h3>
                      <RefinementList attribute="type" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Free or Pro</h3>
                      <RefinementList attribute="access_state" />
                    </div>
                  </div>
                  {isRefinementOn && (
                    <button
                      className="absolute top-0 right-0 mr-3 mt-3 text-blue-600 dark:text-blue-300"
                      onClick={setShowFilter}
                    >
                      <ClearRefinements />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          {!isEmpty(instructor) && (
            <div className="mb-10 pb-8">
              {shouldDisplayLandingPageForInstructor(instructor.slug) && (
                <InstructorCuratedPage instructor={instructor} />
              )}
            </div>
          )}

          {!isEmpty(topic) && (
            <div className="dark:bg-gray-900 bg-gray-50  md:-mt-5">
              {CuratedTopicPage &&
                shouldDisplayLandingPageForTopics(topic.name) && (
                  <CuratedTopicPage topic={topic} />
                )}
            </div>
          )}

          <div className="dark:bg-gray-900 bg-gray-50  md:-mt-5">
            <ScrollTo scrollOn="page" />

            <div className="flex flex-col-reverse md:flex-row justify-between items-center pb-4 md:pb-2 mb-4 md:mb-6 border-b border-gray-200 dark:border-gray-700">
              <Stats searchQuery={searchState.query} />
              <div className="flex space-x-2 items-center flex-nowrap flex-shrink-0 md:ml-6">
                <div className="font-bold whitespace-nowrap flex-shrink-0">
                  Sort by:
                </div>
                <SortBy
                  defaultRefinement="popular"
                  items={[
                    {
                      value: 'popular',
                      label: 'Most Popular',
                    },
                    {value: 'reviews', label: 'Highest Rated'},
                    {value: 'created', label: 'Recently Added'},
                    {value: 'completed', label: 'Most Watched'},
                  ]}
                />
              </div>
            </div>
            <div className="flex mb-10 pb-10">
              <div className="flex-shrink-0">
                {!sm && (
                  <div className="pl-0 pt-0 p-10 flex flex-col space-y-6">
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
                    <div>
                      <h3 className="font-semibold mb-1">Free or Pro</h3>
                      <RefinementList attribute="access_state" />
                    </div>
                  </div>
                )}
              </div>
              <div
                key="search-results"
                className="col-span-4 sm:col-span-3 w-full"
              >
                <NoSearchResults searchQuery={searchState.query} />
                <Hits />
              </div>
            </div>
          </div>
          <div className="max-w-screen-xl mx-auto w-full flex items-center justify-center mt-8 mb-4 overflow-x-auto">
            <Pagination />
          </div>
          {children}
        </div>
      </InstantSearch>
    </div>
  )
}

export default Search
