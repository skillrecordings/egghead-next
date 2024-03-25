import {LessonResource} from '@/types'
import {get} from 'lodash'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import Image from 'next/image'
import Eggo from '@/components/icons/eggo'
import Share from '@/components/share'
import Markdown from 'react-markdown'
import Tabs from './Tabs'

const LessonHeader = async ({
  lessonLoader,
}: {
  lessonLoader: Promise<LessonResource>
}) => {
  const lesson = await lessonLoader

  if (!lesson) {
    return notFound()
  }

  const {
    description,
    title,
    instructor,
    slug,
    transcript_url,
    transcript,
    comments,
  } = lesson

  const instructorPagePath = `/q/resources-by-${get(instructor, 'slug', '#')}`

  console.log('SERVER?: ', typeof window === 'undefined')
  return (
    <div className="container max-w-screen-lg py-8 md:py-12 lg:py-16">
      <div className="grid grid-cols-1 gap-8 divide-y lg:grid-cols-1 lg:gap-12 md:divide-transparent divide-gray-50">
        <div className="row-start-1 space-y-6 md:col-span-8 md:row-start-1 md:space-y-8 lg:space-y-10">
          <div className="pb-2 space-y-4 sm:pb-8">
            {title && (
              <h1 className="text-xl font-extrabold leading-tight lg:text-3xl">
                {title}
              </h1>
            )}
            <div className="flex flex-col flex-wrap justify-between w-full pt-4 space-y-5 lg:flex-row lg:space-x-8 lg:space-y-0 lg:items-center">
              <div className="flex items-center justify-between w-full space-x-5 md:w-auto">
                {instructor && (
                  <div className="flex items-center flex-shrink-0">
                    <Link
                      href={instructorPagePath}
                      className="flex mr-2 itemes-center"
                    >
                      {get(instructor, 'avatar_64_url') ? (
                        <Image
                          width={48}
                          height={48}
                          src={instructor.avatar_64_url}
                          alt={instructor.full_name}
                          className="m-0 rounded-full"
                        />
                      ) : (
                        <Eggo className="w-8 rounded-full" />
                      )}
                    </Link>
                    <div className="flex flex-col">
                      <span className="text-xs">Instructor</span>
                      {get(instructor, 'full_name') && (
                        <Link
                          href={instructorPagePath}
                          className="font-semibold leading-tighter hover:underline"
                        >
                          {instructor.full_name}
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-8">
                <div className="flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                  <Share
                    className="flex flex-col items-end "
                    resource={{
                      path: lesson.path,
                      title: lesson.title,
                      type: 'lesson',
                    }}
                    instructor={instructor}
                  />
                </div>
              </div>
            </div>
            {description && (
              <Markdown className="font-medium prose prose-lg dark:prose-dark dark:prose-a:text-blue-300 prose-a:text-blue-500 max-w-none text-gray-1000 dark:text-white">
                {description}
              </Markdown>
            )}
          </div>
          <Tabs
            lessonSlug={slug}
            transcript={transcript}
            transcript_url={transcript_url}
            comments={comments}
          />
        </div>
      </div>
    </div>
  )
}

export default LessonHeader
