import Link from 'next/link'
import {loadAllCourses} from '@lib/courses'
import {FunctionComponent} from 'react'
import {GetServerSideProps} from 'next'

type CourseCardProps = {
  course: any
}

const CourseCard: FunctionComponent<CourseCardProps> = ({course}) => {
  return (
    <Link href={`/courses/[slug]`} as={`/courses/${course.slug}`}>
      <a className="rounded-lg border border-gray-200 p-5 hover:shadow-lg">
        <div className="sm:p-8 p-5">
          <img
            loading="lazy"
            src={course.square_cover_480_url}
            alt={`illustration for ${course.title}`}
          />
        </div>
        <div className="pt-5">
          <div className="font-bold text-xl leading-tight text-center mb-2">
            {course.title}
          </div>
          {/* <p className="text-gray-700 text-base truncate">
              {course.description}
            </p> */}
        </div>
      </a>
    </Link>
  )
}

type CoursesProps = {
  courses: any[]
}

const Courses: FunctionComponent<CoursesProps> = ({courses}) => {
  return (
    <div className="grid grid-cols-3 gap-5">
      {courses.map((course: any) => (
        <CourseCard key={course.slug} course={course}></CourseCard>
      ))}
    </div>
  )
}

export default Courses

export const getServerSideProps: GetServerSideProps = async ({res, params}) => {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  const courses = await loadAllCourses()

  return {
    props: {
      courses,
    },
  }
}
