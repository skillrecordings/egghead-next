import {useRouter} from 'next/router'
import {findResultsState} from 'react-instantsearch-dom/server'
import algoliasearchLite from 'algoliasearch/lite'
import App from '../../components/app'

import qs from 'qs'

const createURL = (state) => `?${qs.stringify(state)}`

const searchStateToURL = (searchState) =>
  searchState ? `?${qs.stringify(searchState)}` : ''

const fullTextSearch = {
  appId: '78FD8NWNJK',
  searchApiKey: 'd1b3f68acf6c2817900630bc0ac6c389',
}

const searchClient = algoliasearchLite(
  fullTextSearch.appId,
  fullTextSearch.searchApiKey,
)

const defaultProps = {
  searchClient,
  indexName: 'content_production',
}

export default function Search({initialSearchState, resultsState}) {
  const [searchState, setSearchState] = React.useState(initialSearchState)
  const debouncedState = React.useRef(null)
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
  return (
    <div>
      <App
        {...defaultProps}
        searchState={searchState}
        resultsState={resultsState}
        createURL={createURL}
        onSearchStateChange={onSearchStateChange}
      />
    </div>
  )
}

export async function getServerSideProps({query}) {
  const initialSearchState = {query: query.all?.join(' ') || ''}
  const {rawResults} = await findResultsState(App, {
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
