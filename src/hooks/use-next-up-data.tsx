import fetcher from 'utils/fetcher'
import {get} from 'lodash'
import useSWR from 'swr'

export const useNextForCollection = (
  collection: any,
  currentItemSlug: string,
) => {
  const lessons = collection?.lessons || []

  const lessonSlugs = lessons.map((lesson: any) => {
    return lesson.slug
  })
  const indexOfCurrent = lessonSlugs.indexOf(currentItemSlug)

  if (indexOfCurrent < lessons.length - 1) {
    return lessons[indexOfCurrent + 1]
  } else {
    return false
  }
}

export const useNextUpData = (url: string) => {
  const {data: nextUpData} = useSWR(url, fetcher)

  const nextUpPath = get(nextUpData, 'next_lesson')
  const nextLessonTitle = get(nextUpData, 'next_lesson_title')

  return {nextUpData, nextUpPath, nextLessonTitle, nextUpLoading: !nextUpData}
}
