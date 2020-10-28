import Link from 'next/link'
import Markdown from 'react-markdown'
import useSWR from 'swr'
import {loadCourse} from 'lib/courses'
import {FunctionComponent} from 'react'
import {GetServerSideProps} from 'next'
import {NextSeo} from 'next-seo'
import removeMarkdown from 'remove-markdown'

const fetcher = (url: RequestInfo) => fetch(url).then((r) => r.json())

type CourseProps = {
  course: any
}

const Course: FunctionComponent<CourseProps> = ({course}) => {
  const initialData = course
  const {data} = useSWR(course.url, fetcher, {initialData})
  const {
    title,
    slug,
    summary,
    description,
    instructor,
    square_cover_480_url,
    lessons,
    average_rating_out_of_5,
    rating_count,
    watched_count,
    http_url,
  } = data
  const {avatar_64_url} = instructor

  return (
    <div>
      <NextSeo
        description={removeMarkdown(summary)}
        canonical={http_url}
        title={title}
        titleTemplate={'%s | egghead.io'}
        twitter={{
          handle: instructor.twitter,
          site: `@eggheadio`,
          cardType: 'summary_large_image',
        }}
        openGraph={{
          title,
          url: http_url,
          description: removeMarkdown(summary),
          site_name: 'egghead',
          images: [
            {
              url: `https://og-image-egghead-course.now.sh/${slug}?v=20201027`,
            },
          ],
        }}
      />
      <img
        src={square_cover_480_url}
        className="mx-auto"
        alt={`illustration for ${title}`}
      />
      <h1 className="my-8 text-center sm:text-5xl text-4xl font-bold">
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
          {lessons.map((lesson: any) => {
            return (
              <li key={lesson.slug}>
                <Link href={lesson.path}>
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

export default Course

export const getServerSideProps: GetServerSideProps = async ({res, params}) => {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  const course = params && (await loadCourse(params.slug as string))

  return {
    props: {
      course,
    },
  }
}
