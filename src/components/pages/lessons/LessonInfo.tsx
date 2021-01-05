import React, {FunctionComponent, SyntheticEvent, useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {get} from 'lodash'
import {track} from 'utils/analytics'
import NextUpList from './next-up-list'
import {useNextForCollection} from '../../../hooks/use-next-up-data'
import CollectionLessonsList from './collection-lessons-list'

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
  description: string
  course: {
    title: string
    square_cover_480_url: string
    slug: string
    path: string
    lessons: any[]
  }
  [cssRelated: string]: any
  nextUp: any
  playerState: any
  progress: any
}

const LessonInfo: FunctionComponent<LessonInfoProps> = ({
  title,
  instructor,
  tags,
  description,
  course,
  nextUp,
  lesson,
  playerState,
  progress,
  ...restProps
}) => {
  return (
    <div {...restProps}>
      {course && (
        <div className="pt-6">
          <div className="flex items-center">
            <Link href={course.path}>
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
              <Link href={course.path}>
                <a
                  onClick={() => {
                    track(`clicked open course`, {
                      lesson: lesson.slug,
                    })
                  }}
                  className="hover:underline"
                >
                  <h3 className="font-semibold leading-tight text-md lg:text-lg">
                    {course.title}
                  </h3>
                </a>
              </Link>
            </div>
          </div>
        </div>
      )}

      {!playerState.matches('loading') && !course && nextUp && (
        <NextUpList nextUp={nextUp} currentLessonSlug={lesson.slug} />
      )}
      {course && course.lessons && (
        <CollectionLessonsList
          course={course}
          currentLessonSlug={lesson.slug}
          progress={progress}
        />
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
            <p className="text-sm text-gray-600">
              A Community Resource means that it’s free to access for all. The
              instructor of this lesson requested it to be open to the public.
            </p>
          </div>
        </div>
      )}
      <ul className="space-y-3 pt-6">
        {lesson?.code_url && (
          <CodeLink
            onClick={() => {
              track(`clicked open code`, {
                lesson: lesson.slug,
              })
            }}
            url={lesson.code_url}
          >
            Open code for this lesson
          </CodeLink>
        )}
        {lesson?.repo_url && (
          <CodeLink
            onClick={() => {
              track(`clicked open github`, {
                lesson: lesson.slug,
              })
            }}
            url={lesson.repo_url}
            icon={<IconGithub />}
          >
            Open code on GitHub
          </CodeLink>
        )}

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
    </div>
  )
}

export default LessonInfo

const CodeLink: FunctionComponent<{
  url: string
  icon?: React.ReactElement
  onClick?: () => void
}> = ({url, icon, onClick = () => {}, children}) => {
  return (
    <li className="flex items-center">
      <a
        href={url}
        rel="noreferrer"
        onClick={onClick}
        target="_blank"
        className="flex items-center text-blue-600 hover:underline font-semibold"
      >
        {icon ? icon : <IconCode />}
        {children}
      </a>
    </li>
  )
}

const IconCode: FunctionComponent<{className?: string}> = ({
  className = 'w-5 mr-2 text-blue-700',
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="18"
    viewBox="0 0 22 18"
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8,16 L12,0 M16,4 L20,8 L16,12 M4,12 L0,8 L4,4"
      transform="translate(1 1)"
    />
  </svg>
)

const IconGithub: FunctionComponent<{className?: string}> = ({
  className = 'w-5 mr-2 text-blue-700',
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
  >
    <path
      fill="currentColor"
      d="M10,-3.37507799e-14 C4.47500147,-3.37507799e-14 -1.03028697e-13,4.475 -1.03028697e-13,10 C-0.00232469848,14.3054085 2.75290297,18.1283977 6.83800147,19.488 C7.33800147,19.575 7.52500147,19.275 7.52500147,19.012 C7.52500147,18.775 7.51200147,17.988 7.51200147,17.15 C5,17.613 4.35000147,16.538 4.15000147,15.975 C4.03700147,15.687 3.55000147,14.8 3.12500147,14.562 C2.77500147,14.375 2.27500147,13.912 3.11200147,13.9 C3.90000147,13.887 4.46200147,14.625 4.65000147,14.925 C5.55000147,16.437 6.98800147,16.012 7.56200147,15.75 C7.65000147,15.1 7.91200147,14.663 8.20000147,14.413 C5.97500147,14.163 3.65000147,13.3 3.65000147,9.475 C3.65000147,8.387 4.03700147,7.488 4.67500147,6.787 C4.57500147,6.537 4.22500147,5.512 4.77500147,4.137 C4.77500147,4.137 5.61200147,3.875 7.52500147,5.163 C8.33906435,4.93706071 9.18016765,4.82334354 10.0250015,4.825 C10.8750015,4.825 11.7250015,4.937 12.5250015,5.162 C14.4370015,3.862 15.2750015,4.138 15.2750015,4.138 C15.8250015,5.513 15.4750015,6.538 15.3750015,6.788 C16.0120015,7.488 16.4000015,8.375 16.4000015,9.475 C16.4000015,13.313 14.0630015,14.163 11.8380015,14.413 C12.2000015,14.725 12.5130015,15.325 12.5130015,16.263 C12.5130015,17.6 12.5,18.675 12.5,19.013 C12.5,19.275 12.6880015,19.587 13.1880015,19.487 C17.2582356,18.112772 19.9988381,14.295964 20,10 C20,4.475 15.5250015,-3.37507799e-14 10,-3.37507799e-14 Z"
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
