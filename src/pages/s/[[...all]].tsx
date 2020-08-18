import React from 'react'
import {useRouter} from 'next/router'
import {findResultsState} from 'react-instantsearch-dom/server'
import algoliasearchLite from 'algoliasearch/lite'
import Search from '@components/search'

import qs from 'qs'
import {Head} from 'next/document'
import {createUrl, parseUrl} from '@lib/search-url-builder'

const createURL = (state) => `?${qs.stringify(state)}`

const searchStateToUrl = (searchState) =>
  searchState ? `${window.location.pathname}?${qs.stringify(searchState)}` : ''

const fullTextSearch = {
  appId: process.env.NEXT_PUBLIC_ALGOLIA_APP || '',
  searchApiKey: process.env.NEXT_PUBLIC_ALGOLIA_KEY || '',
}

const searchClient = algoliasearchLite(
  fullTextSearch.appId,
  fullTextSearch.searchApiKey,
)

const defaultProps = {
  searchClient,
  indexName: 'content_production',
}

export default function SearchIndex({initialSearchState, resultsState}) {
  const [searchState, setSearchState] = React.useState(initialSearchState)
  const debouncedState = React.useRef<any>()
  const router = useRouter()

  const onSearchStateChange = (searchState) => {
    clearTimeout(debouncedState.current)
    console.log(searchState)

    debouncedState.current = setTimeout(() => {
      const href = createUrl(searchState)

      router.push(href, href, {
        shallow: true,
      })
    }, 700)

    setSearchState(searchState)
  }
  const customProps = {
    searchState,
    resultsState,
    createURL,
    onSearchStateChange,
  }

  return (
    <div>
      <Search {...defaultProps} {...customProps} />
    </div>
  )
}

export async function getServerSideProps({query, ...rest}) {
  const initialSearchState = parseUrl(query)
  const {rawResults} = await findResultsState(Search, {
    ...defaultProps,
    searchState: initialSearchState,
  })

  return {
    props: {
      resultsState: {rawResults},
      initialSearchState,
    },
  }
}
