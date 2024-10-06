import * as React from 'react'
import singletonRouter, {useRouter} from 'next/router'
import Image from 'next/image'
import Search from '@/components/search'
import {NextSeo} from 'next-seo'
import {GetServerSideProps} from 'next'
import qs from 'qs'
import {createUrl, parseUrl, titleFromPath} from '@/lib/search-url-builder'
import {isEmpty, get, first} from 'lodash'
import queryParamsPresent from '@/utils/query-params-present'
import {loadInstructor} from '@/lib/instructors'
import getTracer from '@/utils/honeycomb-tracer'
import {setupHttpTracing} from '@/utils/tracing-js/dist/src/'
import Header from '@/components/app/header'
import Main from '@/components/app/main'
import Footer from '@/components/app/footer'
import {loadTag} from '@/lib/tags'
import {topicExtractor} from '@/utils/search/topic-extractor'
import useLoadTopicData, {topicQuery} from '@/hooks/use-load-topic-data'
import {sanityClient} from '@/utils/sanity-client'
import {getServerState, InstantSearchSSRProvider} from 'react-instantsearch'
import {renderToString} from 'react-dom/server'
import {
  TYPESENSE_COLLECTION_NAME,
  typesenseInstantsearchAdapter,
} from '@/utils/typesense'
import nameToSlug from '@/lib/name-to-slug'

const tracer = getTracer('search-page')

const createURL = (state: any) => `?${qs.stringify(state)}`

export const typesenseAdapter = typesenseInstantsearchAdapter()

const searchClient = typesenseAdapter.searchClient

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
  error: string
  initialSearchState: any
  serverState: any
  pageTitle: string
  noIndexInitial: boolean
  initialInstructor: any
  initialTopicGraphqlData: any
  initialTopicSanityData: any
  path: string
}

const SearchIndex: any = ({
  error,
  initialSearchState,
  serverState,
  pageTitle,
  noIndexInitial,
  initialInstructor,
  initialTopicGraphqlData,
  initialTopicSanityData,
  path,
}: SearchIndexProps) => {
  const [searchState, setSearchState] = React.useState(initialSearchState)
  const [instructor, setInstructor] = React.useState(initialInstructor)
  const [noIndex, setNoIndex] = React.useState(noIndexInitial)
  const debouncedState = React.useRef<any>()
  const {loading, topicSanityData, topicGraphqlData} = useLoadTopicData(
    initialTopicGraphqlData,
    initialTopicSanityData,
    searchState,
  )

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center gap-4">
        <Image
          src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1659039546/eggodex/basic_eggo.png"
          alt="egghead search error"
          width={200}
          height={200}
        />
        <p className="prose dark:prose-dark text-xl">{error}</p>
      </div>
    )
  }

  const onSearchStateChange = async (state: any) => {
    clearTimeout(debouncedState.current)

    const searchState = {...state.uiState[TYPESENSE_COLLECTION_NAME]}

    const instructors = getInstructorsFromSearchState(searchState)

    if (instructors.length === 1) {
      const instructorSlug = getInstructorSlugFromInstructorList(instructors)
      try {
        await loadInstructor(instructorSlug).then((instructor: any) =>
          setInstructor(instructor),
        )
      } catch (error) {}
    } else {
      setInstructor(null)
    }

    debouncedState.current = setTimeout(() => {
      const href: string = createUrl(searchState)
      setNoIndex(queryParamsPresent(href))

      singletonRouter.push(href, undefined, {
        shallow: true,
      })
    }, 250)

    state.setUiState(state.uiState)
    setSearchState(searchState)
  }

  const customProps = {
    searchState,
    createURL,
  }

  return (
    <div className="flex-grow">
      <NextSeo
        noindex={noIndex}
        title={pageTitle}
        canonical={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${path}`}
        openGraph={{
          url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${path}`,
          site_name: 'egghead',
        }}
      />
      <InstantSearchSSRProvider {...serverState}>
        <Search
          {...defaultProps}
          {...customProps}
          instructor={instructor}
          topic={topicGraphqlData}
          topicData={topicSanityData}
          onSearchStateChange={onSearchStateChange}
          loading={loading}
        />
      </InstantSearchSSRProvider>
    </div>
  )
}

// this fixes the issue with a double footer rendering. 🥴
SearchIndex.getLayout = (Page: any, pageProps: any) => {
  return (
    <div>
      <Header />
      <Main className="bg-gray-50">
        <Page {...pageProps} />
      </Main>
      <Footer />
    </div>
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
  const {all = [], ...rest} = query

  if (all[0] === 'undefined') return {props: {error: 'no search query'}}

  const initialSearchState = parseUrl(query)
  const pageTitle = titleFromPath(all as string[])
  const path = req.url

  console.log('mypath', path)

  const serverState = await getServerState(
    <SearchIndex initialSearchState={initialSearchState} />,
    {
      renderToString,
    },
  )

  // Maps the InitialResults record to an array and gets the first (and only) result.
  // From there you have access to the state and result which matches what we expected before the upgrade to react-instantsearch v7
  const resultsState = Object.keys(serverState.initialResults).map((key) => {
    return serverState.initialResults[key]
  })[0]

  const {results, state} = resultsState

  let initialInstructor = null
  let initialTopicGraphqlData = null
  let initialTopicSanityData = null

  const noHits = isEmpty(get(first(results), 'hits'))
  const queryParamsPresent = !isEmpty(rest)
  const userQueryPresent = !isEmpty(state?.query)

  const noIndexInitial = queryParamsPresent || noHits || userQueryPresent

  const selectedInstructors = getInstructorsFromSearchState(initialSearchState)

  const selectedTopics = topicExtractor(initialSearchState)

  if (selectedTopics?.length === 1 && !selectedTopics.includes('undefined')) {
    const topic = first<string>(selectedTopics)

    try {
      if (topic) {
        initialTopicGraphqlData = await loadTag(topic)
        initialTopicSanityData = await sanityClient.fetch(topicQuery, {
          slug: topic,
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (selectedInstructors.length === 1) {
    const instructorSlug =
      getInstructorSlugFromInstructorList(selectedInstructors)
    try {
      initialInstructor = await loadInstructor(instructorSlug)
    } catch (error) {
      console.error(error)
    }
  }

  return {
    props: {
      initialSearchState,
      path,
      serverState,
      pageTitle,
      noIndexInitial,
      initialInstructor,
      ...(!!initialTopicGraphqlData && {initialTopicGraphqlData}),
      ...(!!initialTopicSanityData && {initialTopicSanityData}),
    },
  }
}
