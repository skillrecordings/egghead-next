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

const StarIcon: FunctionComponent<{className?: string}> = ({className}) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" className="nc-icon-wrapper">
        <path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z"
          fill="#4B5563"
        />
      </g>
    </svg>
  )
}

const UserRating: FunctionComponent<{
  className: string
  rating: number
  count: number
}> = ({className, rating, count}) => {
  return (
    <div className={className + ' flex space-x-3'}>
      <div className="flex">
        {/* TODO: Find proper "half-star" icons */}
        <StarIcon></StarIcon>
        <StarIcon></StarIcon>
        <StarIcon></StarIcon>
        <StarIcon></StarIcon>
        <StarIcon></StarIcon>
      </div>
      <div>Rating: {rating.toFixed(1)}</div>

      <div>{count} ratings</div>
    </div>
  )
}

const PrimaryTag: FunctionComponent<{version?: string}> = ({version}) => {
  return <div>Primary Tag</div>
}

const PlayIcon: FunctionComponent<{className: string}> = ({className}) => {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" className="nc-icon-wrapper">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM9.555 7.168A1 1 0 0 0 8 8v4a1 1 0 0 0 1.555.832l3-2a1 1 0 0 0 0-1.664l-3-2z"
          fill="#4B5563"
        />
      </g>
    </svg>
  )
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
    primary_tag,
  } = data

  const {
    full_name,
    avatar_64_url,
    slug: instructor_slug,
    bio_short,
    twitter,
  } = instructor

  const {name: tagName, image_url: tagImage, slug: tagSlug} = primary_tag

  const InstructorLink: FunctionComponent<{className?: string}> = ({
    children,
    className,
  }) => (
    <Link href={`/s/${instructor_slug}`}>
      <a className={className}>{children}</a>
    </Link>
  )

  return (
    <>
      {/* Look into exporting layouts like MDX does rather than using "absolute" */}

      <header className="grid md:grid-cols-5 grid-cols-1 bg-gray-100 p-8 w-full left-0 mb-4">
        <div className="col-span-3 flex flex-col max-w-screen-2xl w-full mx-auto">
          <h1 className="text-2xl leading-tight">{title}</h1>
          <h2>Catchy tagline...</h2>
          <div className="flex">
            <UserRating
              className="mr-3"
              rating={average_rating_out_of_5}
              count={rating_count}
            ></UserRating>
            <Link href={`/s/${tagSlug}`}>
              <a className="flex">
                <img className="w-6" src={tagImage} alt="" />
                <div>{tagName}</div>
              </a>
            </Link>
          </div>
          <div className="flex flex-col">
            <InstructorLink className="py-2">
              <div>{full_name}</div>
            </InstructorLink>
            <div>{summary}</div>
          </div>
        </div>
        <div className="col-span-2 flex flex-col items-center justify-center">
          <img src={square_cover_480_url} alt="" className="max-w-xs" />
          <button className="flex items-center">
            <PlayIcon className="flex-shrink-0"></PlayIcon>
            Preview this course
          </button>
        </div>
      </header>

      <main className="grid md:grid-cols-5 grid-cols-1">
        {/* TODO: Plan course dependencies migration? */}

        {/* LEFT COLUMN */}
        <div className="col-span-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xl mb-2">Course content</h2>
            <div>{lessons.length} lessons</div>
          </div>
          <div className="relative">
            <ul className="flex flex-col h-80 overflow-y-auto pb-10">
              {lessons.map((lesson: any) => {
                const lessonURL = `/lessons/${lesson.slug}`
                return (
                  <li className="flex">
                    <Link href={lessonURL}>
                      <a className="flex leading-tight py-2">
                        <PlayIcon className="flex-shrink-0 mr-2"></PlayIcon>
                        <div>{lesson.title}</div>
                      </a>
                    </Link>
                  </li>
                )
              })}
            </ul>
            <div className="absolute bg-gradient-to-t from-white to-transparent w-full h-8 left-0 bottom-0"></div>
          </div>
        </div>
        {/* RIGHT COLUMN */}
        <div className="col-span-2 p-8">
          TODO: Right Column Membership Stuff
        </div>
      </main>
      <section className="grid md:grid-cols-5 grid-cols-1 py-8">
        <div className="col-span-3">
          <h2 className="text-xl mb-2">Description</h2>
          <Markdown>{description}</Markdown>
        </div>
      </section>
      <section className="grid md:grid-cols-5 grid-cols-1 py-8">
        <div className="col-span-3">
          {console.log(instructor)}
          <h2 className="text-xl mb-2">About the Instructor</h2>
          <div className="flex">
            <InstructorLink className="mr-4">
              <img className="w-24 rounded-full" src={avatar_64_url} alt="" />
            </InstructorLink>
            <div className="flex flex-col">
              <InstructorLink>
                <h3 className="font-bold">{full_name}</h3>
              </InstructorLink>

              <div className="text-gray-600">@{twitter}</div>
              <Markdown>{bio_short}</Markdown>
            </div>
          </div>
        </div>
      </section>
    </>
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
