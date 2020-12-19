import fetcher from 'utils/fetcher'
import useSWR from 'swr'

export const useEnhancedTranscript = (url: string) => {
  const {data} = useSWR(url, fetcher)
  return data?.text
}
