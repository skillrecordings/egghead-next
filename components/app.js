import React from 'react'
import PropTypes from 'prop-types'
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

HitComponent.propTypes = {
  hit: PropTypes.object,
}

export default class extends React.Component {
  static propTypes = {
    searchState: PropTypes.object,
    resultsState: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onSearchStateChange: PropTypes.func,
    createURL: PropTypes.func,
    indexName: PropTypes.string,
    searchClient: PropTypes.object,
  }

  render() {
    return (
      <InstantSearch
        searchClient={this.props.searchClient}
        resultsState={this.props.resultsState}
        onSearchStateChange={this.props.onSearchStateChange}
        searchState={this.props.searchState}
        createURL={this.props.createURL}
        indexName={this.props.indexName}
        onSearchParameters={this.props.onSearchParameters}
        {...this.props}
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
