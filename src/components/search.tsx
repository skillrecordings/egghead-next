import React from 'react'
import Link from 'next/link'
import {
  RefinementList,
  connectSearchBox,
  Hits,
  Configure,
  Highlight,
  Pagination,
  InstantSearch,
} from 'react-instantsearch-dom'
import {SearchClient} from '@algolia/client-search'

const SearchBox = ({currentRefinement, isSearchStalled, refine}) => (
  <form noValidate action="" role="search" className="mx-auto max-w-full">
    <div className="mr-6 my-2 mx-auto pb-4 flex items-center justify-center">
      <input
        type="search"
        value={currentRefinement}
        onChange={(event) => refine(event.currentTarget.value)}
        placeholder="Type here to search..."
        className="bg-purple-white shadow rounded border-0 p-5 w-4/6"
      />
    </div>
  </form>
)

const CustomSearchBox = connectSearchBox(SearchBox)

const HitComponent = ({hit}) => {
  const {path, type, image} = hit
  return (
    <Link href={`/${type}s/[id]`} as={path}>
      <a className="grid grid-cols-4 gap-4 items-center mb-5">
        <div className="col-span-1">
          <img src={`${image}`} alt={`illustration for ${hit.title}`} />
        </div>
        <div className="col-span-3">
          <h1 className="md:text-3xl text-xl font-semibold leading-tight">
            {hit.title}
          </h1>
          <div>
            <Highlight attribute="type" hit={hit} />
          </div>
          <div>
            <Highlight attribute="summary" hit={hit} />
          </div>
        </div>
      </a>
    </Link>
  )
}

interface InstantSearchProps {
  searchClient: any
  indexName: string
}

export default class extends React.Component<InstantSearchProps> {
  render() {
    const {children, searchClient, indexName, ...rest} = this.props

    return (
      <InstantSearch
        indexName={indexName}
        searchClient={searchClient}
        {...rest}
      >
        <Configure hitsPerPage={12} />
        <header>
          <h1>search your egghead library</h1>
          <SearchBox />
        </header>
        <main>
          <div className="flex flex-wrap overflow-hidden sm:-mx-1 md:-mx-1">
            <div className="w-full overflow-hidden sm:my-1 sm:px-1 sm:w-full md:my-1 md:px-1 md:w-full lg:w-1/3 xl:w-1/3">
              <RefinementList attribute="type" />
            </div>

            <div className="w-full overflow-hidden sm:my-1 sm:px-1 sm:w-full md:my-1 md:px-1 md:w-full lg:w-1/3 xl:w-1/3">
              <RefinementList attribute="instructor_name" />
            </div>

            <div className="w-full overflow-hidden sm:my-1 sm:px-1 sm:w-full md:my-1 md:px-1 md:w-full lg:w-1/3 xl:w-1/3">
              <RefinementList attribute="_tags" />
            </div>
          </div>

          <div className="results pt-16">
            <Hits hitComponent={HitComponent} />
          </div>
        </main>
        <footer>
          <Pagination />
        </footer>
        {children}
      </InstantSearch>
    )
  }
}
