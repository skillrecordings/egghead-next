import {parseUrl, type QueryReturnType} from '@/lib/search-url-builder'

export const SEARCH_QUERY_PARAM_KEYS = [
  'q',
  'type',
  'access_state',
  'page',
  'sortBy',
] as const

type SearchQueryInput = {
  all?: string[]
  q?: string
  type?: string
  access_state?: string
  page?: number
  sortBy?: string
}

export const getSearchAllSegmentsFromPathname = (pathname: string) => {
  if (pathname === '/q') return []

  return pathname
    .replace(/^\/q\/?/, '')
    .split('/')
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment))
}

export const getSearchPathFromAll = (all: string[] = []) => {
  return all.length > 0 ? `/q/${all.join('/')}` : '/q'
}

export const buildSearchQueryInput = ({
  pathname,
  searchParams,
}: {
  pathname: string
  searchParams: URLSearchParams
}): SearchQueryInput => {
  const all = getSearchAllSegmentsFromPathname(pathname)
  const query: SearchQueryInput = {}

  if (all.length > 0) {
    query.all = all
  }

  for (const key of SEARCH_QUERY_PARAM_KEYS) {
    const value = searchParams.get(key)
    if (!value) continue

    if (key === 'page') {
      const page = Number(value)
      if (Number.isFinite(page)) {
        query.page = page
      }
      continue
    }

    query[key] = value
  }

  return query
}

export const getSearchStateFromUrlParts = ({
  pathname,
  searchParams,
}: {
  pathname: string
  searchParams: URLSearchParams
}): QueryReturnType => {
  return parseUrl(buildSearchQueryInput({pathname, searchParams}))
}

export const countPathSearchRefinements = (searchState: QueryReturnType) => {
  return (
    (searchState.refinementList?._tags?.length ?? 0) +
    (searchState.refinementList?.instructor_name?.length ?? 0)
  )
}

export const isLowCardinalitySearchPath = (searchState: QueryReturnType) => {
  return countPathSearchRefinements(searchState) <= 1
}
