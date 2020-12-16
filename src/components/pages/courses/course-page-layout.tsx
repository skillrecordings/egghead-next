import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Markdown from 'react-markdown'
import UserRating from 'components/pages/courses/user-rating'
import InstructorProfile from 'components/pages/courses/instructor-profile'
import PlayIcon from 'components/pages/courses/play-icon'
import getDependencies from 'data/courseDependencies'
import {get, first} from 'lodash'
import {NextSeo} from 'next-seo'
import removeMarkdown from 'remove-markdown'

type CoursePageLayoutProps = {
  lessons: any
  course: any
  ogImageUrl: string
}

const CoursePageLayout: React.FunctionComponent<CoursePageLayoutProps> = ({
  lessons,
  course,
  ogImageUrl,
}) => {
  const dependencies: any = getDependencies(course.slug)

  const {topics, illustrator} = dependencies

  const {
    title,
    image_thumb_url,
    square_cover_480_url,
    instructor,
    average_rating_out_of_5,
    watched_count,
    primary_tag,
    http_url,
    description,
  } = course

  const {
    full_name,
    avatar_64_url,
    slug: instructor_slug,
    bio_short,
    twitter,
  } = instructor

  const image_url = square_cover_480_url || image_thumb_url
  const firstLessonURL = get(first(lessons), 'path')
  const {name: tagName, image_url: tagImage, slug: tagSlug} = primary_tag

  return (
    <>
      {' '}
      <NextSeo
        description={removeMarkdown(description)}
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
          description: removeMarkdown(description),
          site_name: 'egghead',
          images: [
            {
              url: ogImageUrl,
            },
          ],
        }}
      />
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
                  count={watched_count}
                >
                  <Link href={`/q/${tagSlug}`}>
                    <a className="mx-2 inline-flex items-center hover:underline">
                      <Image
                        width={24}
                        height={24}
                        src={tagImage}
                        alt={`${tagName} logo`}
                      />
                      <div className="font-semibold ml-1">{tagName}</div>
                    </a>
                  </Link>
                </UserRating>
              </div>
              <Markdown className="prose md:prose-lg text-gray-900 mt-6">
                {description}
              </Markdown>
              {topics && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-3">
                    What you'll learn
                  </h2>
                  <div className="prose">
                    <ul className="grid md:grid-cols-2 grid-cols-1 md:gap-x-5">
                      {topics?.map((topic: string) => (
                        <li key={topic} className="text-gray-900 leading-6">
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </header>

            <main>
              <section className="mt-8">
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
                      return (
                        <li key={lesson.slug}>
                          <div className="font-semibold flex items-center leading-tight py-2">
                            <div className="flex items-center mr-2 flex-grow">
                              <small className="text-gray-500 pt-px font-xs transform scale-75 font-normal w-4">
                                {i + 1}
                              </small>
                              <PlayIcon className="text-gray-500 mx-1" />
                            </div>
                            <Link href={lesson.path}>
                              <a className="hover:underline font-semibold flex items-center w-full">
                                <Markdown className="prose md:prose-lg text-gray-900 mt-0">
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
                <InstructorProfile
                  name={full_name}
                  avatar_url={avatar_64_url}
                  url={instructor_slug}
                  bio_short={bio_short}
                  twitter={twitter}
                />
                {illustrator && (
                  <div className="w-full py-6 border-b border-gray-200">
                    <h4 className="font-semibold">Credits</h4>
                    <span className="text-sm">
                      {illustrator?.name} (illustration)
                    </span>
                  </div>
                )}
              </div>
            </main>
          </div>
          <div className="md:col-span-2 flex flex-col items-center justify-start md:mb-0 mb-4">
            <Image
              src={image_url}
              alt={`illustration for ${title}`}
              height={256}
              width={256}
            />
            <div className="md:block hidden">
              <div className="py-6 border-b border-gray-200 w-full flex justify-center">
                <Link href={firstLessonURL}>
                  <a className="inline-flex justify-center items-center px-5 py-3 rounded-md bg-blue-600 text-white transition-all hover:bg-blue-700 ease-in-out duration-200">
                    <PlayIcon className="text-blue-100 mr-2" />
                    Start Watching
                  </a>
                </Link>
              </div>
              <div className="py-6 border-b border-gray-200">
                <InstructorProfile
                  name={full_name}
                  avatar_url={avatar_64_url}
                  url={instructor_slug}
                  bio_short={bio_short}
                  twitter={twitter}
                />
                {illustrator && (
                  <div className="w-full py-6 border-b border-gray-200">
                    <h4 className="font-semibold">Credits</h4>
                    <span className="text-sm">
                      {illustrator?.name} (illustration)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CoursePageLayout
