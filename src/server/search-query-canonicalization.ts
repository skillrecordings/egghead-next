import {NextRequest, NextResponse} from 'next/server'
import {normalizeInstructorSlug} from '@/lib/instructor-slug-aliases'

const CREATOR_DELINIATOR = 'resources-by'
const LEGACY_REFINEMENT_PATTERN =
  /^refinementList\[([^\]]+)\](?:\[(?:\d+)?\])?$/
const SUPPORTED_REFINEMENT_ATTRIBUTES = new Set([
  '_tags',
  'instructor_name',
  'type',
  'access_state',
])
const CANONICAL_SEARCH_QUERY_KEYS = new Set([
  'q',
  'type',
  'access_state',
  'page',
  'sortBy',
  'tags',
  'instructors',
])

const appendUnique = (existing: string[] = [], next: string[] = []) => {
  return Array.from(
    new Set([...existing.filter(Boolean), ...next.filter(Boolean)]),
  )
}

const nameToSlug = (name = '') => {
  return name
    .toLowerCase()
    .replace(/[*+~.()'"!:@]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

const mergeCsvValues = (current?: string | null, extra: string[] = []) => {
  const merged = appendUnique(current?.split(',').filter(Boolean) ?? [], extra)
  return merged.length > 0 ? merged.join(',') : undefined
}

const tagsForPath = (path = '') => {
  const [tagsString] = path.split(`-${CREATOR_DELINIATOR}-`)
  if (!tagsString) return []
  if (tagsString.startsWith(CREATOR_DELINIATOR)) return []

  return tagsString.split('-and-').filter(Boolean).sort()
}

const rawInstructorsForPath = (path = '') => {
  const instructorSplit = path.split(`${CREATOR_DELINIATOR}-`)
  if (instructorSplit.length <= 1) return []

  return instructorSplit[instructorSplit.length - 1]
    .split('-and-')
    .filter(Boolean)
    .sort()
}

const instructorsForPath = (path = '') => {
  return rawInstructorsForPath(path)
    .map((slug) => normalizeInstructorSlug(slug))
    .sort()
}

const readLegacyRefinements = (searchParams: URLSearchParams) => {
  const refinements: Record<string, string[]> = {}
  let hasLegacyRefinements = false

  for (const [key, value] of searchParams.entries()) {
    const match = key.match(LEGACY_REFINEMENT_PATTERN)
    if (!match) continue

    const attribute = match[1]
    if (!SUPPORTED_REFINEMENT_ATTRIBUTES.has(attribute)) continue

    hasLegacyRefinements = true
    const normalizedValue =
      attribute === '_tags' || attribute === 'instructor_name'
        ? nameToSlug(value)
        : value

    refinements[attribute] = appendUnique(refinements[attribute] ?? [], [
      normalizedValue,
    ])
  }

  return {hasLegacyRefinements, refinements}
}

const buildCanonicalSearchHref = ({
  pathname,
  searchParams,
}: {
  pathname: string
  searchParams: URLSearchParams
}) => {
  const all =
    pathname === '/q' ? [] : pathname.replace(/^\/q\/?/, '').split('/')
  const firstPath = all.filter(Boolean)[0] ?? ''
  const {hasLegacyRefinements, refinements} =
    readLegacyRefinements(searchParams)
  const tags = appendUnique(
    tagsForPath(firstPath),
    mergeCsvValues(searchParams.get('tags'), refinements._tags)
      ?.split(',')
      .filter(Boolean) ?? [],
  ).sort()
  const instructors = appendUnique(
    instructorsForPath(firstPath),
    mergeCsvValues(searchParams.get('instructors'), refinements.instructor_name)
      ?.split(',')
      .filter(Boolean)
      .map((slug) => normalizeInstructorSlug(slug)) ?? [],
  ).sort()
  const type = mergeCsvValues(searchParams.get('type'), refinements.type)
  const accessState = mergeCsvValues(
    searchParams.get('access_state'),
    refinements.access_state,
  )
  const q = searchParams.get('q')?.trim() ?? ''
  const sortBy = searchParams.get('sortBy')?.trim() ?? ''
  const page = Number(searchParams.get('page') ?? 1)
  const pathRefinementCount = tags.length + instructors.length
  const canUseCanonicalPath =
    pathRefinementCount <= 1 &&
    !q &&
    !sortBy &&
    (!Number.isFinite(page) || page <= 1) &&
    !type &&
    !accessState

  const pathTags = canUseCanonicalPath ? tags.join('-and-') : ''
  const pathInstructors =
    canUseCanonicalPath && instructors.length
      ? `${pathTags ? '-' : ''}${CREATOR_DELINIATOR}-${instructors.join(
          '-and-',
        )}`
      : ''

  const destinationPathname =
    pathTags || pathInstructors ? `/q/${pathTags}${pathInstructors}` : '/q'

  const destinationQuery = new URLSearchParams()

  if (q) destinationQuery.set('q', q)
  if (type) destinationQuery.set('type', type)
  if (accessState) destinationQuery.set('access_state', accessState)
  if (sortBy) destinationQuery.set('sortBy', sortBy)
  if (Number.isFinite(page) && page > 1) {
    destinationQuery.set('page', String(page))
  }

  if (!canUseCanonicalPath) {
    if (tags.length > 0) destinationQuery.set('tags', tags.join(','))
    if (instructors.length > 0) {
      destinationQuery.set('instructors', instructors.join(','))
    }
  }

  return {
    href: `${destinationPathname}${
      destinationQuery.toString() ? `?${destinationQuery.toString()}` : ''
    }`,
    hasLegacyRefinements,
  }
}

const appendPassthroughSearchParams = ({
  destination,
  originalSearchParams,
}: {
  destination: URL
  originalSearchParams: URLSearchParams
}) => {
  for (const [key, value] of originalSearchParams.entries()) {
    if (LEGACY_REFINEMENT_PATTERN.test(key)) continue
    if (CANONICAL_SEARCH_QUERY_KEYS.has(key)) continue
    destination.searchParams.append(key, value)
  }
}

export function getCanonicalSearchQueryRedirect(
  req: NextRequest,
): NextResponse | null {
  const {pathname, searchParams} = req.nextUrl

  if (pathname !== '/q' && !pathname.startsWith('/q/')) return null

  const canonical = buildCanonicalSearchHref({pathname, searchParams})
  const destination = new URL(canonical.href, req.url)

  appendPassthroughSearchParams({
    destination,
    originalSearchParams: searchParams,
  })

  if (
    destination.pathname === pathname &&
    destination.search === req.nextUrl.search
  ) {
    return null
  }

  console.log(
    JSON.stringify({
      event: 'search.query_canonicalize',
      route_path: pathname,
      destination_pathname: destination.pathname,
      destination_search: destination.search,
      had_legacy_refinements: canonical.hasLegacyRefinements,
      stripped_refinement_keys: Array.from(
        new Set(
          Array.from(searchParams.keys()).filter((key) =>
            LEGACY_REFINEMENT_PATTERN.test(key),
          ),
        ),
      ),
      remaining_query_keys: Array.from(
        new Set(destination.searchParams.keys()),
      ),
    }),
  )

  return NextResponse.redirect(destination)
}
