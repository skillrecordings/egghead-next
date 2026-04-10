import * as React from 'react'
import singletonRouter from 'next/router'
import Image from 'next/image'
import Search from '@/components/search'
import {NextSeo} from 'next-seo'
import {GetStaticPaths, GetStaticProps} from 'next'
import {withStaticPropsLogging} from '@/lib/logging'
import qs from 'qs'
import {createUrl, parseUrl, titleFromPath} from '@/lib/search-url-builder'
import {get, first} from 'lodash'
import queryParamsPresent from '@/utils/query-params-present'
import {loadInstructor} from '@/lib/instructors'
import Header from '@/components/app/header'
import Main from '@/components/app/main'
import Footer from '@/components/app/footer'
import {loadTag} from '@/lib/tags'
import {topicExtractor} from '@/utils/search/topic-extractor'
import useLoadTopicData, {topicQuery} from '@/hooks/use-load-topic-data'
import {sanityClient} from '@/utils/sanity-client'
import {
  TYPESENSE_COLLECTION_NAME,
  typesenseInstantsearchAdapter,
} from '@/utils/typesense'
import nameToSlug from '@/lib/name-to-slug'
import Link from 'next/link'
import {HOT_SEARCH_PATHS} from '@/lib/hot-search-paths'
import {
  getSearchStateFromUrlParts,
  isLowCardinalitySearchPath,
} from '@/lib/search-url-state'
import {withHeaderBannerStaticProps} from '@/server/with-header-banner-props'

const createURL = (state: any) => `?${qs.stringify(state)}`

const typesenseAdapterInit = (() => {
  try {
    return typesenseInstantsearchAdapter()
  } catch (error) {
    console.error(
      JSON.stringify({
        event: 'search.typesense.init.error',
        error: error instanceof Error ? error.message : String(error),
      }),
    )
    return null
  }
})()

export const typesenseAdapter =
  typesenseAdapterInit ??
  ({
    typesenseClient: null,
    clearCache: () => undefined,
    updateConfiguration: () => undefined,
    searchClient: {
      search: async () => ({results: []}),
      searchForFacetValues: async () => ({facetHits: []}),
    },
  } as unknown as ReturnType<typeof typesenseInstantsearchAdapter>)

const searchClient = typesenseAdapter.searchClient
const typesenseConfigured = typesenseAdapterInit !== null

const defaultProps = {
  searchClient,
}

const SEARCH_REVALIDATE_SECONDS = 300
const getCanonicalSearchPath = (all: string[] = []) =>
  createUrl(parseUrl(all.length > 0 ? {all} : {}))

