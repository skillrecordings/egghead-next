import type {ParsedUrlQuery} from 'querystring'

type CanonicalizeInternalQueryParamsArgs = {
  pathname: string
  query?: ParsedUrlQuery
  omitKeys?: string[]
}

type CanonicalizeInternalQueryParamsResult = {
  destination: string
  strippedKeys: string[]
}

const appendQueryParam = (
  searchParams: URLSearchParams,
  key: string,
  value: string | string[] | undefined,
) => {
  if (typeof value === 'undefined') return

  if (Array.isArray(value)) {
    value.forEach((entry) => {
      searchParams.append(key, entry)
    })
    return
  }

  searchParams.append(key, value)
}

export const canonicalizeInternalQueryParams = ({
  pathname,
  query,
  omitKeys = [],
}: CanonicalizeInternalQueryParamsArgs): CanonicalizeInternalQueryParamsResult | null => {
  if (!query) return null

  const strippedKeys = Object.keys(query).filter((key) =>
    key.startsWith('nxtP'),
  )
  if (strippedKeys.length === 0) return null

  const omit = new Set([...omitKeys, ...strippedKeys])
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(query)) {
    if (omit.has(key)) continue
    appendQueryParam(searchParams, key, value)
  }

  const queryString = searchParams.toString()
  return {
    destination: queryString ? `${pathname}?${queryString}` : pathname,
    strippedKeys,
  }
}
