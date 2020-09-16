import config from './config'
import last from 'lodash/last'
import get from 'lodash/get'
import qs from 'query-string'
import nameToSlug from './name-to-slug'
import humanize from 'humanize-list'
import {first, pickBy, isEmpty} from 'lodash'

const resourceTypes = {
  resource: 'resources',
  lessons: 'lessons',
  talks: 'talks',
  podcasts: 'podcasts',
  collections: 'collections',
}

const nameSlugToName = (slug: string) => {
  const nameSplit = slug.split('-')
  if (nameSplit.length === 3) {
    nameSplit[1] = nameSplit[1].length == 1 ? `${nameSplit[1]}.` : nameSplit[1]
  }
  return nameSplit.map(toTitleCase).join(' ')
}

const toTitleCase = (name: string) => {
  return name
    .replace('lakomy', 'łakomy')
    .split(' ')
    .map((w) => w[0] && w[0].toUpperCase() + w.substr(1).toLowerCase())
    .join(' ')
}

const tagsForPath = (path: string) => {
  const tagsSplit = path?.split('-lessons-by-') || []

  const tags = tagsSplit.length >= 1 ? tagsSplit[0].split('-and-').sort() : []

  return isEmpty(tags) ? undefined : tags
}

export const titleFromPath = (all: string[] = []) => {
  const year = new Date().getFullYear()

  if (all.length === 0) {
    return `${config.searchResultCount} Courses for Web Developers in ${year}`
  }

  const path = all[0] as string
  const instructor = last(path.split('lessons-by-'))
  const tags = tagsForPath(path)

  const count = config.searchResultCount
  const humanizedTags = ` ${humanize(tags?.map(toTitleCase))} `
  const humanizedInstructors = humanize(
    instructor?.split(`-and-`).map(nameSlugToName),
  )

  if (instructor) {
    return `${count}${humanizedTags}Courses from ${humanizedInstructors} in ${year}`
  }

  //TODO: I think we need more tests around tags and years here...

  return `${count}${humanizedTags} Courses for Web Developers`
}

const instructorsForPath = (path: string) => {
  const instructorSplit = path?.split('lessons-by-')

  return instructorSplit?.length > 1
    ? last(instructorSplit)?.split(`-and-`).map(nameSlugToName)
    : undefined
}

export const createUrl = (searchState: {query?: any; refinementList?: any}) => {
  const {refinementList, query} = searchState

  if (isEmpty(refinementList) && isEmpty(query)) return config.searchUrlRoot

  const tags = refinementList?._tags
    ? `${refinementList._tags.map(nameToSlug).sort().join('-and-')}`
    : ''
  const type = get(refinementList, 'type')

  const queryString = qs.stringify({
    q: query ? `${query.split(' ').join('+')}` : undefined,
    type: type ? type.join(',') : undefined,
  })

  const instructors = refinementList?.instructor_name
    ? `${tags && '-'}lessons-by-${refinementList?.instructor_name
        .map(nameToSlug)
        .sort()
        .join('-and-')}`
    : ''

  const urlRoot = `${config.searchUrlRoot}/${tags}${instructors}`
  return `${urlRoot}${queryString && `?${queryString}`}`
}

export const parseUrl = (query: {all?: any; q?: any; type?: any}) => {
  if (isEmpty(query)) return query
  const firstPath: string = first(query.all) as string

  const instructors = instructorsForPath(firstPath)
  const tags = tagsForPath(firstPath)

  const type: string[] = query.type?.split(',')

  return pickBy({
    query: query?.q?.replace('+', ' '),
    refinementList: pickBy({
      type,
      _tags: tags,
      instructor_name: instructors,
    }),
  })
}
