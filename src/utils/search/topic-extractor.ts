import {SearchState} from 'react-instantsearch-core'
import {first} from 'lodash'

export const topicExtractor = (searchState: SearchState) => {
  const selectedTopics = searchState.refinementList?._tags || []

  const terms: string[] = searchQueryToArray(searchState)

  if (terms.length === 1 && selectedTopics.length === 0) {
    selectedTopics.push(first(terms) as string)
  }

  return selectedTopics
}

export const searchQueryToArray = (searchState: SearchState) => {
  return (searchState?.query || '').trim().split(' ')
}
