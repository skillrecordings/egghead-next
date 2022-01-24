import {SearchState} from 'react-instantsearch-core'
import {first, isEmpty} from 'lodash'

export const typeExtractor = (searchState: SearchState) => {
  if (!isEmpty(searchState.refinementList?.type)) {
    return searchState.refinementList?.type
  }
  const selectedTypes = []

  const terms: string[] = searchQueryToArray(searchState)

  if (terms.length === 1 && selectedTypes.length === 0) {
    selectedTypes.push(first(terms) as string)
  }

  return selectedTypes.filter((type) => type !== 'undefined')
}

export const searchQueryToArray = (searchState: SearchState) => {
  return (searchState?.query || '')
    .trim()
    .split(' ')
    .map((term) => term?.toLowerCase())
}
