import fetcher from '@/utils/fetcher'
import get from 'lodash/get'
import useSWR from 'swr'

export const useNextForCollectionSection = (
  collection: any,
  currentItemSlug: string,
) => {
  const lessonsList: any[] = collection?.sections?.reduce(
    (acc: any[], cur: any) => {
      return [...acc, ...cur.lessons]
    },
    [],
  )

  const lessonSlugs = lessonsList?.map((lesson: any) => {
    return lesson.slug
  })
  const indexOfCurrent = lessonSlugs?.indexOf(currentItemSlug)

  if (indexOfCurrent < lessonsList?.length - 1) {
    return lessonsList[indexOfCurrent + 1]
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
