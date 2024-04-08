import {QueryReturnType} from '@/lib/search-url-builder'
import {first, isEmpty} from 'lodash'

export const topicExtractor = (searchState: QueryReturnType) => {
  if (!isEmpty(searchState?.refinementList?._tags)) {
    return searchState?.refinementList?._tags
  }
  const selectedTopics = []

  const terms: string[] = searchQueryToArray(searchState)

  if (terms.length === 1 && selectedTopics.length === 0) {
    selectedTopics.push(first(terms) as string)
  }

  return selectedTopics.filter((topic) => topic !== 'undefined')
}

export const searchQueryToArray = (searchState: QueryReturnType) => {
  return (searchState?.query || '')
    .trim()
    .split(' ')
    .map((term) => term?.toLowerCase())
}
