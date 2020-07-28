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
    <div className="hit">
      <div>
        <div className="hit-picture">
          <img src={`${image}`} />
        </div>
      </div>
      <div className="hit-content">
        <div>
          <Link href={`/${type}s/[id]`} as={path}>
            <a className="no-underline hover:underline text-blue-500">
              {hit.title}
            </a>
          </Link>
        </div>
        <div className="hit-type">
          <Highlight attribute="type" hit={hit} />
        </div>
        <div className="hit-description">
          <Highlight attribute="su8mmary" hit={hit} />
        </div>
      </div>
    </div>
  )
}

export default class extends React.Component {
  render() {
    return (
      <InstantSearch {...this.props}>
        <Configure hitsPerPage={12} />
        <header>
          <h1>React InstantSearch + Next.Js</h1>
          <SearchBox />
        </header>
        <main>
          <div className="menu">
            <RefinementList attribute="type" />
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
      </InstantSearch>
    )
  }
}
