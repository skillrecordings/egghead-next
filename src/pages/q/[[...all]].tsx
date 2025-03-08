import * as React from 'react'
import singletonRouter from 'next/router'
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
import Link from 'next/link'

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
      <>
        <Header />
        <Main>
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-5">
            <div className="flex flex-col md:flex-row items-center max-w-4xl mx-auto gap-8">
              <div className="w-48 h-48 relative">
                <Image
                  src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1659039546/eggodex/basic_eggo.png"
                  alt="egghead search error"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Search is temporarily unavailable
                </h1>
                <p className="text-lg mb-6">{error}</p>
                <p className="mb-6">
                  Don't worry, our team is working on it. In the meantime, you
                  can:
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link
                    href="/"
                    className="py-3 px-5 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors text-center"
                  >
                    Go to homepage
                  </Link>
                  <button
                    onClick={() => window.location.reload()}
                    className="py-3 px-5 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Main>
        <Footer />
      </>
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

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
  res,
}) => {
  setupHttpTracing({name: getServerSideProps.name, tracer, req, res})
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  const {all = [], ...rest} = query

  if (all[0] === 'undefined') return {props: {error: 'no search query'}}

  const initialSearchState = parseUrl(query)
  const pageTitle = titleFromPath(all as string[])
  const path = req.url

  try {
    // Set a timeout for the getServerState call
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Typesense request timed out'))
      }, 5000) // 5 second timeout
    })

    // Get server state and sanitize it for serialization
    const serverStatePromise = getServerState(
      <SearchIndex initialSearchState={initialSearchState} />,
      {
        renderToString,
      },
    )

    // Race between the timeout and the actual request
    const serverState = await Promise.race([serverStatePromise, timeoutPromise])

    // Sanitize the serverState to remove undefined values
    const sanitizedServerState = JSON.parse(
      JSON.stringify(serverState, (_, value) =>
        value === undefined ? null : value,
      ),
    )

    // Rest of the code remains the same...
    const resultsState = Object.keys(sanitizedServerState.initialResults).map(
      (key) => sanitizedServerState.initialResults[key],
    )[0]

    const {results, state} = resultsState

    let initialInstructor = null
    let initialTopicGraphqlData = null
    let initialTopicSanityData = null

    const noHits = isEmpty(get(first(results), 'hits'))
    const queryParamsPresent = !isEmpty(rest)
    const userQueryPresent = !isEmpty(state?.query)

    const noIndexInitial = queryParamsPresent || noHits || userQueryPresent

    const selectedInstructors =
      getInstructorsFromSearchState(initialSearchState)

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
        serverState: sanitizedServerState, // Use sanitized version
        pageTitle,
        noIndexInitial,
        initialInstructor,
        ...(!!initialTopicGraphqlData && {initialTopicGraphqlData}),
        ...(!!initialTopicSanityData && {initialTopicSanityData}),
      },
    }
  } catch (error) {
    console.error('Search error:', error)

    // Return minimal props with error information
    // This allows the component to render but in a fallback state
    return {
      props: {
        error: 'Search service unavailable',
        initialSearchState,
        path,
        serverState: null,
        pageTitle,
        noIndexInitial: true,
        initialInstructor: null,
        initialTopicGraphqlData: null,
        initialTopicSanityData: null,
      },
    }
  }
}
