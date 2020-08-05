import Link from 'next/link'
import {loadAllCourses} from '../../lib/courses'

function CourseCard({course}) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <img
        className="w-full"
        src={course.square_cover_480_url}
        alt={course.title}
      ></img>
      <div className="px-6 py-4">
        <Link href={`/courses/[slug]`} as={`/courses/${course.slug}`}>
          <div className="font-bold text-xl mb-2">
            <a>{course.title}</a>
          </div>
        </Link>
        <p className="text-gray-700 text-base truncate">{course.description}</p>
      </div>
    </div>
  )
}

export default function Courses({allCourses}) {
  return (
    <div className="flex flex-wrap">
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
