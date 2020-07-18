import {getAllCourseIds, getCourseData} from '../../lib/courses'
import Link from 'next/link'
import ReactPlayer from '../../components/ReactPlayer'
import get from 'lodash/get'
import Markdown from 'react-markdown'
import fetch from 'unfetch'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function Course({courseData}) {
  const {
    slug,
    path,
    title,
    instructor,
    square_cover_256_url,
    lessons,
  } = courseData
  return (
    <div className="">
      <div>by {instructor.full_name}</div>
      <h1>{courseData.title}</h1>
      <img src={square_cover_256_url} />
      <ul className="list-disc">
        {lessons.map((lesson) => {
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

export async function getStaticPaths() {
  const paths = getAllCourseIds()
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({params}) {
  const courseData = getCourseData(params.id)
  return {
    props: {
      courseData,
    },
  }
}
