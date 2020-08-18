import config from './config'
import last from 'lodash/last'
import get from 'lodash/get'
import qs from 'query-string'
import slugify from 'slugify'
import humanize from 'humanize-list'
import {first, pickBy, isEmpty, compact} from 'lodash'

const toTitleCase = (name: string) => {
  return name
    .split(' ')
    .map((w) => w[0] && w[0].toUpperCase() + w.substr(1).toLowerCase())
    .join(' ')
}

const nameSlugToName = (slug) => {
  const nameSplit = slug.split('-')
  if (nameSplit.length === 3) {
    nameSplit[1] = `${nameSplit[1]}.`
  }
  return nameSplit.map(toTitleCase).join(' ')
}

const tagsForPath = (path) => {
  const tagsSplit = path.split('-lessons-by-')

  return tagsSplit.length > 1 ? tagsSplit[0].split('-and-').sort() : []
}

export const titleFromPath = (all: string[] = []) => {
  const year = new Date().getFullYear()

  if (all.length === 0) {
    return `${config.searchResultCount} Courses for Web Developers in ${year}`
  }

  const path = all[0] as string
  const instructor = last(path.split('lessons-by-'))
  const tags = tagsForPath(path)

  if (instructor) {
    return `${config.searchResultCount}${
      tags ? ` ${humanize(tags.map(toTitleCase))} ` : ' '
    }Courses from ${humanize(
      instructor.split(`-and-`).map(nameSlugToName),
    )} in ${year}`
  } else if (tags) {
    return `${config.searchResultCount}${
      tags ? ` ${humanize(tags.map(toTitleCase))} ` : ' '
    }Courses for Web Developers in ${year}`
  }
  return `${config.searchResultCount} Courses for Web Developers`
}

export const createUrl = (searchState) => {
  const {refinementList, query} = searchState

  console.log(JSON.stringify(searchState))

  if (isEmpty(refinementList) && isEmpty(query)) return config.searchUrlRoot

  const nameToSlug = (name: string) =>
    slugify(name.toLowerCase(), {remove: /[*+~.()'"!:@]/g})
  const tags = refinementList?._tags
    ? `${refinementList._tags.map(nameToSlug).join('-and-')}`
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

export const parseUrl = (query) => {
  if (isEmpty(query)) return query
  let instructorSplit
  let tags
  let instructors

  if (compact(query.all)) {
    const firstPath: string = first(query.all) as string
    instructorSplit = last(firstPath.split('lessons-by-'))
    tags = tagsForPath(firstPath)
    instructors = compact(instructorSplit.split(`-and-`).map(nameSlugToName))
  }

  const parseTypes = (type) => {
    return type?.split(',')
  }

  const type: string[] = parseTypes(query.type)

  return pickBy({
    query: query.q,
    refinementList: pickBy({type, _tags: tags, instructor_name: instructors}),
  })
}
