import React, {FunctionComponent, useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {isEmpty, get} from 'lodash'
import Markdown from 'react-markdown'
import useCopyToClipboard from 'react-use/lib/useCopyToClipboard'
import Eggo from '../../../components/images/eggo.svg'
import {useNextUpData} from 'hooks/use-next-up-data'
import {Element, scroller} from 'react-scroll'

type NextUpListProps = {
  currentLessonSlug: string
  url: string
}

const NextUpList: FunctionComponent<NextUpListProps> = ({
  url,
  currentLessonSlug,
}) => {
  const {nextUpData} = useNextUpData(url)
  const [activeElement] = React.useState(currentLessonSlug)
  const scrollableNodeRef: any = React.createRef()

  React.useEffect(() => {
    nextUpData &&
      scroller.scrollTo(activeElement, {
        duration: 0,
        delay: 0,
        containerId: 'scroll-container',
      })
  }, [activeElement, nextUpData])

  return nextUpData ? (
    <div className="pt-6">
      <span className="font-semibold ">Lessons</span>
      <div className="overflow-hidden rounded-md border border-gray-100 mt-2">
        <ol
          ref={scrollableNodeRef}
          id="scroll-container"
          className="overflow-y-auto h-full"
          css={{
            '@media only screen and (min-width: 640px)': {maxHeight: 600},
            maxHeight: 300,
          }}
        >
          {nextUpData.list.lessons.map(
            (lesson: {slug: any; title: any; path: any}, index = 0) => {
              const Item: FunctionComponent<{className?: string}> = ({
                className,
              }) => {
                return (
                  <div
                    className={`flex p-3 ${
                      className ? className : ''
                    } transition-colors ease-in-out duration-150`}
                  >
                    <div className="flex items-center mr-2">
                      <div className="mr-1 text-xs opacity-50 tracking-tight">
                        {index + 1}
                      </div>
                      {/* <input
                type="form-checkbox"
                checked={lesson.completed}
                readOnly
              /> */}
                    </div>
                    <div className="w-full leading-tight">{lesson.title}</div>
                  </div>
                )
              }

              return (
                <li key={lesson.slug}>
                  <Element name={lesson.slug} />
                  <div>
                    {lesson.slug !== currentLessonSlug ? (
                      <Link href={lesson.path}>
                        <a className="font-semibold">
                          <Item className="hover:text-blue-600 hover:bg-blue-50 active:bg-blue-100" />
                        </a>
                      </Link>
                    ) : (
                      <Item className="font-semibold bg-blue-50 text-blue-600" />
                    )}
                  </div>
                </li>
              )
            },
          )}
        </ol>
      </div>
    </div>
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
  const encodeTweetUrl = () => {
    const twitterBase = `https://twitter.com/intent/tweet/?text=`
    const instructorTwitterText = isEmpty(get(instructor, 'twitter'))
      ? ''
      : ` by @${instructor.twitter}`
    const tweetText = `${lesson.title} ${instructorTwitterText}, lesson on @eggheadio`
    const encodeLessonUrl = encodeURIComponent(
      process.env.NEXT_PUBLIC_REDIRECT_URI + lesson.path,
    )
    const tweetParams = `&url=${encodeLessonUrl}`
    return twitterBase + tweetText + tweetParams
  }
  return get(lesson, 'title') && get(lesson, 'path') ? (
    <a
      className={`flex text-sm items-center rounded px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors ease-in-out duration-150 ${className}`}
      target="_blank"
      rel="noopener noreferrer"
      href={encodeTweetUrl()}
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
          className={`rounded text-sm px-3 py-2 flex justify-center items-center bg-gray-100 hover:bg-gray-200 transition-colors duration-150 ease-in-out ${className}`}
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

const CodeLink: FunctionComponent<{url: string; icon?: React.ReactElement}> = ({
  url,
  icon,
  children,
}) => {
  return (
    <li className="flex items-center">
      <a
        href={url}
        rel="noreferrer"
        target="_blank"
        className="flex items-center text-blue-600 hover:underline font-semibold"
      >
        {icon ? icon : <IconCode />}
        {children}
      </a>
    </li>
  )
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
  nextUpUrl: string
  playerState: any
}

const LessonInfo: FunctionComponent<LessonInfoProps> = ({
  title,
  instructor,
  tags,
  summary,
  course,
  nextUpUrl,
  lesson,
  playerState,
  ...restProps
}) => {
  return (
    <div {...restProps}>
      <div className="space-y-4">
        {title && (
          <h1 className="font-bold leading-tighter text-lg lg:text-xl">
            {title}
          </h1>
        )}
        {summary && <Markdown className="prose">{summary}</Markdown>}
      </div>
      <ul className="space-y-3 pt-6">
        {lesson?.code_url && (
          <CodeLink url={lesson.code_url}>Open code for this lesson</CodeLink>
        )}
        {lesson?.repo_url && (
          <CodeLink url={lesson.repo_url} icon={<IconGithub />}>
            Open code on GitHub
          </CodeLink>
        )}
        {lesson.download_url && (
          <li className="flex items-center">
            <a
              href={lesson.download_url}
              className="flex items-center text-blue-600 hover:underline font-semibold"
            >
              <IconDownload className="w-5 mr-2 text-blue-700" />
              Download
            </a>
          </li>
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
      <div className="pt-6 grid xl:grid-cols-2 md:grid-cols-1 grid-cols-2 gap-5">
        {instructor && (
          <div>
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
        {!isEmpty(tags) && (
          <div>
            <h4 className="font-semibold">Tech used</h4>
            <ul
              className="grid gap-3 mt-5"
              css={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))',
              }}
            >
              {tags.map((tag, index) => (
                <li key={index}>
                  <Link href={`/q/${tag.name}`}>
                    <a className="inline-flex items-center first:ml-0 hover:underline">
                      <Image
                        src={tag.image_url}
                        alt={tag.name}
                        width={24}
                        height={24}
                        className="flex-shrink-0"
                      />
                      <span className="ml-1 capitalize">{tag.name}</span>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
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
      {!playerState.matches('loading') && nextUpUrl && (
        <NextUpList url={nextUpUrl} currentLessonSlug={lesson.slug} />
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
