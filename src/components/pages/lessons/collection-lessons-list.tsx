import * as React from 'react'
import {FunctionComponent} from 'react'
import {Element, scroller} from 'react-scroll'
import {LessonResource} from 'types'
import {get} from 'lodash'
import Link from 'next/link'
import {track} from 'utils/analytics'

type NextUpListProps = {
  currentLessonSlug: string
  course: any
  progress: any
  nextToVideo: boolean
}

const CollectionLessonsList: FunctionComponent<NextUpListProps> = ({
  course,
  currentLessonSlug,
  progress,
  nextToVideo
}) => {
  const {lessons} = course
  const [activeElement, setActiveElement] = React.useState(currentLessonSlug)
  const scrollableNodeRef: any = React.createRef()

  React.useEffect(() => {
    setActiveElement(currentLessonSlug)
    scroller.scrollTo(activeElement, {
      duration: 0,
      delay: 0,
      containerId: 'scroller-container',
    })
  }, [activeElement, setActiveElement, currentLessonSlug])

  return lessons ? (
    <div className={nextToVideo ? 'h-full overflow-hidden' : ''}>
      {/* <span className="font-semibold opacity-80 uppercase text-xs leading-wide">
        Lessons
      </span> */}
      <div className={`overflow-hidden bg-white border-gray-100 ${nextToVideo ? 'h-full' : 'rounded-md border border-gray-100 mt-2'}`}>
        <ol
          ref={scrollableNodeRef}
          id="scroller-container"
          className="overflow-y-auto h-full"
          css={{
            '@media only screen and (min-width: 640px)': {maxHeight: nextToVideo ? '100%' : 600},
            maxHeight: 300,
          }}
        >
          {lessons.map((lesson: LessonResource, index = 0) => {
            const completedLessons = get(progress, 'completed_lessons', []).map(
              (lesson: LessonResource) => lesson.slug,
            )
            const completed = completedLessons.includes(lesson.slug)
            return (
              <li key={lesson.slug}>
                <Element name={lesson.slug} />
                <div>
                  <Item
                    active={lesson.slug === currentLessonSlug}
                    lesson={lesson}
                    index={index}
                    completed={completed}
                    className="hover:text-blue-600 hover:bg-blue-50 active:bg-blue-100"
                  />
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  ) : null
}

const Item: FunctionComponent<{
  lesson: any
  active: boolean
  className?: string
  index: number
  completed: boolean
}> = ({lesson, className, index, completed, active = false, ...props}) => {
  const Item = () => (
    <div
      className={`group flex p-3 ${
        active
          ? 'font-semibold bg-blue-600 text-white'
          : 'hover:text-blue-600 hover:bg-blue-50 active:bg-blue-100'
      } transition-colors ease-in-out duration-150`}
      {...props}
    >
      <div className="flex items-start">
        <div
          className={`w-6 leading-5 pt-px text-xs ${
            completed
              ? `opacity-100 ${active ? 'text-white' : 'text-blue-600'}`
              : 'opacity-60 group-hover:opacity-100'
          } font-normal tracking-tight`}
        >
          {completed ? <CheckIcon /> : index + 1}
        </div>
      </div>
      <div className="w-full leading-tight">{lesson.title}</div>
    </div>
  )
  return active ? (
    <Item />
  ) : (
    <Link href={lesson.path}>
      <a
        onClick={() => {
          track(`clicked next up lesson`, {
            lesson: lesson.slug,
          })
        }}
        className="font-semibold"
      >
        <Item />
      </a>
    </Link>
  )
}

const CheckIcon = () => (
  <svg
    className="transform -translate-x-1"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z"
        fill="currentColor"
      />
    </g>
  </svg>
)

export default CollectionLessonsList
