import {getAllCourseIds, getCourseData} from '../../lib/courses'
import Link from 'next/link'
import ReactPlayer from '../../components/ReactPlayer'
import get from 'lodash/get'
import Markdown from 'react-markdown'
import fetch from 'unfetch'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function Course({courseData}) {
  const initialData = courseData
  const {data} = useSWR(courseData.url, fetcher, {initialData})
  const {
    title,
    summary,
    instructor,
    square_cover_256_url,
    lessons,
    rating_out_of_5,
    rating_count,
    watched_count,
  } = data
  const {avatar_64_url} = instructor

  return (
    <div className="">
      <h1>{title}</h1>
      <img src={square_cover_256_url} />
      <img src={avatar_64_url} alt={instructor.full_name} />
      <div>by {instructor.full_name}</div>
      <ul>
        <li>
          Rating: {rating_out_of_5.toFixed(1)}/5 by {rating_count} reviewers
        </li>
        <li>Watched: {watched_count} times</li>
      </ul>
      <div>
        <Markdown>{summary}</Markdown>
      </div>
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
