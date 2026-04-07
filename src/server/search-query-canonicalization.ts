import {NextRequest, NextResponse} from 'next/server'

const CREATOR_DELINIATOR = 'resources-by'
const LEGACY_REFINEMENT_PATTERN = /^refinementList\[([^\]]+)\](?:\[(?:\d+)?\])?$/
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

const tagsForPath = (path = '') => {
  const [tagsString] = path.split(`-${CREATOR_DELINIATOR}-`)
  if (!tagsString) return []
  if (tagsString.startsWith(CREATOR_DELINIATOR)) return []

  return tagsString.split('-and-').filter(Boolean).sort()
}

const instructorsForPath = (path = '') => {
  const instructorSplit = path.split(`${CREATOR_DELINIATOR}-`)
  if (instructorSplit.length <= 1) return []

  return instructorSplit[instructorSplit.length - 1]
    .split('-and-')
    .filter(Boolean)
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

const buildCanonicalSearchPath = ({
  pathname,
  searchParams,
}: {
  pathname: string
  searchParams: URLSearchParams
}) => {
  const all = pathname === '/q' ? [] : pathname.replace(/^\/q\/?/, '').split('/')
  const firstPath = all.filter(Boolean)[0] ?? ''
  const {hasLegacyRefinements, refinements} = readLegacyRefinements(searchParams)

  if (!hasLegacyRefinements) return null

  const tags = appendUnique(tagsForPath(firstPath), refinements._tags).sort()
  const instructors = appendUnique(
    instructorsForPath(firstPath),
    refinements.instructor_name,
  ).sort()
  const type = appendUnique(
    (searchParams.get('type') ?? '').split(',').filter(Boolean),
    refinements.type,
  )
  const accessState = appendUnique(
    (searchParams.get('access_state') ?? '').split(',').filter(Boolean),
    refinements.access_state,
  )
  const q = searchParams.get('q')?.trim() ?? ''
  const sortBy = searchParams.get('sortBy')?.trim() ?? ''
  const page = Number(searchParams.get('page') ?? 1)

  const pathTags = tags.join('-and-')
  const pathInstructors = instructors.length
    ? `${pathTags ? '-' : ''}${CREATOR_DELINIATOR}-${instructors.join('-and-')}`
    : ''
  const destinationPathname = `/q${
    pathTags || pathInstructors ? `/${pathTags}${pathInstructors}` : ''
  }`

  const queryParts: string[] = []
  if (q) queryParts.push(`q=${encodeURIComponent(q)}`)
  if (type.length > 0) {
    queryParts.push(
      `type=${type.map((value) => encodeURIComponent(value)).join(',')}`,
    )
  }
  if (accessState.length > 0) {
    queryParts.push(
      `access_state=${accessState
        .map((value) => encodeURIComponent(value))
        .join(',')}`,
    )
  }
  if (sortBy) queryParts.push(`sortBy=${encodeURIComponent(sortBy)}`)
  if (Number.isFinite(page) && page > 1) queryParts.push(`page=${page}`)

  return {
    destinationPathname,
    queryString: queryParts.join('&'),
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

  const canonical = buildCanonicalSearchPath({pathname, searchParams})
  if (!canonical) return null

  const destination = new URL(canonical.destinationPathname, req.url)
  if (canonical.queryString) {
    destination.search = canonical.queryString
  }
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
      stripped_refinement_keys: Array.from(
        new Set(
          Array.from(searchParams.keys()).filter((key) =>
            LEGACY_REFINEMENT_PATTERN.test(key),
          ),
        ),
      ),
      remaining_query_keys: Array.from(new Set(destination.searchParams.keys())),
    }),
  )

  return NextResponse.redirect(destination)
}
