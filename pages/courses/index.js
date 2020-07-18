import Link from 'next/link'
import {getAllCourseIds} from '../../lib/courses'

export async function getStaticProps() {
  const allCourseData = getAllCourseIds()
  return {
    props: {
      allCourseData,
    },
  }
}

export default function Courses({allCourseData}) {
  return (
    <div>
      {allCourseData.map(({params}) => {
        const {slug, path, title, instructor, square_cover_64_url} = params
        return (
          <div key={slug} className="p-5">
            <Link href={`/courses/[id]`} as={path}>
              <a className="no-underline hover:underline text-blue-500">
                {title}
              </a>
            </Link>
            <div>by {instructor.full_name}</div>
            {square_cover_64_url && (
              <div>
                <img src={square_cover_64_url} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
