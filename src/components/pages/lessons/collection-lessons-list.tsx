import * as React from 'react'
import {FunctionComponent} from 'react'
import {Element, scroller} from 'react-scroll'
import {LessonResource} from 'types'
import {get} from 'lodash'
import Link from 'next/link'
import {track} from 'utils/analytics'
import {useNextForCollection} from '../../../hooks/use-next-up-data'

type NextUpListProps = {
  currentLessonSlug: string
  course: any
  progress: any
}

const CollectionLessonsList: FunctionComponent<NextUpListProps> = ({
  course,
  currentLessonSlug,
  progress,
}) => {
  const {lessons} = course
  const [activeElement] = React.useState(currentLessonSlug)
  const scrollableNodeRef: any = React.createRef()
  const nextLesson = useNextForCollection(course, currentLessonSlug)

  React.useEffect(() => {
    course &&
      scroller.scrollTo(activeElement, {
        duration: 0,
        delay: 0,
        containerId: 'scroll-container',
      })
  }, [activeElement, course])

  return lessons ? (
    <div className="pt-6">
      <span className="font-semibold ">Course Lessons</span>
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
          {lessons.map((lesson: LessonResource, index = 0) => {
            const completedLessons = get(progress, 'completed_lessons', []).map(
              (lesson: LessonResource) => lesson.slug,
            )
            const completed = completedLessons.includes(lesson.slug)
            return (
              <li key={lesson.slug}>
                <Element name={lesson.slug} />
                <div>
                  {lesson.slug !== currentLessonSlug ? (
                    <Link href={lesson.path}>
                      <a
                        onClick={() => {
                          track(`clicked next up lesson`, {
                            lesson: lesson.slug,
                          })
                        }}
                        className="font-semibold"
                      >
                        <Item
                          title={lesson.title}
                          index={index}
                          completed={completed}
                          className="hover:text-blue-600 hover:bg-blue-50 active:bg-blue-100"
                        />
                      </a>
                    </Link>
                  ) : (
                    <Item
                      title={lesson.title}
                      index={index}
                      completed={completed}
                      className="font-semibold bg-blue-50 text-blue-600"
                    />
                  )}
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
  className?: string
  title: string
  index: number
  completed: boolean
}> = ({className, title, index, completed}) => {
  return (
    <div
      className={`flex p-3 ${
        className ? className : ''
      } transition-colors ease-in-out duration-150`}
    >
      <div className="flex items-center mr-2">
        <div className="mr-1 text-xs opacity-50 tracking-tight">
          {completed ? `✔️` : index + 1}
        </div>
        {/* <input
                type="form-checkbox"
                checked={lesson.completed}
                readOnly
              /> */}
      </div>
      <div className="w-full leading-tight">{title}</div>
    </div>
  )
}

export default CollectionLessonsList
