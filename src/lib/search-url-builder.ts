import config from './config'
import last from 'lodash/last'
import get from 'lodash/get'
import qs from 'query-string'
import nameToSlug from './name-to-slug'
import humanize from 'humanize-list'
import {first, pickBy, isEmpty, isUndefined} from 'lodash'
import {normalizeInstructorSlug} from './instructor-slug-aliases'

export const CREATOR_DELINIATOR = 'resources-by'

const nameSlugToName = (slug: string) => {
  const canonicalSlug = normalizeInstructorSlug(slug)
  const nameSplit = canonicalSlug.split('-')
  if (nameSplit.length === 3) {
    nameSplit[1] = nameSplit[1].length === 1 ? `${nameSplit[1]}.` : nameSplit[1]
  }
  return nameSplit.map(toTitleCase).join(' ')
}

const toTitleCase = (name: string) => {
  return name
    .replace('lakomy', 'łakomy')
    .replace('matias hernandez', 'matías hernández')
    .split(' ')
    .map((w) => w[0] && w[0].toUpperCase() + w.substr(1).toLowerCase())
    .join(' ')
}

const tagsForPath = (path: string) => {
  const [tagsString] = path?.split(`-${CREATOR_DELINIATOR}-`) ?? []

  if (isUndefined(tagsString)) return []
  if (tagsString.startsWith(CREATOR_DELINIATOR)) return []

  return tagsString.split('-and-').sort()
}

export const titleFromPath = (all: string[] = []) => {
  const year = new Date().getFullYear()

  if (all.length === 0) {
    return `Courses for Front-End Web Developers`
  }

  const path = all[0] as string
  const hasInstructor = path.includes(CREATOR_DELINIATOR)
  const instructor = last(path.split(`${CREATOR_DELINIATOR}-`))
  const tags = tagsForPath(path)

  const humanizedTags = `${humanize(tags?.map(toTitleCase))}`
  const humanizedInstructors = humanize(
    instructor?.split(`-and-`).map(nameSlugToName),
  )

  if (hasInstructor && instructor) {
    return `${humanizedTags} Courses from ${humanizedInstructors}`
  }

  //TODO: I think we need more tests around tags and years here...

  return `Learn ${humanizedTags}`
}

const instructorsForPath = (path: string) => {
  const instructorSplit = path?.split(`${CREATOR_DELINIATOR}-`)

  return instructorSplit?.length > 1
    ? last(instructorSplit)?.split(`-and-`).map(nameSlugToName)
    : undefined
}

export const createUrl = (searchState: {
  query?: any
  refinementList?: any
  page?: number
  sortBy?: string
}) => {
  const {refinementList, query, page, sortBy} = searchState

  if (isEmpty(refinementList) && isEmpty(query) && isEmpty(sortBy))
    return config.searchUrlRoot

  const tagSlugs = refinementList?._tags
    ? refinementList._tags.map(nameToSlug).sort()
    : []
  const instructorSlugs = refinementList?.instructor_name
    ? refinementList.instructor_name.map(nameToSlug).sort()
    : []
  const pathTags = tagSlugs.join('-and-')
  const pathInstructors = instructorSlugs.length
    ? `${pathTags && '-'}${CREATOR_DELINIATOR}-${instructorSlugs.join('-and-')}`
    : ''
  const type = get(refinementList, 'type')
  const access_state = get(refinementList, 'access_state')
  const canUseCanonicalPath = isCanonicalSearchBrowseState(
    searchState as QueryReturnType,
  )

  const queryString = qs.stringify(
    {
      q: query ? `${query.split(' ').join('+')}` : undefined,
      type: type ? type.join(',') : undefined,
      access_state: access_state ? access_state.join(',') : undefined,
      sortBy,
      ...(page && page > 1 && {page}),
      ...(!canUseCanonicalPath && {
        tags: tagSlugs.length > 0 ? tagSlugs.join(',') : undefined,
        instructors:
          instructorSlugs.length > 0 ? instructorSlugs.join(',') : undefined,
      }),
    },
    {encode: false, sort: false},
  )

  const urlRoot = canUseCanonicalPath
    ? pathTags || pathInstructors
      ? `${config.searchUrlRoot}/${pathTags}${pathInstructors}`
      : config.searchUrlRoot
    : config.searchUrlRoot

  return `${urlRoot}${queryString && `?${queryString}`}`
}

type InitialQueryType = {
  all?: any
  q?: any
  type?: any
  access_state?: any
  page?: number
  sortBy?: string
  tags?: any
  instructors?: any
}

export type QueryReturnType = {
  query?: string
  sortBy?: string
  page?: number
  refinementList: {
    access_state?: string[]
    type?: string[]
    _tags?: string[]
    instructor_name?: string[]
  }
}

const splitCsv = (value?: string) => value?.split(',').filter(Boolean) ?? []

const unique = <T>(values: T[] = []) => Array.from(new Set(values))

const instructorNamesFromQuery = (value?: string) => {
  return splitCsv(value).map(nameSlugToName)
}

export const countPathSearchRefinements = (searchState: QueryReturnType) => {
  return (
    (searchState.refinementList?._tags?.length ?? 0) +
    (searchState.refinementList?.instructor_name?.length ?? 0)
  )
}

export const isCanonicalSearchBrowseState = (searchState: QueryReturnType) => {
  const type = get(searchState, 'refinementList.type', [])
  const accessState = get(searchState, 'refinementList.access_state', [])

  return (
    countPathSearchRefinements(searchState) <= 1 &&
    isEmpty(searchState.query) &&
    isEmpty(searchState.sortBy) &&
    (!searchState.page || searchState.page <= 1) &&
    isEmpty(type) &&
    isEmpty(accessState)
  )
}

export const parseUrl = (query: InitialQueryType): QueryReturnType => {
  if (isEmpty(query)) {
    const refinementList = pickBy({
      access_state: query.access_state,
      type: query.type,
    })

    return pickBy({
      query: query.q,
      page: query.page,
      sortBy: query.sortBy,
      refinementList: isEmpty(refinementList) ? null : refinementList,
    }) as QueryReturnType
  }

  const firstPath: string = first(query.all) as string

  const instructors = unique([
    ...(instructorsForPath(firstPath) ?? []),
    ...instructorNamesFromQuery(query.instructors),
  ])
  const tags = unique([...tagsForPath(firstPath), ...splitCsv(query.tags)])

  const type: string[] = splitCsv(query.type)
  const access_state: string[] = splitCsv(query.access_state)

  return pickBy({
    query: query?.q?.replace('+', ' '),
    sortBy: query.sortBy,
    page: query.page,
    refinementList: pickBy({
      access_state: access_state.length > 0 ? access_state : undefined,
      type: type.length > 0 ? type : undefined,
      _tags: tags,
      instructor_name: instructors.length > 0 ? instructors : undefined,
    }),
  }) as QueryReturnType
}
