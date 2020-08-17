import config from './config'
import last from 'lodash/last'
import qs from 'query-string'

export const buildTitleFromUrl = (url: string) => {
  const instructors = last(url.split('/i/'))

  if (instructors === 'kent-c-dodds') {
    return `${config.searchResultCount} Badass Courses from Kent C. Dodds`
  }
  return `${config.searchResultCount} Badass Courses`
}

function getCategorySlug(name) {
  return name.split(' ').map(encodeURIComponent).join('+')
}

// Returns a name from the category slug.
// The "+" are replaced by spaces and other
// characters are decoded.
function getCategoryName(slug) {
  return slug.split('+').map(decodeURIComponent).join(' ')
}

export const createUrl = (searchState) => {
  const {refinementList, query} = searchState
  const tags = refinementList?._tags
    ? `/in~/${refinementList._tags.map(getCategorySlug).join('~')}`
    : ''
  const instructors = refinementList?.instructor_name
    ? `/by~/${refinementList?.instructor_name.map(getCategorySlug).join('~')}`
    : ''
  const type = refinementList?.type
    ? `/t~/${refinementList?.type.map(getCategorySlug).join('~')}`
    : ''
  const q = query ? `/q~/${getCategorySlug(query)}` : ''

  return `${config.searchUrlRoot}${q}${type}${tags}${instructors}`
}

export const parseUrl = (location) => {
  const querySplit = location.pathname.split('q~/')
  const instructorSplit = location.pathname.split('by~/')
  const typesSplit = location.pathname.split('t~/')
  const tagsSplit = location.pathname.split('in~/')

  let query = ''
  let tags = []
  let instructors = []
  let types = []

  if (querySplit.length > 1) {
    query = querySplit[querySplit.length - 1].split('/')[0].split('+').join(' ')
  }

  if (instructorSplit.length > 1) {
    instructors = instructorSplit[instructorSplit.length - 1]
      .split('/')[0]
      .split('~')
      .map((name) => name.split('+').join(' '))
  }

  if (typesSplit.length > 1) {
    types = typesSplit[1].split('/')[0].split('+')
  }

  if (tagsSplit.length > 1) {
    tags = tagsSplit[1]
      .split('/')[0]
      .split('~')
      .map((name) => name.split('+').join(' '))
  }

  return {
    query,
    tags,
    instructors,
    types,
  }
}
