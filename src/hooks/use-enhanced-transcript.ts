import fetcher from 'utils/fetcher'
import useSWR from 'swr'

export const useEnhancedTranscript = (url: string) => {
  const {data: transcriptData} = useSWR(url, fetcher)
  const enhancedTranscript = transcriptData?.text
  return enhancedTranscript
}
