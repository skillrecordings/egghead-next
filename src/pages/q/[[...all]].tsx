import React, {FunctionComponent} from 'react'
import {useRouter} from 'next/router'
import {findResultsState} from 'react-instantsearch-dom/server'
import algoliasearchLite from 'algoliasearch/lite'
import Search from 'components/search'
import {NextSeo} from 'next-seo'
import {GetServerSideProps} from 'next'

import qs from 'qs'
import {createUrl, parseUrl, titleFromPath} from 'lib/search-url-builder'
import {isEmpty, get, first, isArray} from 'lodash'
import queryParamsPresent from 'utils/query-params-present'

import {loadInstructor} from 'lib/instructors'
import nameToSlug from 'lib/name-to-slug'

import getTracer from 'utils/honeycomb-tracer'
import {setupHttpTracing} from '@vercel/tracing-js'
import Header from 'components/app/header'
import Main from 'components/app/main'
import Footer from 'components/app/footer'
import {loadTag} from 'lib/tags'
import {tagCacheLoader} from 'utils/tag-cache-loader'

const tracer = getTracer('search-page')

const createURL = (state: any) => `?${qs.stringify(state)}`

const fullTextSearch = {
  appId: process.env.NEXT_PUBLIC_ALGOLIA_APP || '',
  searchApiKey: process.env.NEXT_PUBLIC_ALGOLIA_KEY || '',
}

const ALGOLIA_INDEX_NAME =
  process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'content_production'

const searchClient = algoliasearchLite(
  fullTextSearch.appId,
  fullTextSearch.searchApiKey,
)

const defaultProps = {
  searchClient,
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
  initialTopic: any
}

const SearchIndex: any = ({
  initialSearchState,
  resultsState,
  pageTitle,
  noIndexInitial,
  initialInstructor,
  initialTopic,
}: SearchIndexProps) => {
  const [searchState, setSearchState] = React.useState(initialSearchState)
  const [instructor, setInstructor] = React.useState(initialInstructor)
  const [topic, setTopic] = React.useState(initialTopic)
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

    const selectedTopics = searchState?.refinementList?._tags

    if (
      isArray(selectedTopics) &&
      selectedTopics?.length === 1 &&
      !selectedTopics.includes('undefined')
    ) {
      const newTopic = first<string>(selectedTopics)
      try {
        if (newTopic) {
          const cachedTag = tagCacheLoader(newTopic)
          if (cachedTag) {
            setTopic(cachedTag)
          } else {
            loadTag(newTopic).then(setTopic)
          }
        } else {
          setTopic(undefined)
        }
      } catch (error) {
        console.error(error)
      }
    } else {
      setTopic(undefined)
    }

    debouncedState.current = setTimeout(() => {
      const href: string = createUrl(searchState)
      setNoIndex(queryParamsPresent(href))

      router.push(`/q/[[all]]`, href, {
        shallow: true,
      })
    }, 250)

    setSearchState(searchState)
  }

  const customProps = {
    searchState,
    resultsState,
    createURL,
    onSearchStateChange,
  }

  return (
    <div className="flex-grow">
      <NextSeo noindex={noIndex} title={pageTitle} />
      <Search
        {...defaultProps}
        {...customProps}
        instructor={instructor}
        topic={topic}
      />
    </div>
  )
}

// this fixes the issue with a double footer rendering. 🥴
SearchIndex.getLayout = (Page: any, pageProps: any) => {
  return (
    <>
      <Header />
      <Main>
        <Page {...pageProps} />
        <Footer />
      </Main>
    </>
  )
}

export default SearchIndex

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  query,
  res,
}) {
  setupHttpTracing({name: getServerSideProps.name, tracer, req, res})
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  const {all, ...rest} = query
  const initialSearchState = parseUrl(query)
  const pageTitle = titleFromPath(all as string[])
  const resultsState = await findResultsState(Search, {
    ...defaultProps,
    searchState: initialSearchState,
    indexName: ALGOLIA_INDEX_NAME,
  })

  let initialInstructor = null
  let initialTopic = null

  const {rawResults, state} = resultsState

  const noHits = isEmpty(get(first(rawResults), 'hits'))
  const queryParamsPresent = !isEmpty(rest)
  const userQueryPresent = !isEmpty(state.query)

  const noIndexInitial = queryParamsPresent || noHits || userQueryPresent

  const selectedInstructors = getInstructorsFromSearchState(initialSearchState)
  const selectedTopics = initialSearchState.refinementList?._tags

  if (selectedTopics?.length === 1 && !selectedTopics.includes('undefined')) {
    const topic = first<string>(selectedTopics)

    console.log({selectedTopics})
    try {
      if (topic) {
        initialTopic = await loadTag(topic)

        console.log({topic})
      }
    } catch (error) {
      console.error(error)
    }
  }

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
      ...(!!initialTopic && {initialTopic}),
    },
  }
}
