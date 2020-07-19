import {InstantSearch, SearchBox, Hits} from 'react-instantsearch-dom'
import {useRouter} from 'next/router'
import {findResultsState} from 'react-instantsearch-dom/server'
import algoliasearchLite from 'algoliasearch/lite'
import App from '../../components/app'

import qs from 'qs'

const createURL = (state) => `?${qs.stringify(state)}`

const qsSearchState = (query) => (query ? qs.parse(query) : {})

const searchStateToURL = (searchState) =>
  searchState ? `${window.location.pathname}?${qs.stringify(searchState)}` : ''

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

    console.log(searchState)

    debouncedState.current = setTimeout(() => {
      const href = `/search/${searchState.query.split(' ').join('/')}`

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
  console.log(query)
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
