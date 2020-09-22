import React, {FunctionComponent} from 'react'
import Link from 'next/link'
import {isEmpty, get} from 'lodash'
import Markdown from 'react-markdown'
import Eggo from '../../../components/images/eggo.svg'
import {LessonResource} from 'types'

type NextUpProps = {
  current: LessonResource
  data: {
    list: {
      lessons: LessonResource[]
    }
  }
}

const NextUp: FunctionComponent<NextUpProps> = ({data, current}) => {
  return data ? (
    <ul>
      {data.list.lessons.map((lesson, index = 0) => {
        return (
          <li
            key={lesson.slug}
            className="p-4 bg-gray-200 border-gray-100 border-2"
          >
            <div className="flex">
              <div className="w-2/12">
                {index + 1}{' '}
                <input type="checkbox" checked={lesson.completed} readOnly />
              </div>
              <div className="w-full">
                {lesson.slug !== current.slug ? (
                  <Link href={lesson.path}>
                    <a className="no-underline hover:underline text-blue-500">
                      {lesson.title}
                    </a>
                  </Link>
                ) : (
                  <div>{lesson.title}</div>
                )}
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  ) : null
}

type MetadataProps = {
  title: string
  instructor: {
    full_name: string
    http_url: string
    avatar_64_url: string
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

const Metadata: FunctionComponent<MetadataProps> = ({
  title,
  instructor,
  tags,
  summary,
  course,
  nextUpData,
  lesson,
  ...restProps
}: MetadataProps) => {
  console.log('course', course)
  return (
    <div {...restProps}>
      <div className="space-y-4">
        {title && <h3 className="font-medium text-xl">{title}</h3>}
        {summary && <Markdown>{summary}</Markdown>}
        {
          <ul className="space-y-3">
            <li className="flex items-center">
              <IconExternalLink className="w-5 mr-2" />
              <a href="#" className="hover:text-blue-500">
                Code on GitHub
              </a>
            </li>
            <li className="flex items-center">
              <IconDownload className="w-5 mr-2" />
              <a href="#" className="hover:text-blue-500">
                Download
              </a>
            </li>
            <li className="flex items-center">
              <IconFlag className="w-5 mr-2" />
              <button className="hover:text-blue-500">Flag to review</button>
            </li>
          </ul>
        }
      </div>
      {course && (
        <div className="pt-6">
          <h4 className="font-medium text-lg">Course</h4>
          <div className="flex items-center mt-3">
            <Link href={`/courses/${course.slug}`}>
              <a className="no-underline">
                <img
                  src={course.square_cover_480_url}
                  alt=""
                  className="w-16 mr-4"
                />
              </a>
            </Link>
            <Link href={`/courses/${course.slug}`}>
              <a className="no-underline">
                <h3 className="font-medium text-xl">{course.title}</h3>
              </a>
            </Link>
          </div>
        </div>
      )}
      {!isEmpty(tags) && (
        <div className="pt-6">
          <h4 className="font-medium text-lg">Tech used</h4>
          <ul className="space-y-3 mt-3">
            {tags.map((tag, index) => (
              <li key={index}>
                <a
                  href={tag.http_url}
                  className="flex items-center ml-4 first:ml-0"
                >
                  <img
                    src={tag.image_url}
                    alt=""
                    className="w-5 h-5 flex-shrink-0"
                  />
                  <span className="ml-2">{tag.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {instructor && (
        <div className="pt-6">
          <h4 className="font-medium text-lg">Instructor</h4>
          <div className="flex items-center mt-3">
            <a href={get(instructor, 'http_url', '#')} className="mr-4">
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
            {get(instructor, 'full_name') && (
              <a href={get(instructor, 'http_url', '#')}>
                {instructor.full_name}
              </a>
            )}
          </div>
        </div>
      )}
      <div className="pt-6">
        <h4 className="font-medium text-lg">
          Share this lesson with your friends
        </h4>
        <div className="flex items-center mt-3">
          <div>sdsfsd</div>
        </div>
      </div>
      {nextUpData && (
        <div className="pt-6">
          <NextUp data={nextUpData} current={lesson} />
        </div>
      )}
    </div>
  )
}

export default Metadata

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

const IconFlag: FunctionComponent<{className?: string}> = ({
  className = '',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
      clipRule="evenodd"
    />
  </svg>
)
