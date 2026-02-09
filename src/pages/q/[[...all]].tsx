import * as React from 'react'
import singletonRouter from 'next/router'
import Image from 'next/image'
import Search from '@/components/search'
import {NextSeo} from 'next-seo'
import {GetServerSideProps} from 'next'
import {withSSRLogging} from '@/lib/logging'
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
import crypto from 'crypto'
import {getRedis} from '@/lib/upstash-redis'

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

// KV cache for expensive `getServerState` results. Longer TTL is safe because:
// - search results are not user-specific
// - Typesense updates are not instant-critical
const SEARCH_SSR_CACHE_TTL_SECONDS = 600
const SEARCH_SSR_CACHE_PREFIX = 'search:ssr'

/**
 * Deep-stable stringify for cache keys.
 *
 * The previous implementation used `JSON.stringify(value, Object.keys(value).sort())`
 * which only keeps top-level keys. Nested objects became `{}` which caused key
 * collisions and incorrect SSR payload reuse.
 */
const stableJson = (value: any) => {
  const normalize = (v: any): any => {
    if (v === undefined) return undefined
    if (v === null) return null
    if (Array.isArray(v)) return v.map(normalize)
    if (typeof v !== 'object') return v

    // Only sort plain objects; keep other objects (Date, etc) as-is.
    const proto = Object.getPrototypeOf(v)
    if (proto !== Object.prototype && proto !== null) return v

    const out: Record<string, unknown> = {}
    for (const key of Object.keys(v).sort()) {
      const child = normalize(v[key])
      if (child === undefined) continue
      out[key] = child
    }
    return out
  }

  return JSON.stringify(normalize(value))
}

