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
    <div>
      <img
        src={square_cover_480_url}
        className="mx-auto"
        alt={`illustration for ${title}`}
      />
      <h1 className="my-8 text-center sm:text-5xl text-4xl font-bold leading-tight">
        {title}
      </h1>
      <div className="flex items-center justify-center flex-wrap sm:gap-8 gap-5">
        <div className="flex items-center">
          <div className="overflow-hidden rounded-full w-12 h-12">
            <img src={avatar_64_url} alt={`photo of ${instructor.full_name}`} />
          </div>
          <span className="ml-2">{instructor.full_name}</span>
        </div>
        <div>
          Rating: {average_rating_out_of_5.toFixed(1)}/5 by {rating_count}{' '}
          reviewers
        </div>
        <div>Watched: {watched_count} times</div>
      </div>
      <div className="prose lg:prose-xl max-w-none my-8">
        <Markdown>{summary}</Markdown>
        <Markdown>{description}</Markdown>
        <h3>Lessons in this course</h3>
        <ul>
          {lessons.map((lesson) => {
            return (
              <li key={lesson.slug}>
                <Link href={`/lessons/[id]`} as={lesson.path}>
                  <a>{lesson.title}</a>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
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
