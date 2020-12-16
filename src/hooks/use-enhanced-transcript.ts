import fetcher from 'utils/fetcher'
import {get} from 'lodash'
import useSWR from 'swr'

export const useEnhancedTranscript = (url: string) => {
  const {data: transcriptData} = useSWR(url, fetcher)
  const enhancedTranscript = get(transcriptData, 'text')
  return {enhancedTranscript}
}
