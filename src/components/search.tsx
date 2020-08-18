import React from 'react'
import Link from 'next/link'
import {
  RefinementList,
  SearchBox,
  Hits,
  Configure,
  Highlight,
  Pagination,
  InstantSearch,
} from 'react-instantsearch-dom'
import {SearchClient} from '@algolia/client-search'

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
          <h1>React InstantSearch + Next.Js</h1>
          <SearchBox />
        </header>
        <main>
          <div className="menu">
            <RefinementList attribute="type" />
          </div>
          <div className="menu">
            <RefinementList attribute="instructor_name" />
          </div>
          <div className="menu">
            <RefinementList attribute="_tags" />
          </div>
          <div className="results">
            <Hits hitComponent={HitComponent} />
          </div>
        </main>
        <footer>
          <Pagination />
          <div>
            See{' '}
            <a href="https://github.com/algolia/react-instantsearch/tree/master/examples/next">
              source code
            </a>{' '}
            on github
          </div>
        </footer>
        {children}
      </InstantSearch>
    )
  }
}
