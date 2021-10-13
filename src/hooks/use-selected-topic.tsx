import React from 'react'
import {topicExtractor} from 'utils/search/topic-extractor'
import {loadTag} from 'lib/tags'
import {first} from 'lodash'

const useSelectedTopic = (initialTopic: any, searchState: any) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [topic, setTopic] = React.useState(initialTopic)

  const selectedTopics: any = topicExtractor(searchState)
  const newTopic =
    selectedTopics.length === 1 ? first<string>(selectedTopics) : false

  React.useEffect(() => {
    if (newTopic) {
      setIsLoading(true)

      loadTag(newTopic).then((topic) => {
        setTopic(topic)
        setIsLoading(false)
      })
    } else {
      setTopic(newTopic)
    }
  }, [newTopic])

  return [isLoading, topic]
}

export default useSelectedTopic
