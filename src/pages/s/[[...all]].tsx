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

import {loadInstructor} from 'lib/instructors'
import nameToSlug from 'lib/name-to-slug'

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

const getInstructorsFromSearchState = (searchState: any) => {
  return get(searchState, 'refinementList.instructor_name', []) as string[]
}

const getInstructorSlugFromInstructorList = (instructors: string[]) => {
  return nameToSlug(first(instructors) as string).toLowerCase()
}

type SearchIndexProps = {
  initialSearchState: any
  resultsState: any
  pageTitle: string
  noIndexInitial: boolean
  initialInstructor: any
}

const SearchIndex: FunctionComponent<SearchIndexProps> = ({
  initialSearchState,
  resultsState,
  pageTitle,
  noIndexInitial,
  initialInstructor,
}) => {
  const [searchState, setSearchState] = React.useState(initialSearchState)
  const [instructor, setInstructor] = React.useState(initialInstructor)
  const [noIndex, setNoIndex] = React.useState(noIndexInitial)
  const debouncedState = React.useRef<any>()
  const router = useRouter()

  const onSearchStateChange = async (searchState: any) => {
    clearTimeout(debouncedState.current)

    const instructors = getInstructorsFromSearchState(searchState)

    if (instructors.length === 1) {
      const instructorSlug = getInstructorSlugFromInstructorList(instructors)
      try {
        await loadInstructor(instructorSlug).then((instructor) =>
          setInstructor(instructor),
        )
      } catch (error) {}
    } else {
      setInstructor(null)
    }

    debouncedState.current = setTimeout(() => {
      const href: string = createUrl(searchState)
      setNoIndex(queryParamsPresent(href))

      router.push(`/s/[[all]]`, href, {
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
      <Search {...defaultProps} {...customProps} instructor={instructor} />
    </div>
  )
}

export default SearchIndex

export const getServerSideProps: GetServerSideProps = async function ({
  query,
  res,
}) {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
  const {all, ...rest} = query
  const initialSearchState = parseUrl(query)
  const pageTitle = titleFromPath(all as string[])
  const resultsState = await findResultsState(Search, {
    ...defaultProps,
    searchState: initialSearchState,
  })

  let initialInstructor = null

  const {rawResults, state} = resultsState

  const noHits = isEmpty(get(first(rawResults), 'hits'))
  const queryParamsPresent = !isEmpty(rest)
  const userQueryPresent = !isEmpty(state.query)

  const noIndexInitial = queryParamsPresent || noHits || userQueryPresent

  const selectedInstructors = getInstructorsFromSearchState(initialSearchState)

  if (selectedInstructors.length === 1) {
    const instructorSlug = getInstructorSlugFromInstructorList(
      selectedInstructors,
    )
    try {
      initialInstructor = await loadInstructor(instructorSlug)
    } catch (error) {
      console.error(error)
    }
  }

  return {
    props: {
      resultsState: JSON.parse(JSON.stringify(resultsState)),
      initialSearchState,
      pageTitle,
      noIndexInitial,
      initialInstructor,
    },
  }
}
