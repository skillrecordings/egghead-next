import React, {FunctionComponent} from 'react'
import {useRouter} from 'next/router'
import {findResultsState} from 'react-instantsearch-dom/server'
import algoliasearchLite from 'algoliasearch/lite'
import Search from 'components/search'
import {NextSeo} from 'next-seo'
import {GetServerSideProps} from 'next'

import qs from 'qs'
import {createUrl, parseUrl, titleFromPath} from 'lib/search-url-builder'
import {isEmpty, get, first} from 'lodash'
import queryParamsPresent from 'utils/query-params-present'

const createURL = (state: any) => `?${qs.stringify(state)}`

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

type SearchIndexProps = {
  initialSearchState: any
  resultsState: any
  pageTitle: string
  noIndexInitial: boolean
}

const SearchIndex: FunctionComponent<SearchIndexProps> = ({
  initialSearchState,
  resultsState,
  pageTitle,
  noIndexInitial,
}) => {
  const [searchState, setSearchState] = React.useState(initialSearchState)
  const [noIndex, setNoIndex] = React.useState(noIndexInitial)
  const debouncedState = React.useRef<any>()
  const router = useRouter()

  const onSearchStateChange = (searchState: any) => {
    clearTimeout(debouncedState.current)

    debouncedState.current = setTimeout(() => {
      const href: string = createUrl(searchState)
      setNoIndex(queryParamsPresent(href))

      router.push(`/s[[all]]`, href, {
        shallow: true,
      })
    }, 200)

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
      <NextSeo noindex={noIndex} title={pageTitle} />
      <Search {...defaultProps} {...customProps} />
    </div>
  )
}

export default SearchIndex

export const getServerSideProps: GetServerSideProps = async function ({
  query,
  res,
}) {
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate')
  const {all, ...rest} = query
  const initialSearchState = parseUrl(query)
  const pageTitle = titleFromPath(all as string[])
  const {rawResults, state} = await findResultsState(Search, {
    ...defaultProps,
    searchState: initialSearchState,
  })

  const noHits = isEmpty(get(first(rawResults), 'hits'))
  const queryParamsPresent = !isEmpty(rest)
  const userQueryPresent = !isEmpty(state.query)

  const noIndexInitial = queryParamsPresent || noHits || userQueryPresent

  return {
    props: {
      resultsState: {rawResults},
      initialSearchState,
      pageTitle,
      noIndexInitial,
    },
  }
}
