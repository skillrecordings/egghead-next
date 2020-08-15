import config from './config'
import last from 'lodash/last'

export const buildTitleFromUrl = (url: string) => {
  const instructors = last(url.split('/i/'))

  if (instructors === 'kent-c-dodds') {
    return `${config.searchResultCount} Badass Courses from Kent C. Dodds`
  }
  return `${config.searchResultCount} Badass Courses`
}
