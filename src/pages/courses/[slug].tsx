import * as React from 'react'
import useSWR from 'swr'
import {loadCourse} from 'lib/courses'
import {FunctionComponent} from 'react'
import {GetServerSideProps} from 'next'
import fetcher from 'utils/fetcher'
import CoursePageLayout from 'components/pages/courses/course-page-layout'
import useLastResource from '../../hooks/use-last-resource'

type CourseProps = {
  course: any
}

const Course: FunctionComponent<CourseProps> = ({course: initialCourse}) => {
  const {data} = useSWR(initialCourse.url, fetcher)

  const course = {...initialCourse, ...data}

  const {slug, lessons} = course

  useLastResource({
    ...course,
    type: `course`,
    image_url: course.square_cover_480_url,
  })

  return (
    <CoursePageLayout
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
