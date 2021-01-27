import React, {FunctionComponent} from 'react'
import {motion, AnimateSharedLayout, AnimatePresence} from 'framer-motion'
import Head from 'next/head'
import Hits from './hits'
import SearchBox from './search-box'
import RefinementList from './refinement-list'
import Pagination from './pagination'
import {
  Configure,
  InstantSearch,
  ClearRefinements,
  ScrollTo,
} from 'react-instantsearch-dom'
import {get, isEqual, isEmpty} from 'lodash'
import {useToggle, useClickAway} from 'react-use'
import Image from 'next/image'
import {useRouter} from 'next/router'

import config from 'lib/config'

import SearchReact from 'components/search/curated/react'
import ReactMarkdown from 'react-markdown'
import {NextSeo} from 'next-seo'
import {isArray} from 'lodash'
import Topic from './components/topic'
import GenericTopic from './generic-topic'

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
  const noInstructorsSelected = (searchState: any) => {
    return get(searchState, 'refinementList.instructor_name', []).length === 0
  }

  const onlyTheseTagsSelected = (tags: string[], searchState: any) => {
    const selectedTags = get(
      searchState,
      'refinementList._tags',
      [],
    ) as string[]
    return isEqual(tags, selectedTags)
  }

  const isRefinementOn =
    !isEmpty(get(searchState, 'refinementList.instructor_name')) ||
    !isEmpty(get(searchState, 'refinementList._tags')) ||
    !isEmpty(get(searchState, 'refinementList.type'))

  const numberOfRefinements =
    get(searchState, 'refinementList.instructor_name', []).length +
    get(searchState, 'refinementList._tags', []).length +
    get(searchState, 'refinementList.type', []).length

  const refinementRef = React.useRef(null)
  useClickAway(refinementRef, () => setShowFilter(false))

  const router = useRouter()

  React.useEffect(() => {
    setShowFilter(false)
  }, [router, setShowFilter])

  const searchBoxPlaceholder = !isEmpty(instructor)
    ? `Search resources by ${instructor.full_name}`
    : undefined

  const shouldDisplayLandingPageForTopics = (topics: string | string[]) => {
    return (
      numberOfRefinements === 1 &&
      noInstructorsSelected(searchState) &&
      onlyTheseTagsSelected(isArray(topics) ? topics : [topics], searchState)
    )
  }

  return (
    <>
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
        <ScrollTo scrollOn="page" />
        <AnimateSharedLayout>
          <motion.div layout className="sm:pb-16 pb-8 md:-mt-4 -mt-2 mx-auto">
            <AnimatePresence>
              {!isEmpty(instructor) && (
                <motion.div
                  layout
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                  exit={{opacity: 0}}
                  className="max-w-screen-xl mx-auto md:p-16 p-0 md:pt-16 pt-5 flex md:flex-row flex-col md:space-y-0 space-y-2 justify-center"
                >
                  <NextSeo
                    title={`Learn web development from ${instructor.full_name} on egghead`}
                    twitter={{
                      handle: instructor.twitter,
                      site: `@eggheadio`,
                      cardType: 'summary_large_image',
                    }}
                    openGraph={{
                      title: `Learn web development from ${instructor.full_name} on egghead`,
                      images: [
                        {
                          url: `http://og-image-react-egghead.now.sh/instructor/${instructor.slug}?v=20201103`,
                        },
                      ],
                    }}
                  />
                  <div className="flex items-center md:justify-center justify-start flex-shrink-0">
                    <Image
                      className="rounded-full"
                      width={128}
                      height={128}
                      layout="intrinsic"
                      src={instructor.avatar_url}
                    />
                  </div>
                  <div className="md:pl-8">
                    <h1 className="text-2xl font-bold">
                      {instructor.full_name}
                    </h1>
                    <ReactMarkdown className="prose dark:prose-dark mt-0">
                      {instructor.bio_short}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {shouldDisplayLandingPageForTopics('react') && (
                <motion.div
                  layout
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                  exit={{opacity: 0}}
                  className="dark:bg-gray-900 bg-gray-50 -mx-5 md:-mt-5"
                >
                  <SearchReact />
                </motion.div>
              )}
              {topic && topic.slug !== 'react' && (
                <GenericTopic
                  title={topic.label}
                  imageUrl={topic.image_480_url}
                  description={topic.description}
                />
              )}
            </AnimatePresence>
            <motion.div
              className="max-w-screen-xl mx-auto"
              layout
              ref={refinementRef}
            >
              <motion.header layout className="flex mt-4">
                <SearchBox
                  placeholder={searchBoxPlaceholder}
                  className="w-full "
                />
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
              </motion.header>
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
                    <RefinementList
                      isShown={isFilterShown}
                      limit={6}
                      attribute="_tags"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Instructors</h3>
                    <RefinementList
                      isShown={isFilterShown}
                      limit={6}
                      attribute="instructor_name"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Content Type</h3>
                    <RefinementList isShown={isFilterShown} attribute="type" />
                  </div>
                  {isRefinementOn && (
                    <button
                      className="absolute top-0 right-0 mr-3 mt-3"
                      onClick={setShowFilter}
                    >
                      <ClearRefinements />
                    </button>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div layout className="mt-4 max-w-screen-xl mx-auto">
              <Hits />
            </motion.div>
            <motion.div
              layout
              className="max-w-screen-xl mx-auto w-full flex items-center justify-between mt-8 mb-4 overflow-x-auto"
            >
              <Pagination />
            </motion.div>
            {children}
          </motion.div>
        </AnimateSharedLayout>
      </InstantSearch>
    </>
  )
}

export default Search
