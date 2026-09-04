import React from 'react'
import {useRouter} from 'next/router'
import {InstantSearch, useInstantSearch} from 'react-instantsearch'
import isEqual from 'lodash/isEqual'
import {createUrl} from '@/lib/search-url-builder'
import {getSearchStateFromUrlParts} from '@/lib/search-url-state'
import {TYPESENSE_COLLECTION_NAME} from '@/utils/typesense'
import {logEvent} from '@/utils/structured-log'

type IndexUiState = ReturnType<typeof useInstantSearch>['indexUiState']
type SetIndexUiState = ReturnType<typeof useInstantSearch>['setIndexUiState']

type Destination = {
  state: IndexUiState
  href: string
}

type UrlWrite = {
  href: string
  started: boolean
}

// An explicit event also resets drafts when navigation keeps the same query.
export const SearchNavigationContext = React.createContext<{
  query: string
  version: number
} | null>(null)

const normalizeState = (state: IndexUiState) => ({
  query: state.query ?? '',
  page: state.page ?? 1,
  sortBy: state.sortBy ?? TYPESENSE_COLLECTION_NAME,
  refinementList: Object.fromEntries(
    Object.entries(state.refinementList ?? {})
      .filter(([, values]) => values.length > 0)
      .map(([attribute, values]) => [attribute, [...values].sort()]),
  ),
})

const readDestination = (href: string): Destination => {
  const url = new URL(href, window.location.origin)
  return {
    state: getSearchStateFromUrlParts({
      pathname: url.pathname,
      searchParams: url.searchParams,
    }),
    href: `${url.pathname}${url.search}`,
  }
}

const SearchUrlBridge = ({
  destination,
  applyDestination,
}: {
  destination: Destination | null
  applyDestination: (
    destination: Destination,
    setIndexUiState: SetIndexUiState,
  ) => void
}) => {
  const {setIndexUiState} = useInstantSearch()

  React.useEffect(() => {
    if (destination) applyDestination(destination, setIndexUiState)
  }, [destination, applyDestination, setIndexUiState])

  return null
}

type SearchUrlSyncProps = Pick<
  React.ComponentProps<typeof InstantSearch>,
  'searchClient' | 'initialUiState'
> & {
  onSearchStateChange: (state: IndexUiState, href: string) => void
  children: React.ReactNode
}

const SearchUrlSync = ({
  children,
  searchClient,
  initialUiState,
  onSearchStateChange,
}: SearchUrlSyncProps) => {
  const router = useRouter()
  const routerRef = React.useRef(router)
  routerRef.current = router
  const onChangeRef = React.useRef(onSearchStateChange)
  onChangeRef.current = onSearchStateChange
  const currentState = React.useRef<IndexUiState>(
    initialUiState?.[TYPESENSE_COLLECTION_NAME] ?? {},
  )
  const applyingDestination = React.useRef(false)
  const navigating = React.useRef(false)
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const writes = React.useRef(new Set<UrlWrite>())
  const [destination, setDestination] = React.useState<Destination | null>(null)
  const [navigation, setNavigation] = React.useState<{
    query: string
    version: number
  } | null>(null)

  const cancelWrite = React.useCallback(() => {
    if (timer.current !== null) clearTimeout(timer.current)
    timer.current = null
  }, [])

  const receiveDestination = React.useCallback((href: string) => {
    const next = readDestination(href)
    setNavigation((current) => ({
      query: next.state.query ?? '',
      version: (current?.version ?? 0) + 1,
    }))
    setDestination(next)
  }, [])

  React.useEffect(() => {
    const {events} = routerRef.current
    const pendingWrites = writes.current
    const ownWrite = (href: string, started: boolean) => {
      for (const write of pendingWrites) {
        if (write.href === href && write.started === started) return write
      }
    }
    const onStart = (href: string, {shallow}: {shallow: boolean}) => {
      const write = shallow && ownWrite(href, false)
      if (write) {
        write.started = true
        return
      }
      cancelWrite()
      navigating.current = true
      setNavigation((current) => ({
        query: currentState.current.query ?? '',
        version: (current?.version ?? 0) + 1,
      }))
    }
    const onComplete = (href: string) => {
      const write = ownWrite(href, true)
      if (write) {
        // A completed replace may be older than the user's latest click.
        pendingWrites.delete(write)
        return
      }
      cancelWrite()
      navigating.current = false
      receiveDestination(href)
    }
    const onError = (_error: unknown, href: string) => {
      const write = ownWrite(href, true) || ownWrite(href, false)
      if (write) pendingWrites.delete(write)
      else navigating.current = false
    }

    events.on('routeChangeStart', onStart)
    events.on('routeChangeComplete', onComplete)
    events.on('routeChangeError', onError)
    return () => {
      cancelWrite()
      events.off('routeChangeStart', onStart)
      events.off('routeChangeComplete', onComplete)
      events.off('routeChangeError', onError)
      pendingWrites.clear()
    }
  }, [router.events, cancelWrite, receiveDestination])

  React.useEffect(() => {
    if (router.isReady) receiveDestination(routerRef.current.asPath)
  }, [router.isReady, receiveDestination])

  const applyDestination = React.useCallback(
    (next: Destination, setIndexUiState: SetIndexUiState) => {
      applyingDestination.current = true
      try {
        if (
          !isEqual(
            normalizeState(currentState.current),
            normalizeState(next.state),
          )
        ) {
          // Replace, rather than merge: omitted URL filters must be removed.
          setIndexUiState(next.state)
        }
        currentState.current = next.state
        onChangeRef.current(next.state, next.href)
      } finally {
        applyingDestination.current = false
      }
    },
    [],
  )

  const onStateChange = React.useCallback<
    NonNullable<React.ComponentProps<typeof InstantSearch>['onStateChange']>
  >(
    ({uiState, setUiState}) => {
      setUiState(uiState)
      const state = uiState[TYPESENSE_COLLECTION_NAME] ?? {}
      currentState.current = state
      if (applyingDestination.current) return
      // Search-box hook results can lag behind a committed query change.
      setNavigation((current) =>
        current?.query === (state.query ?? '')
          ? current
          : {query: state.query ?? '', version: current?.version ?? 0},
      )

      const href = createUrl(state)
      onChangeRef.current(state, href)
      cancelWrite()
      if (navigating.current) return

      timer.current = setTimeout(() => {
        timer.current = null
        if (routerRef.current.asPath === href) return
        const write = {href, started: false}
        writes.current.add(write)
        void routerRef.current
          .replace(href, undefined, {shallow: true})
          .catch((error: unknown) => {
            if (!(error as {cancelled?: boolean})?.cancelled) {
              logEvent('error', 'search.url.replace.error', {
                error: error instanceof Error ? error.message : String(error),
              })
            }
          })
          .finally(() => writes.current.delete(write))
      }, 500)
    },
    [cancelWrite],
  )

  return (
    <InstantSearch
      indexName={TYPESENSE_COLLECTION_NAME}
      searchClient={searchClient}
      initialUiState={initialUiState}
      onStateChange={onStateChange}
      future={{preserveSharedStateOnUnmount: true}}
    >
      <SearchNavigationContext.Provider value={navigation}>
        <SearchUrlBridge
          destination={destination}
          applyDestination={applyDestination}
        />
        {children}
      </SearchNavigationContext.Provider>
    </InstantSearch>
  )
}

export default SearchUrlSync
