import Link from 'next/link'
import Markdown from 'react-markdown'
import useSWR from 'swr'
import {loadCourse} from '../../lib/courses'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function Course({courseData}) {
  const initialData = courseData
  const {data} = useSWR(courseData.url, fetcher, {initialData})
  const {
    title,
    summary,
    description,
    instructor,
    square_cover_480_url,
    lessons,
    average_rating_out_of_5,
    rating_count,
    watched_count,
  } = data
  const {avatar_64_url} = instructor

  return (
    <div className="">
      <h1>{title}</h1>
      <img src={square_cover_480_url} />
      <img src={avatar_64_url} alt={instructor.full_name} />
      <div>by {instructor.full_name}</div>
      <ul>
        <li>
          Rating: {average_rating_out_of_5.toFixed(1)}/5 by {rating_count}{' '}
          reviewers
        </li>
        <li>Watched: {watched_count} times</li>
      </ul>
      <div>
        <Markdown className="prose">{summary}</Markdown>
      </div>
      <div>
        <Markdown className="prose">{description}</Markdown>
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

export async function getServerSideProps({res, params}) {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  const courseData = await loadCourse(params.slug)

  return {
    props: {
      courseData,
    },
  }
}
