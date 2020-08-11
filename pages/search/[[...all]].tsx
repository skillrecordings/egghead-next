import React from 'react'
import {useRouter} from 'next/router'
import {findResultsState} from 'react-instantsearch-dom/server'
import algoliasearchLite from 'algoliasearch/lite'
import Search from '../../components/search'

import qs from 'qs'

const createURL = (state) => `?${qs.stringify(state)}`

const searchStateToURL = (searchState) =>
  searchState ? `?${qs.stringify(searchState)}` : ''

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

    debouncedState.current = setTimeout(() => {
      const {query, ...rest} = searchState
      const qs = searchStateToURL(rest.refinementList)
      const href = `/search/${searchState.query.split(' ').join('/')}${qs}`

      //this is all f'd up. The general idea is to build up SEO friendly URLs for search
      //where the url would be broken up like `/react/hooks/courses/by/kent+c+dodds` which is 100%
      //possible but also fairly nuanced and complex 😅

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

export async function getServerSideProps({query}) {
  const {all} = query

  const initialSearchState = all ? {query: all.join(' ') || ''} : {}
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
