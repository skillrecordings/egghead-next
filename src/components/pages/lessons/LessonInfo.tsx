import React, {FunctionComponent, useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {isEmpty, get} from 'lodash'
import Markdown from 'react-markdown'
import useCopyToClipboard from 'react-use/lib/useCopyToClipboard'
import Eggo from '../../../components/images/eggo.svg'
import {LessonResource} from 'types'

type NextUpProps = {
  currentLessonSlug: string
  data: {
    list: {
      lessons: LessonResource[]
    }
  }
}

const NextUp: FunctionComponent<NextUpProps> = ({data, currentLessonSlug}) => {
  return data ? (
    <ol>
      <span className="font-semibold">Lessons</span>
      {data.list.lessons.map((lesson, index = 0) => {
        return (
          <li key={lesson.slug} className="py-2 pr-3">
            <div className="flex">
              <div className="flex items-center mr-2">
                <div className="mr-1 text-xs text-cool-gray-400">
                  {index + 1}
                </div>
                {/* <input type="checkbox" checked={lesson.completed} readOnly /> */}
              </div>
              <div className="w-full leading-tight">
                {lesson.slug !== currentLessonSlug ? (
                  <Link href={lesson.path}>
                    <a className="font-semibold no-underline hover:underline text-blue-600">
                      {lesson.title}
                    </a>
                  </Link>
                ) : (
                  <div className="font-semibold">► {lesson.title}</div>
                )}
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  ) : null
}

const TweetLink: FunctionComponent<{
  lesson: {
    title: string
    path: string
  }
  instructor: {
    slug: string
    twitter?: string
  }
  className?: string
}> = ({lesson, instructor, className = ''}) => {
  return get(lesson, 'title') && get(lesson, 'path') ? (
    <a
      className={`flex text-sm items-center rounded px-3 py-2 bg-cool-gray-100 hover:bg-gray-300 transition-colors ease-in-out duration-150 ${className}`}
      target="_blank"
      rel="noopener noreferrer"
      href={`https://twitter.com/intent/tweet/?text=${encodeURIComponent(
        lesson.title +
          `${
            isEmpty(get(instructor, 'twitter'))
              ? ''
              : ` by @${instructor.twitter}`
          }` +
          ', lesson on @eggheadio',
      )}&url=${encodeURIComponent(
        `${process.env.NEXT_PUBLIC_REDIRECT_URI}${lesson.path}`,
      )}`}
    >
      <IconTwitter className="w-5 mr-2" />
      <span>Tweet</span>
    </a>
  ) : null
}
const CopyToClipboard: FunctionComponent<{
  stringToCopy: string
  className?: string
}> = ({stringToCopy, className = ''}) => {
  const [copied, setCopied] = useState(false)
  const [state, copyToClipboard] = useCopyToClipboard()
  if (stringToCopy) {
    const copyHandler = () => {
      copyToClipboard(stringToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
    return (
      <div>
        <button
          type="button"
          disabled={copied}
          onClick={copyHandler}
          className={`rounded text-sm px-3 py-2 flex justify-center items-center bg-cool-gray-100 hover:bg-gray-300 transition-colors duration-150 ease-in-out ${className}`}
        >
          {state.error ? (
            'Unable to copy!'
          ) : copied ? (
            'Copied!'
          ) : (
            <>
              <IconLink className="w-5 mr-2" />
              <span>
                Copy link
                <span className="hidden lg:inline"> to clipboard</span>
              </span>
            </>
          )}
        </button>
      </div>
    )
  }
  return null
}

type LessonInfoProps = {
  title: string
  instructor: {
    full_name: string
    avatar_64_url?: string
    slug: string
    twitter?: string
  }
  tags: [
    {
      name: string
      http_url: string
      image_url: string
    },
  ]
  summary: string
  course: {
    title: string
    square_cover_480_url: string
    slug: string
  }
  [cssRelated: string]: any
}

const LessonInfo: FunctionComponent<LessonInfoProps> = ({
  title,
  instructor,
  tags,
  summary,
  course,
  nextUpData,
  lesson,
  ...restProps
}) => {
  return (
    <div {...restProps}>
      <div className="space-y-4">
        {title && (
          <h1 className="font-semibold leading-tight text-lg lg:text-xl">
            {title}
          </h1>
        )}
        {summary && <Markdown className="prose">{summary}</Markdown>}
        {
          <ul className="space-y-3">
            <li className="flex items-center">
              <a
                href="#"
                className="flex items-center text-blue-600 hover:underline"
              >
                <IconExternalLink className="w-5 mr-1 text-blue-700" />
                Open code for this lesson on GitHub
              </a>
            </li>
            <li className="flex items-center">
              <a
                href="#"
                className="flex items-center text-blue-600 hover:underline"
              >
                <IconDownload className="w-5 mr-1 text-blue-700" />
                Download
              </a>
            </li>
            {/* <li className="flex items-center">
              <IconFlag className="w-5 mr-1" />
              <Dialog
                ariaLabel="flag-for-revision"
                title="Flag lesson for revision"
                buttonText="Flag for revision"
                buttonStyles="text-blue-600 hover:underline"
              >
                <div className="text-center">
                  Flag to review form goes here...
                </div>
              </Dialog>
            </li> */}
          </ul>
        }
      </div>
      {course && (
        <div className="pt-6">
          <div className="flex items-center">
            <Link href={`/courses/${course.slug}`}>
              <a className="flex-shrink-0 relative block w-12 h-12 lg:w-20 lg:h-20">
                <Image
                  src={course.square_cover_480_url}
                  alt={`illustration for ${course.title}`}
                  layout="fill"
                />
              </a>
            </Link>
            <div className="ml-2 lg:ml-4">
              <h4 className="text-gray-600 mb-1">Course</h4>
              <Link href={`/courses/${course.slug}`}>
                <a className="hover:underline">
                  <h3 className="font-semibold leading-tight text-md lg:text-lg">
                    {course.title}
                  </h3>
                </a>
              </Link>
            </div>
          </div>
        </div>
      )}
      {!isEmpty(tags) && (
        <div className="pt-6">
          <h4 className="font-semibold">Tech used</h4>
          <ul className="space-y-3 mt-3">
            {tags.map((tag, index) => (
              <li key={index}>
                <Link href={`/q/${tag.name}`}>
                  <a className="flex items-center ml-4 first:ml-0 hover:underline">
                    <img
                      src={tag.image_url}
                      alt={tag.name}
                      className="w-5 h-5 flex-shrink-0"
                    />
                    <span className="ml-2">{tag.name}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {instructor && (
        <div className="pt-6">
          <h4 className="font-semibold">Instructor</h4>
          <div className="flex items-center mt-3 flex-shrink-0">
            <Link href={`/instructors/${get(instructor, 'slug', '#')}`}>
              <a className="mr-2">
                {get(instructor, 'avatar_64_url') ? (
                  <img
                    src={instructor.avatar_64_url}
                    alt=""
                    className="w-10 rounded-full m-0"
                  />
                ) : (
                  <Eggo className="w-8 rounded-full" />
                )}
              </a>
            </Link>
            {get(instructor, 'full_name') && (
              <Link href={`/instructors/${get(instructor, 'slug', '#')}`}>
                <a className="hover:underline">{instructor.full_name}</a>
              </Link>
            )}
          </div>
        </div>
      )}
      {get(lesson, 'free_forever') && (
        <div className="pt-6">
          <div className="flex items-center">
            <IconCommunityResource className="w-6 mr-2 text-yellow-300 flex-shrink-0" />
            <h4 className="font-semibold">
              This lesson is a Community Resource
            </h4>
          </div>
          <div className="mt-3">
            <p className="text-sm text-cool-gray-600">
              A Community Resource means that it’s free to access for all. The
              instructor of this lesson requested it to be open to the public.
            </p>
          </div>
        </div>
      )}
      <div className="pt-6">
        <h4 className="font-semibold">Share this lesson with your friends</h4>
        <div className="flex items-center mt-3">
          <div className="flex items-center">
            <TweetLink lesson={lesson} instructor={instructor} />
            <CopyToClipboard
              stringToCopy={`${process.env.NEXT_PUBLIC_REDIRECT_URI}${lesson.path}`}
              className="ml-2"
            />
          </div>
        </div>
      </div>
      {nextUpData && (
        <div className="pt-6">
          <NextUp data={nextUpData} currentLessonSlug={lesson.slug} />
        </div>
      )}
    </div>
  )
}

export default LessonInfo

const IconDownload: FunctionComponent<{className?: string}> = ({
  className = '',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
)

const IconExternalLink: FunctionComponent<{className?: string}> = ({
  className = '',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
)

const IconCommunityResource: FunctionComponent<{className?: string}> = ({
  className = '',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 150 135"
    fill="currentColor"
    className={className}
  >
    <g>
      <path d="M138,55.5h-22.5c-4.6-10.9-15.5-18.5-28.1-18.5c-16.8,0-30.5,13.6-30.5,30.3s13.7,30.3,30.5,30.3 c12.6,0,23.4-7.6,28-18.4H138c6.6,0,12-5.3,12-11.9C150,60.9,144.6,55.5,138,55.5z M87.4,79.1c-6.5,0-11.8-5.2-11.8-11.7 c0-6.5,5.3-11.7,11.8-11.7c6.5,0,11.8,5.2,11.8,11.7C99.2,73.9,93.9,79.1,87.4,79.1z"></path>
      <path d="M135.4,111.4l-17.6-16.2c-1.3-1.2-3.2-1.1-4.4,0.1c-7.7,7.3-18.4,11.6-30.1,10.6 c-18.9-1.5-34.1-16.9-35.4-35.7C46.3,47.8,64.2,29,86.5,29c9.8,0,18.7,3.6,25.6,9.6c1.2,1.1,3.1,1.1,4.3,0l17.9-16.4 c0.7-0.7,0.8-1.8,0.1-2.5C121.3,6.7,103-1,82.9,0.1C51.3,1.7,25.2,25.2,19.7,55.5H12c-6.6,0-12,5.4-12,12s5.4,12,12,12h7.7 C25.4,111,53.1,135,86.5,135c19.3,0,36.6-8,49-20.8C136.2,113.4,136.2,112.2,135.4,111.4z"></path>
    </g>
  </svg>
)

const IconLink: FunctionComponent<{className?: string}> = ({
  className = '',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
    />
  </svg>
)

const IconTwitter: FunctionComponent<{className?: string}> = ({
  className = '',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
  >
    <g fill="currentColor">
      <path fill="none" d="M0 0h24v24H0z"></path>
      <path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z"></path>
    </g>
  </svg>
)
