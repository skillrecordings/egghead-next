import Link from 'next/link'
import Markdown from 'react-markdown'
import useSWR from 'swr'
import {loadCourse} from 'lib/courses'
import {FunctionComponent} from 'react'
import {get, first} from 'lodash'
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
      <g fill="none">
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
  children: React.ReactNode
}> = ({className, rating, count, children}) => {
  return (
    <div className={`${className ? className : ''}`}>
      {/* TODO: Stars
      <div className="flex">
        <StarIcon></StarIcon>
        <StarIcon></StarIcon>
        <StarIcon></StarIcon>
        <StarIcon></StarIcon>
        <StarIcon></StarIcon>
      </div> */}
      <div className="inline-flex flex-wrap items-center md:justify-start justify-center">
        Rated <span className="ml-2 font-semibold">{rating.toFixed(1)}/5</span>
        {' ・ '}
        <span className="font-semibold mr-2">{count}</span> people completed
        this {children} course
      </div>
    </div>
  )
}

const PrimaryTag: FunctionComponent<{version?: string}> = ({version}) => {
  return <div>Primary Tag</div>
}

const PlayIcon: FunctionComponent<{className: string}> = ({className}) => {
  return (
    // prettier-ignore
    <svg className={className ? className : ""} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16"><g fill="none" fill-rule="evenodd" transform="translate(-5 -4)"><polygon points="0 0 24 0 24 24 0 24"/><path fill="currentColor" fillRule="nonzero" d="M19.376,12.416 L8.777,19.482 C8.62358728,19.5840889 8.42645668,19.5935191 8.26399944,19.5065407 C8.10154219,19.4195623 8,19.2502759 8,19.066 L8,4.934 C8,4.74972414 8.10154219,4.58043768 8.26399944,4.49345928 C8.42645668,4.40648088 8.62358728,4.41591114 8.777,4.518 L19.376,11.584 C19.5150776,11.6767366 19.5986122,11.8328395 19.5986122,12 C19.5986122,12.1671605 19.5150776,12.3232634 19.376,12.416 Z"/></g></svg>
  )
}

const Course: FunctionComponent<CourseProps> = ({course}) => {
  const initialData = course
  const {data} = useSWR(course.url, fetcher, {initialData})
  const {
    title,
    slug,
    description,
    instructor,
    square_cover_480_url,
    square_cover_large_url,
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
  const firstLessonURL = `/lessons/${get(first(lessons), 'slug')}`
  const Instructor: FunctionComponent<{
    name: string
    avatar_url: string
    url: string
    bio_short?: string
    twitter?: string
    className?: string
  }> = ({className, url, name, avatar_url, bio_short, twitter}) => (
    <div className={className ? className : ''}>
      <div className="flex flex-shrink-0">
        <div
          className="sm:w-10 sm:h-10 w-8 h-8 rounded-full flex-shrink-0"
          style={{
            background: `url(${avatar_url})`,
            backgroundSize: 'cover',
          }}
        />
        <div className="sm:pl-2 pl-1">
          <Link href={`/s/${url}`}>
            <a className="flex hover:underline flex-shrink-0">
              <span className="font-semibold">{name}</span>
            </a>
          </Link>
          {bio_short && (
            <Markdown className="prose prose-sm mt-0">{bio_short}</Markdown>
          )}
        </div>
      </div>
      {/* {twitter && <div className="text-gray-600 text-sm">@{twitter}</div>} */}
    </div>
  )

  return (
    <>
      {/* Look into exporting layouts like MDX does rather than using "absolute" */}
      <div className="max-w-screen-lg mx-auto">
        <div className="md:mt-10 mt-5 grid md:grid-cols-5 grid-cols-1 md:gap-16 gap-5 rounded-md w-full left-0 mb-4">
          <div className="md:col-span-3 md:row-start-auto row-start-2 flex flex-col h-full justify-center max-w-screen-2xl w-full mx-auto">
            <header>
              <h1 className="md:text-3xl text-2xl font-bold leading-tight md:text-left text-center">
                {title}
              </h1>
              <div className="flex items-center md:justify-start justify-center mt-4">
                <UserRating
                  className="mr-3"
                  rating={average_rating_out_of_5}
                  count={rating_count}
                >
                  <Link href={`/s/${tagSlug}`}>
                    <a className="mx-2 inline-flex items-center hover:underline">
                      <img
                        className="w-6 h-6"
                        src={tagImage}
                        alt={`${tagName} logo`}
                      />
                      <div className="font-semibold ml-1">{tagName}</div>
                    </a>
                  </Link>
                </UserRating>
              </div>
              <Markdown className="prose text-gray-900 mt-4">
                {description}
              </Markdown>
              <Link href={firstLessonURL}>
                <a className="inline-flex items-center mt-6 mb-4 px-4 py-3 rounded-md bg-blue-600 text-white transition-all hover:bg-blue-700 ease-in-out duration-200">
                  <PlayIcon className="text-blue-100 mr-2" />
                  Start Watching
                </a>
              </Link>
            </header>
            <main>
              <section className="my-6">
                <div className="mb-2 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">
                    Course content{' '}
                    <span className="text-sm text-gray-600 font-normal">
                      ({lessons.length} lessons)
                    </span>
                  </h2>
                </div>
                <div>
                  <ul>
                    {lessons.map((lesson: any, i: number) => {
                      const lessonURL = `/lessons/${lesson.slug}`
                      return (
                        <li>
                          <div className="font-semibold flex items-center leading-tight py-2">
                            <div className="flex items-center mr-2 flex-grow">
                              <small className="text-gray-500 pt-px font-xs transform scale-75 font-normal w-4">
                                {i + 1}
                              </small>
                              <PlayIcon className="text-gray-500 mx-1" />
                            </div>
                            <Link href={lessonURL}>
                              <a className="hover:underline font-semibold flex items-center leading-tight w-full">
                                <Markdown className="prose text-gray-900 mt-0 leading-tight">
                                  {lesson.title}
                                </Markdown>
                              </a>
                            </Link>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </section>
              <div className="pt-5 md:hidden block">
                <Instructor
                  name={full_name}
                  avatar_url={avatar_64_url}
                  url={instructor_slug}
                  bio_short={bio_short}
                  twitter={twitter}
                />
              </div>
            </main>
          </div>
          <div className="md:col-span-2 flex flex-col items-center justify-start md:mb-0 mb-4">
            <img
              src={square_cover_large_url}
              alt={`illustration for ${title}`}
              className="h-64 w-64"
            />
            {/* <button className="flex items-center">
              <PlayIcon className="flex-shrink-0"></PlayIcon>
              Preview this course
            </button> */}
            <div className="pt-16 md:block hidden">
              <Instructor
                name={full_name}
                avatar_url={avatar_64_url}
                url={instructor_slug}
                bio_short={bio_short}
                twitter={twitter}
              />
            </div>
          </div>
        </div>
      </div>
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
