import {getAllCourseIds, getCourseData} from '../../lib/courses'
import Link from 'next/link'
import ReactPlayer from '../../components/ReactPlayer'
import get from 'lodash/get'
import Markdown from 'react-markdown'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function Course({courseData}) {
  const {title, instructor, square_cover_256_url, lessons_url} = courseData

  // the endpoint for a series is too slow when it loads lessons
  // consider a v3?
  const {data: lessons} = useSWR(lessons_url, fetcher)

  return (
    <div className="">
      <div>by {instructor.full_name}</div>
      <h1>{title}</h1>
      <img src={square_cover_256_url} />
      <ul className="list-disc">
        {lessons &&
          lessons.map((lesson) => {
            return (
              <li key={lesson.slug}>
                <Link href={`/lessons/[id]`} as={lesson.path}>
                  <a className="no-underline hover:underline text-blue-500">
                    {lesson.title}
                  </a>
                </Link>
              </li>
            )
          })}
      </ul>
    </div>
  )
}

export async function getServerSideProps({params}) {
  const res = await fetch(`https://egghead.io/api/v1/series/${params.id}`)
  let courseData = await res.json()
  courseData = {
    ...courseData,
    id: params.id,
  }
  return {
    props: {
      courseData,
    },
  }
}
