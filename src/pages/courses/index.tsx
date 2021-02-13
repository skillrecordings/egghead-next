import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {loadAllCourses, loadAllCourseByPage} from 'lib/courses'
import Markdown from 'react-markdown'
import TagList from '../../components/layouts/tag-list'
import useClipboard from 'react-use-clipboard'
import {IconLink} from 'components/share'
import {NextSeo} from 'next-seo'

export async function getStaticProps() {
  const courses = await loadAllCourseByPage()
  return {
    props: {courses}, // will be passed to the page component as props
  }
}

const CourseIndex: React.FC<{courses: any}> = ({courses = []}) => {
  const isDevelopment: boolean = process.env.NODE_ENV === 'development'

  return (
    <>
      <NextSeo
        title={`Learn from ${courses.length} web development courses on egghead`}
        twitter={{
          cardType: 'summary_large_image',
        }}
        openGraph={{
          title: `Learn from ${courses.length} web development courses on egghead`,
          images: [
            {
              url: `https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611999983/next.egghead.io/cards/courses_2x.png`,
            },
          ],
        }}
      />
      <div className="dark:bg-gray-900 bg-gray-50 sm:-mt-5 -mt-3 -mx-5 px-5">
        <header className="text-center relative py-24 -mx-5">
          <h1 className="relative z-10 lg:text-3xl text-2xl leading-tight font-extrabold tracking-tight pb-16 pt-10">
            Courses on egghead
          </h1>
          <Image
            src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611998593/next.egghead.io/pages/home/header-transparent_2x.png"
            layout="fill"
            priority={true}
            quality={100}
            objectFit="cover"
            className="absolute left-0 top-0 z-0"
            alt=""
          />
          <div className="h-40 bg-gradient-to-b from-transparent dark:to-gray-900 to-gray-50 absolute bottom-0 left-0 w-full z-10" />
        </header>
        <main>
          <ul className="grid xl:grid-cols-3 sm:grid-cols-2 gap-5 max-w-screen-xl mx-auto -mt-5 relative z-30">
            {courses.map((course: any) => {
              const image = course.image_thumb_url
              const byline = `${
                course.instructor?.full_name &&
                `${course.instructor.full_name}・ Course`
              }`
              const metadata: any = {
                title: course.title,
                byline,
                ...(!!image && {image}),
                path: course.path,
                slug: course.slug,
                description: course.description,
              }

              return (
                <li key={course.slug}>
                  <article className="relative group dark:bg-gray-800 bg-white rounded-md max-w-max-content flex space-x-5 h-full shadow-sm">
                    <div className="flex flex-col">
                      <header className="flex flex-col md:flex-row md:space-x-5 space-y-4 md:space-y-0 items-center p-5 border-b border-gray-50 dark:border-gray-800">
                        <figure className="flex flex-col flex-shrink-0">
                          <Link href={course.path}>
                            <a tabIndex={-1}>
                              <Image
                                src={course.image_thumb_url}
                                width={96}
                                height={96}
                                alt={course.title}
                              />
                            </a>
                          </Link>
                        </figure>
                        <div className="flex flex-col items-center md:items-start">
                          <Link href={course.path}>
                            <a>
                              <h1 className="sm:text-lg text-lg font-bold leading-tight hover:underline text-center md:text-left">
                                {course.title}
                              </h1>
                            </a>
                          </Link>
                          <div className="pt-2 text-sm flex items-center">
                            {course?.instructor?.path && (
                              <Link href={course.instructor.path}>
                                <a className="hover:underline pr-3 font-semibold">
                                  {course.instructor.full_name}
                                </a>
                              </Link>
                            )}
                            <span className="opacity-70 group-hover:opacity-100 transition-opacity ease-in-out duration-300">
                              {course.watched_count}× completed
                            </span>
                          </div>
                          <TagList
                            className="flex justify-center md:justify-start flex-wrap items-center text-sm"
                            tags={course.tags}
                            courseSlug={course.slug}
                          />
                        </div>
                      </header>
                      <div className="p-5 dark:bg-gray-900 bg-white h-full border dark:border-gray-800 border-white rounded-b-md">
                        {course.summary && (
                          <h3 className="text-sm font-bold mb-4">
                            {course.summary}
                          </h3>
                        )}
                        <Markdown
                          source={course.description}
                          className="prose dark:prose-dark prose-sm opacity-80 group-hover:opacity-100 transition-opacity ease-in-out duration-300"
                        />
                      </div>
                    </div>
                    {isDevelopment && (
                      <CopyMetadataToClipboard metadata={metadata} />
                    )}
                  </article>
                </li>
              )
            })}
          </ul>
        </main>
      </div>
    </>
  )
}

const CopyMetadataToClipboard = (metadata: any) => {
  const [isCopied, setCopied] = useClipboard(
    JSON.stringify(metadata, null, 2),
    {
      successDuration: 500,
    },
  )
  return (
    <button
      className="absolute dark:text-white text-gray-800 top-2 right-2 p-2 rounded-md dark:bg-gray-900 bg-gray-50 text-sm opacity-0 group-hover:opacity-80 hover:opacity-100 leading-tight transition-opacity ease-in-out duration-300"
      onClick={setCopied}
    >
      {isCopied ? '👍' : <IconLink className="w-4 h-4" />}
    </button>
  )
}

export default CourseIndex
