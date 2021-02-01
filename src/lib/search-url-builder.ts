import config from './config'
import last from 'lodash/last'
import get from 'lodash/get'
import qs from 'query-string'
import nameToSlug from './name-to-slug'
import humanize from 'humanize-list'
import {first, pickBy, isEmpty, isUndefined} from 'lodash'

export const CREATOR_DELINIATOR = 'resources-by'

const nameSlugToName = (slug: string) => {
  const nameSplit = slug.split('-')
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
    return `Resources for Web Developers in ${year}`
  }

  const path = all[0] as string
  const hasInstructor = path.includes(CREATOR_DELINIATOR)
  const instructor = last(path.split(`${CREATOR_DELINIATOR}-`))
  const tags = tagsForPath(path)

  const count = config.searchResultCount
  const humanizedTags = `${humanize(tags?.map(toTitleCase))}`
  const humanizedInstructors = humanize(
    instructor?.split(`-and-`).map(nameSlugToName),
  )

  if (hasInstructor && instructor) {
    return `${humanizedTags} Resources from ${humanizedInstructors} in ${year}`
  }

  //TODO: I think we need more tests around tags and years here...

  return `${count}+ ${humanizedTags} Resources for Web Developers in ${year}`
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
}) => {
  const {refinementList, query, page} = searchState

  if (isEmpty(refinementList) && isEmpty(query)) return config.searchUrlRoot

  const tags = refinementList?._tags
    ? `${refinementList._tags.map(nameToSlug).sort().join('-and-')}`
    : ''
  const type = get(refinementList, 'type')

  const queryString = qs.stringify({
    q: query ? `${query.split(' ').join('+')}` : undefined,
    type: type ? type.join(',') : undefined,
    ...(page && page > 1 && {page}),
  })

  const instructors = refinementList?.instructor_name
    ? `${
        tags && '-'
      }${CREATOR_DELINIATOR}-${refinementList?.instructor_name
        .map(nameToSlug)
        .sort()
        .join('-and-')}`
    : ''

  const urlRoot = `${config.searchUrlRoot}/${tags}${instructors}`
  return `${urlRoot}${queryString && `?${queryString}`}`
}

export const parseUrl = (query: {
  all?: any
  q?: any
  type?: any
  page?: number
}) => {
  if (isEmpty(query)) return query
  const firstPath: string = first(query.all) as string

  const instructors = instructorsForPath(firstPath)
  const tags = tagsForPath(firstPath)

  const type: string[] = query.type?.split(',')

  return pickBy({
    query: query?.q?.replace('+', ' '),
    page: query.page,
    refinementList: pickBy({
      type,
      _tags: tags,
      instructor_name: instructors,
    }),
  })
}