const shouldNoIndexSearchPage = ({
  href,
  searchState,
}: {
  href: string
  searchState: any
}) => {
  return queryParamsPresent(href) || !isLowCardinalitySearchPath(searchState)
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
  const debouncedState = React.useRef<any>(null)
  const instructorCache = React.useRef<Map<string, any>>(new Map())
  const lastInstructorSlug = React.useRef<string | null>(null)
  const {loading, topicSanityData, topicGraphqlData} = useLoadTopicData(
    initialTopicGraphqlData,
    initialTopicSanityData,
    searchState,
  )

  React.useEffect(() => {
    const currentUrl = new URL(window.location.href)
    const currentSearchState = getSearchStateFromUrlParts({
      pathname: currentUrl.pathname,
      searchParams: currentUrl.searchParams,
    })

    if (createUrl(currentSearchState) !== createUrl(initialSearchState)) {
      setSearchState(currentSearchState)
    }

    setNoIndex(
      shouldNoIndexSearchPage({
        href: `${currentUrl.pathname}${currentUrl.search}`,
        searchState: currentSearchState,
      }),
    )
  }, [initialSearchState])

  if (error) {
    return (
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
              Don't worry, our team is working on it. In the meantime, you can:
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
    )
  }

  const onSearchStateChange = async (state: any) => {
    clearTimeout(debouncedState.current)

    const searchState = {...state.uiState[TYPESENSE_COLLECTION_NAME]}

    const instructors = getInstructorsFromSearchState(searchState)

    if (instructors.length === 1) {
      const instructorSlug = getInstructorSlugFromInstructorList(instructors)
      if (lastInstructorSlug.current !== instructorSlug) {
        lastInstructorSlug.current = instructorSlug
        const cached = instructorCache.current.get(instructorSlug)
        if (cached) {
          setInstructor(cached)
        } else {
          try {
            const loaded = await loadInstructor(instructorSlug)
            instructorCache.current.set(instructorSlug, loaded)
            setInstructor(loaded)
          } catch (error) {}
        }
      }
    } else {
      lastInstructorSlug.current = null
      setInstructor(null)
    }

    debouncedState.current = setTimeout(() => {
      const href: string = createUrl(searchState)
      setNoIndex(
        shouldNoIndexSearchPage({
          href,
          searchState,
        }),
      )

      singletonRouter.replace(href, undefined, {
        shallow: true,
      })
    }, 500)

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
      <Search
        {...defaultProps}
        {...customProps}
        instructor={instructor}
        topic={topicGraphqlData}
        topicData={topicSanityData}
        onSearchStateChange={onSearchStateChange}
        loading={loading}
      />
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

const getStaticPathParamsForSearchPath = (path: string) => {
  const all = path
    .replace(/^\/q\/?/, '')
    .split('/')
    .filter(Boolean)
  const canonicalPath = getCanonicalSearchPath(all)
  const canonicalAll = canonicalPath
    .replace(/^\/q\/?/, '')
    .split('/')
    .filter(Boolean)

  return {
    params: {
      all: canonicalAll,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  console.log(
    JSON.stringify({
      event: 'search.static_paths.generated',
      count: HOT_SEARCH_PATHS.length,
    }),
  )

  const dedupedPaths = Array.from(
    new Map(
      HOT_SEARCH_PATHS.map((path) => {
        const staticPath = getStaticPathParamsForSearchPath(path)
        const key = (staticPath.params.all ?? []).join('/')
        return [key, staticPath]
      }),
    ).values(),
  )

  return {
    paths: dedupedPaths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = withStaticPropsLogging(
  withHeaderBannerStaticProps('/q/[[...all]]', async function ({params}) {
    const rawAll = params?.all
    const all = Array.isArray(rawAll) ? rawAll.filter(Boolean) : []

    if (all[0] === 'undefined') {
      return {
        notFound: true,
        revalidate: 60,
      }
    }

    const initialSearchState = parseUrl(all.length > 0 ? {all} : {})
    const path = getCanonicalSearchPath(all)
    const selectedInstructors =
      getInstructorsFromSearchState(initialSearchState)
    const selectedTopics = topicExtractor(initialSearchState)
    const pageTitle = titleFromPath(all)
    const isLowCardinalityBrowse =
      isLowCardinalitySearchPath(initialSearchState)
    const noIndexInitial = !isLowCardinalityBrowse

    try {
      if (!typesenseConfigured) {
        return {
          props: {
            error: 'Search service unavailable',
            initialSearchState,
            path,
            pageTitle,
            noIndexInitial: true,
            initialInstructor: null,
            initialTopicGraphqlData: null,
            initialTopicSanityData: null,
          },
          revalidate: 60,
        }
      }

      let initialInstructor = null
      let initialTopicGraphqlData = null
      let initialTopicSanityData = null

      if (
        selectedTopics?.length === 1 &&
        !selectedTopics.includes('undefined')
      ) {
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

      console.log(
        JSON.stringify({
          event: 'search.static_props.generated',
          path,
          low_cardinality_browse: isLowCardinalityBrowse,
          no_index: noIndexInitial,
          server_side_results: false,
          ok: true,
        }),
      )

      return {
        props: {
          error: '',
          initialSearchState,
          path,
          pageTitle,
          noIndexInitial,
          initialInstructor,
          ...(!!initialTopicGraphqlData && {initialTopicGraphqlData}),
          ...(!!initialTopicSanityData && {initialTopicSanityData}),
        },
        revalidate: SEARCH_REVALIDATE_SECONDS,
      }
    } catch (error) {
      console.error(
        JSON.stringify({
          event: 'search.static_props.error',
          path,
          ok: false,
          error: error instanceof Error ? error.message : String(error),
        }),
      )

      return {
        props: {
          error: 'Search service unavailable',
          initialSearchState,
          path,
          pageTitle,
          noIndexInitial: true,
          initialInstructor: null,
          initialTopicGraphqlData: null,
          initialTopicSanityData: null,
        },
        revalidate: 60,
      }
    }
  }),
)
