import config from './config'
import last from 'lodash/last'
import get from 'lodash/get'
import qs from 'query-string'
import slugify from 'slugify'
import humanize from 'humanize-list'

const toTitleCase = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
    .join(' ')

const nameSlugToName = (slug) => {
  const nameSplit = slug.split('-')
  if (nameSplit.length === 3) {
    nameSplit[1] = `${nameSplit[1]}.`
  }
  return nameSplit.map(toTitleCase).join(' ')
}

const tagsForPath = (path) => {
  const tagsSplit = path.split('-lessons-by-')

  return tagsSplit.length > 1
    ? tagsSplit[0].split('/s/')[1].split('-and-').sort()
    : []
}

export const buildTitleFromUrl = (path: string) => {
  const instructor = last(path.split('lessons-by-'))
  const tags = tagsForPath(path)

  if (instructor) {
    return `${config.searchResultCount} Badass${
      tags ? ` ${humanize(tags.map(toTitleCase), {oxfordComma: true})} ` : ' '
    }Courses from ${nameSlugToName(instructor)}`
  }
  return `${config.searchResultCount} Badass Courses`
}

export const createUrl = (searchState) => {
  const {refinementList, query} = searchState
  const nameToSlug = (name: string) =>
    slugify(name.toLowerCase(), {remove: /[*+~.()'"!:@]/g})
  const tags = refinementList?._tags
    ? `${refinementList._tags.map(nameToSlug).join('-and-')}`
    : ''
  const types = get(refinementList, 'types')

  const queryString = qs.stringify({
    q: query ? `${query.split(' ').join('+')}` : undefined,
    types: types ? types.join(',') : undefined,
  })

  const instructors = refinementList?.instructor_name
    ? `${tags && '-'}lessons-by-${refinementList?.instructor_name
        .map(nameToSlug)
        .join('-and-')}`
    : ''

  const urlRoot = `${config.searchUrlRoot}/${tags}${instructors}`
  return `${urlRoot}${queryString && `?${queryString}`}`
}

export const parseUrl = (location) => {
  const instructorSplit = last(location.pathname.split('lessons-by-'))
  const queryParams = qs.parse(location.search)

  const parseTypes = (types) => {
    return types?.split(',')
  }

  const types: string[] = parseTypes(queryParams.types)

  let tags = tagsForPath(location.pathname)
  let instructors = [nameSlugToName(instructorSplit)]

  return {
    query: queryParams.q,
    types,
    tags,
    instructors,
  }
}
