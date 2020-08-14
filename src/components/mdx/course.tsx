import useSWR from 'swr'
import {loadCourse} from '@lib/courses'
import Link from 'next/link'

const CourseWidget = ({slug}) => {
  const {data} = useSWR(slug, loadCourse)
  return (
    <div>
      {data && (
        <>
          <Link href="/courses/[slug]" as={data.path}>
            <a>
              <img className="w-64" src={data.square_cover_480_url} />
              {data.title}
            </a>
          </Link>{' '}
          by {data.instructor.full_name}
        </>
      )}
    </div>
  )
}

export default CourseWidget
