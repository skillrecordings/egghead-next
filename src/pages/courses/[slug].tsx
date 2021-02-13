import * as React from 'react'
import useSWR from 'swr'
import {loadCourse} from 'lib/courses'
import {loadPlaylist} from 'lib/playlists'
import {FunctionComponent} from 'react'
import {GetServerSideProps} from 'next'
import fetcher from 'utils/fetcher'
import CollectionPageLayout from 'components/layouts/collection-page-layout'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

type CourseProps = {
  course: any
}

const Course: FunctionComponent<CourseProps> = ({course: initialCourse}) => {
  const {data} = useSWR(`${initialCourse.url}`, fetcher)

  const course = {...data, ...initialCourse}

  console.debug(`course loaded`, course)

  const {slug, lessons} = course
  const items = get(course, 'items', [])

  const courseLessons = isEmpty(lessons)
    ? filter(items, (item) => {
        return ['lesson', 'talk'].includes(item.type)
      })
    : lessons

  return (
    <CollectionPageLayout
      lessons={courseLessons}
      course={course}
      ogImageUrl={`https://og-image-egghead-course.now.sh/${slug}?v=20201027`}
    />
  )
}

export default Course

export const getServerSideProps: GetServerSideProps = async ({res, params}) => {
  const course =
    params &&
    (process.env.NEXT_PUBLIC_PLAYLISTS_ARE_COURSES === 'true'
      ? await loadPlaylist(params.slug as string)
      : await loadCourse(params.slug as string))

  if (course && course?.slug !== params?.slug) {
    res.setHeader('Location', course.path)
    res.statusCode = 302
    res.end()
    return {props: {}}
  } else {
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
    return {
      props: {
        course,
      },
    }
  }
}
