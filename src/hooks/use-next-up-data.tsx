import fetcher from 'utils/fetcher'
import {get} from 'lodash'
import useSWR from 'swr'

export const useNextUpData = (url: string) => {
  const {data: nextUpData} = useSWR(url, fetcher)
  const nextUpPath = get(nextUpData, 'next_lesson')
  const nextLessonTitle = get(nextUpData, 'next_lesson_title')
  return {nextUpData, nextUpPath, nextLessonTitle, nextUpLoading: !nextUpData}
}