const cacheKeyForQuery = (query: any) => {
  const base = stableJson(query || {})
  const hash = crypto.createHash('sha1').update(base).digest('hex')
  return `${SEARCH_SSR_CACHE_PREFIX}:${hash}`
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
  const debouncedState = React.useRef<any>(null)
  const instructorCache = React.useRef<Map<string, any>>(new Map())
  const lastInstructorSlug = React.useRef<string | null>(null)
  const {loading, topicSanityData, topicGraphqlData} = useLoadTopicData(
    initialTopicGraphqlData,
    initialTopicSanityData,
    searchState,
  )

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
      setNoIndex(queryParamsPresent(href))

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

export const getServerSideProps: GetServerSideProps = withSSRLogging(
  async ({req, query, res}) => {
    setupHttpTracing({name: getServerSideProps.name, tracer, req, res})
    // Search is high-cardinality but non-user-specific. Give the CDN more time
    // so repeated queries have a chance to hit.
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600')
    const {all = [], ...rest} = query

    if (all[0] === 'undefined') return {props: {error: 'no search query'}}

    const initialSearchState = parseUrl(query)
    const selectedInstructors =
      getInstructorsFromSearchState(initialSearchState)
    const selectedTopics = topicExtractor(initialSearchState)
    const pageTitle = titleFromPath(all as string[])
    const path = req.url

    // Canonicalize: strip Next/Vercel "nxtP*" params that explode cache keys.
    // This improves CDN hit rate without changing the rendered content.
    try {
      const url = new URL(req.url || '/q', 'https://egghead.io')
      const nxtPKeys: string[] = []
      for (const key of url.searchParams.keys()) {
        if (key.startsWith('nxtP')) nxtPKeys.push(key)
      }
      if (nxtPKeys.length > 0) {
        nxtPKeys.forEach((k) => {
          url.searchParams.delete(k)
        })
        return {
          redirect: {
            destination: `${url.pathname}${url.search}`,
            permanent: false,
          },
        }
      }
    } catch {
      // never crash on URL parsing
    }

    try {
      const redis = getRedis()

      // Set a timeout for the getServerState call
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Typesense request timed out'))
        }, 5000) // 5 second timeout
      })

      const allowedQueryKeys = new Set([
        'q',
        'type',
        'access_state',
        'page',
        'sortBy',
      ])
      const weirdKeys = Object.keys(rest || {}).filter(
        (k) => !allowedQueryKeys.has(k),
      )

      const qValue =
        typeof rest.q === 'string'
          ? rest.q
          : Array.isArray(rest.q)
          ? rest.q.join(' ')
          : ''
      const hasQ = qValue.trim().length > 0
      const qLen = qValue.length

      const pageNumber = Number(rest.page ?? 1)
      const hasNonFirstPage = Number.isFinite(pageNumber) && pageNumber > 1
      const hasSortBy =
        typeof rest.sortBy === 'string' && rest.sortBy.trim().length > 0

      // Our `/q/<path>` URLs can encode multiple tags/instructors (combinatorial explosion).
      // SSR'ing those pages is expensive and produces near-zero cache reuse.
      const topicsCount = Array.isArray(selectedTopics)
        ? selectedTopics.filter((t) => t && t !== 'undefined').length
        : 0
      const instructorsCount = Array.isArray(selectedInstructors)
        ? selectedInstructors.length
        : 0
      const isLowCardinalityBrowse = topicsCount + instructorsCount <= 1

      // "Browse-mode" only: we SSR/cached only when this is low-cardinality.
      // Free-text search is huge cardinality, so skip expensive `getServerState`
      // and let the client InstantSearch fetch.
      const shouldSkipSsr =
        hasQ ||
        weirdKeys.length > 0 ||
        hasNonFirstPage ||
        hasSortBy ||
        !isLowCardinalityBrowse
      const cacheable = !shouldSkipSsr

      const cacheKey = cacheKeyForQuery(initialSearchState)

      let sanitizedServerState: any | null = null
      let cacheStatus: 'hit' | 'miss' | 'error' | 'skip' = 'miss'
      let bytes: number | null = null
      let setOk: boolean | null = null
      let skipReason:
        | 'has_q'
        | 'weird_keys'
        | 'non_first_page'
        | 'has_sort_by'
        | 'high_cardinality_path'
        | null = null

      if (shouldSkipSsr) {
        cacheStatus = 'skip'
        if (hasQ) skipReason = 'has_q'
        else if (weirdKeys.length > 0) skipReason = 'weird_keys'
        else if (hasNonFirstPage) skipReason = 'non_first_page'
        else if (hasSortBy) skipReason = 'has_sort_by'
        else if (!isLowCardinalityBrowse) skipReason = 'high_cardinality_path'
      } else if (redis) {
        try {
          const cached = await redis.get(cacheKey)
          if (cached) {
            sanitizedServerState = cached
            cacheStatus = 'hit'
          }
        } catch {
          // fail open if Redis is unavailable
          cacheStatus = 'error'
        }
      }

      if (!sanitizedServerState && !shouldSkipSsr) {
        // Get server state and sanitize it for serialization
        const serverStatePromise = getServerState(
          <SearchIndex initialSearchState={initialSearchState} />,
          {
            renderToString,
          },
        )

        // Race between the timeout and the actual request
        const serverState = await Promise.race([
          serverStatePromise,
          timeoutPromise,
        ])

        // Sanitize the serverState to remove undefined values
        sanitizedServerState = JSON.parse(
          JSON.stringify(serverState, (_, value) =>
            value === undefined ? null : value,
          ),
        )

        try {
          if (redis) {
            const json = JSON.stringify(sanitizedServerState)
            bytes = Buffer.byteLength(json, 'utf8')

            // Guardrail: don't try to shove huge payloads into Redis.
            // (Upstash/Vercel KV commonly limit value sizes around ~1MB.)
            const MAX_BYTES = 900_000
            if (bytes <= MAX_BYTES && cacheable) {
              await redis.set(cacheKey, sanitizedServerState, {
                ex: SEARCH_SSR_CACHE_TTL_SECONDS,
              })
              setOk = true
            } else {
              setOk = false
            }
          }
        } catch {
          // ignore cache set failures
          setOk = false
        }
      }

      try {
        console.log(
          JSON.stringify({
            event: 'search_ssr_cache',
            status: cacheStatus,
            cacheable,
            has_q: hasQ,
            q_len: qLen,
            weird_keys_count: weirdKeys.length,
            non_first_page: hasNonFirstPage,
            has_sort_by: hasSortBy,
            tags_count: topicsCount,
            instructors_count: instructorsCount,
            skip_reason: skipReason,
            bytes,
            set_ok: setOk,
            ttl_s: SEARCH_SSR_CACHE_TTL_SECONDS,
            key_prefix: SEARCH_SSR_CACHE_PREFIX,
            cache_key: cacheKey,
            path,
          }),
        )
      } catch {
        // logging must never crash
      }

      if (!sanitizedServerState) {
        // Skip SSR Typesense entirely (high-cardinality) and let the client fetch.
        return {
          props: {
            error: '',
            initialSearchState,
            path,
            serverState: null,
            pageTitle,
            // free-text queries (and weird params) are noindex by default
            noIndexInitial: true,
            initialInstructor: null,
            initialTopicGraphqlData: null,
            initialTopicSanityData: null,
          },
        }
      }

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
  },
)
