import Link from 'next/link'
import {loadAllCourses} from '@lib/courses'

function CourseCard({course}) {
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

export default function Courses({allCourses}) {
  return (
    <div className="grid grid-cols-3 gap-5">
      {allCourses.map((course) => (
        <CourseCard key={course.slug} course={course}></CourseCard>
      ))}
    </div>
  )
}

export async function getServerSideProps({res}) {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  const allCourses = await loadAllCourses()

  return {
    props: {
      allCourses,
    },
  }
}
