import * as React from 'react'
import {FunctionComponent, ReactNode} from 'react'
import {Element, scroller} from 'react-scroll'
import SimpleBar from 'simplebar-react'
import {get} from 'lodash'
import Link from 'next/link'
import {track} from '@/utils/analytics'
import {convertTimeWithTitles} from '@/utils/time-utils'
import {LessonResource, SectionResource} from '@/types'
import * as Accordion from '@radix-ui/react-accordion'
import Balancer from 'react-wrap-balancer'
import {CheckIcon, ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/solid'

type NextUpListProps = {
  currentLessonSlug: string
  course: any
  progress: any
  onActiveTab: boolean
  lessons?: LessonResource[]
  sections?: SectionResource[]
}

const CollectionLessonsList: FunctionComponent<
  React.PropsWithChildren<NextUpListProps>
> = ({course, currentLessonSlug, progress, onActiveTab, lessons}) => {
  const [activeElement, setActiveElement] = React.useState(currentLessonSlug)
  const scrollableNodeRef: any = React.createRef()

  const lessonList = course ? course.lessons : lessons

  const AccordionLessonList = () => {
    const [openLesson, setOpenLesson] = React.useState<string[]>([])

    React.useEffect(() => {
      const currentLessonSectionIndex = course?.sections?.findIndex(
        (section: SectionResource) =>
          section.lessons.some((lesson) => lesson.slug === currentLessonSlug),
      )

      if (currentLessonSectionIndex !== -1) {
        setOpenLesson([`resource_${currentLessonSectionIndex}`])
      }
    }, [currentLessonSlug])

    const handleAccordionChange = (value: string[]): void => {
      setOpenLesson(value)
    }

    return (
      <>
        <Accordion.Root
          type="multiple"
          value={openLesson}
          onValueChange={handleAccordionChange}
        >
          {course?.sections?.map((section: SectionResource, index: number) => (
            <Accordion.Item key={index} value={`resource_${index}`}>
              <Accordion.Header className="relative z-10 overflow-hidden ">
                <Accordion.Trigger className="bg-gray-100 group relative z-10 flex w-full items-center justify-between  border border-white/5 dark:bg-gray-800/20 px-3 py-2.5 text-left shadow-lg transition dark:hover:bg-gray-800/40">
                  <Balancer>{section.title}</Balancer>
                  <div className="flex items-center">
                    {openLesson.includes(`resource_${index}`) ? (
                      <ChevronUpIcon
                        className="relative h-3 w-3 opacity-70 transition group-radix-state-open:rotate-180"
                        aria-hidden="true"
                      />
                    ) : (
                      <ChevronDownIcon
                        className="relative h-3 w-3 opacity-70 transition"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content>
                {section.lessons.map((lesson: LessonResource, index = 0) => {
                  const completedLessons = get(
                    progress,
                    'completed_lessons',
                    [],
                  ).map((lesson: LessonResource) => lesson.slug)
                  const completed =
                    lesson.completed || completedLessons.includes(lesson.slug)

                  return (
                    <li key={lesson.slug}>
                      {lesson.slug === currentLessonSlug && (
                        // @ts-ignore
                        <Element name={lesson.slug} />
                      )}
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
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </>
    )
  }

  React.useEffect(() => {
    setActiveElement(currentLessonSlug)
    scrollableNodeRef.current.id = 'scrollable-container'
    if (onActiveTab) {
      scroller.scrollTo(activeElement, {
        duration: 0,
        delay: 0,
        containerId: 'scrollable-container',
      })
    }
  }, [activeElement, setActiveElement, currentLessonSlug])

  return lessonList ? (
    <div className="h-full overflow-hidden">
      <div className="overflow-hidden bg-gray-100 dark:bg-gray-1000 dark:border-gray-800 h-96 lg:h-full">
        <SimpleBar
          autoHide={false}
          className="h-full"
          scrollableNodeProps={{ref: scrollableNodeRef}}
        >
          <ol className="h-full md:max-h-[350px] lg:max-h-full max-h-[300px]">
            {course?.sections ? (
              <AccordionLessonList />
            ) : (
              lessonList.map((lesson: LessonResource, index = 0) => {
                const completedLessons = get(
                  progress,
                  'completed_lessons',
                  [],
                ).map((lesson: LessonResource) => lesson.slug)
                const completed =
                  lesson.completed || completedLessons.includes(lesson.slug)

                return (
                  <li key={lesson.slug}>
                    {lesson.slug === currentLessonSlug && (
                      // @ts-ignore
                      <Element name={lesson.slug} />
                    )}
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
              })
            )}
          </ol>
        </SimpleBar>
      </div>
    </div>
  ) : null
}

const Item: FunctionComponent<
  React.PropsWithChildren<{
    lesson: any
    active: boolean
    className?: string
    index: number
    completed: boolean
  }>
> = ({lesson, className, index, completed, active = false, ...props}) => {
  const Item = () => (
    <div
      className={`group flex p-3 ${
        active
          ? 'font-semibold bg-blue-600 text-gray-100'
          : 'hover:text-blue-600 hover:bg-blue-50 dark:hover:text-white dark:hover:bg-gray-800 active:bg-blue-100'
      } transition-colors ease-in-out duration-150`}
      {...props}
    >
      <div className="flex items-start">
        <div
          className={`w-6 leading-5 pt-px text-xs ${
            completed
              ? `opacity-100 ${
                  active ? 'text-white' : 'text-blue-600 dark:text-green-400'
                }`
              : 'opacity-60 group-hover:opacity-100'
          } font-normal tracking-tight`}
        >
          {completed ? <CheckIcon /> : index + 1}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="w-full leading-tight">{lesson.title} </div>
        <div>
          <span
            className={`${
              active ? 'text-gray-200' : 'text-gray-700 dark:text-gray-400'
            } text-xs`}
          >
            {convertTimeWithTitles(lesson.duration, {showSeconds: true})}
          </span>
        </div>
      </div>
    </div>
  )
  return active ? (
    <Item />
  ) : (
    <Link
      href={lesson.path}
      onClick={() => {
        track(`clicked next up lesson`, {
          lesson: lesson.slug,
        })
      }}
      className="font-semibold"
    >
      <Item />
    </Link>
  )
}

export default CollectionLessonsList
