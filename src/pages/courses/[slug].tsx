import * as React from 'react'
import useSWR from 'swr'
import {loadCourse} from 'lib/courses'
import {FunctionComponent} from 'react'
import {GetServerSideProps} from 'next'
import fetcher from 'utils/fetcher'
import CollectionPageLayout from 'components/layouts/collection-page-layout'

type CourseProps = {
  course: any
}

const Course: FunctionComponent<CourseProps> = ({course: initialCourse}) => {
  const {data} = useSWR(`${initialCourse.url}`, fetcher)

  const course = {...data, ...initialCourse}

  const {slug, lessons} = course

  return (
    <CollectionPageLayout
      lessons={lessons}
      course={course}
      ogImageUrl={`https://og-image-egghead-course.now.sh/${slug}?v=20201027`}
    />
  )
}

export default Course

export const getServerSideProps: GetServerSideProps = async ({res, params}) => {
  const course = params && (await loadCourse(params.slug as string))

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
