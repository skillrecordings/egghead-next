import React from 'react'
import {typeExtractor} from 'utils/search/type-extractor'
import {first} from 'lodash'

const useSelectedType = (initialTopic: any, searchState: any) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [type, setType] = React.useState(initialTopic)

  const selectedTypes: any = typeExtractor(searchState)
  console.log({selectedTypes})
  const newType =
    selectedTypes.length === 1 ? first<string>(selectedTypes) : false

  React.useEffect(() => {
    if (newType) {
      setIsLoading(true)
      setType(newType)
      // loadTag(newType).then((type) => {
      //   setType(type)
      //   setIsLoading(false)
      // })
    } else {
      setType(newType)
    }
  }, [newType])

  return {isLoading, type}
}

export default useSelectedType
