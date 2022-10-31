import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {loadAllPlaylistsByPage} from 'lib/playlists'
import Markdown from 'react-markdown'
import TagList from '../../components/layouts/tag-list'
import useClipboard from 'react-use-clipboard'
import {IconLink} from 'components/share'
import {NextSeo} from 'next-seo'
import FiveStars from '../../components/five-stars'
import {useRouter} from 'next/router'

export async function getStaticProps() {
  const courses = await loadAllPlaylistsByPage()
  return {
    props: {courses}, // will be passed to the page component as props
  }
}

const CourseIndex: React.FC<{courses: any}> = ({courses = []}) => {
  const isDevelopment: boolean = process.env.NODE_ENV === 'development'
  const router = useRouter()

  return (
    <>
      <NextSeo
        canonical={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${router.asPath}`}
        title={`Learn from ${courses.length} web development courses on egghead`}
        twitter={{
          cardType: 'summary_large_image',
        }}
        openGraph={{
          title: `Learn from ${courses.length} web development courses on egghead`,
          url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${router.asPath}`,
          images: [
            {
              url: `https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611999983/next.egghead.io/cards/courses_2x.png`,
            },
          ],
        }}
      />
      <div className="dark:bg-gray-900 bg-gray-50">
        <header className="relative py-24 text-center">
          <h1 className="relative z-10 pt-10 pb-16 text-2xl font-extrabold leading-tight tracking-tight lg:text-3xl">
            Courses on egghead
          </h1>
          <Image
            src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611998593/next.egghead.io/pages/home/header-transparent_2x.png"
            layout="fill"
            priority={true}
            quality={100}
            objectFit="cover"
            className="absolute top-0 left-0 z-0"
            alt=""
          />
          <div className="absolute bottom-0 left-0 z-10 w-full h-40 bg-gradient-to-b from-transparent dark:to-gray-900 to-gray-50" />
        </header>
        <main>
          <div className="container -mt-5">
            <ul className="relative z-30 grid gap-5 xl:grid-cols-3 sm:grid-cols-2">
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
                    <article className="relative flex h-full space-x-5 bg-white rounded-md shadow-sm group dark:bg-gray-800 max-w-max-content">
                      <div className="flex flex-col">
                        <header className="flex flex-col items-center p-5 space-y-4 border-b md:flex-row md:space-x-5 md:space-y-0 border-gray-50 dark:border-gray-800">
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
                                <h1 className="text-lg font-bold leading-tight text-center sm:text-lg hover:underline md:text-left">
                                  {course.title}
                                </h1>
                              </a>
                            </Link>
                            <div className="flex items-center pt-2 text-sm">
                              {course?.instructor?.path && (
                                <Link href={course.instructor.path}>
                                  <a className="pr-3 font-semibold hover:underline">
                                    {course.instructor.full_name}
                                  </a>
                                </Link>
                              )}
                              <span className="transition-opacity duration-300 ease-in-out opacity-70 group-hover:opacity-100">
                                {course.watched_count}× completed
                              </span>
                              <span className="transition-opacity duration-300 ease-in-out opacity-70 group-hover:opacity-100">
                                {course.average_rating_out_of_5 > 0 && (
                                  <FiveStars
                                    rating={course.average_rating_out_of_5}
                                  />
                                )}
                              </span>
                            </div>
                            <TagList
                              className="flex flex-wrap items-center justify-center text-sm md:justify-start"
                              tags={course.tags}
                              courseSlug={course.slug}
                            />
                          </div>
                        </header>
                        <div className="h-full p-5 bg-white border border-white dark:bg-gray-900 dark:border-gray-800 rounded-b-md">
                          {course.summary && (
                            <h3 className="mb-4 text-sm font-bold">
                              {course.summary}
                            </h3>
                          )}
                          <Markdown
                            source={course.description}
                            className="prose-sm prose transition-opacity duration-300 ease-in-out dark:prose-dark opacity-80 group-hover:opacity-100"
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
          </div>
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
      className="absolute p-2 text-sm leading-tight text-gray-800 transition-opacity duration-300 ease-in-out rounded-md opacity-0 dark:text-white top-2 right-2 dark:bg-gray-900 bg-gray-50 group-hover:opacity-80 hover:opacity-100"
      onClick={setCopied}
    >
      {isCopied ? '👍' : <IconLink className="w-4 h-4" />}
    </button>
  )
}

export default CourseIndex
