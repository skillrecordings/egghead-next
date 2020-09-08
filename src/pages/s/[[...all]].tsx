import React, {FunctionComponent} from 'react'
import {useRouter} from 'next/router'
import {findResultsState} from 'react-instantsearch-dom/server'
import algoliasearchLite from 'algoliasearch/lite'
import Search from 'components/search'
import {NextSeo} from 'next-seo'
import {GetServerSideProps} from 'next'

import qs from 'qs'
import {createUrl, parseUrl, titleFromPath} from 'lib/search-url-builder'
import {isEmpty, get} from 'lodash'

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
}

const SearchIndex: FunctionComponent<SearchIndexProps> = ({
  initialSearchState,
  resultsState,
  pageTitle,
}) => {
  const [searchState, setSearchState] = React.useState(initialSearchState)
  const debouncedState = React.useRef<any>()
  const router = useRouter()

  const onSearchStateChange = (searchState: any) => {
    clearTimeout(debouncedState.current)

    debouncedState.current = setTimeout(() => {
      const href = createUrl(searchState)

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

  const selectedTypes = get(searchState, 'refinementList.type', []) as string[]
  const noindex = !isEmpty(searchState.query) || !isEmpty(selectedTypes)

  return (
    <div>
      <NextSeo noindex={noindex} title={pageTitle} />
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
  const initialSearchState = parseUrl(query)
  const pageTitle = titleFromPath(query.all as string[])
  const {rawResults} = await findResultsState(Search, {
    ...defaultProps,
    searchState: initialSearchState,
  })

  return {
    props: {
      resultsState: {rawResults},
      initialSearchState,
      pageTitle,
    },
  }
}
