import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import cx from 'classnames'
import MuxPlayer from '@mux/mux-player-react'
import {
  closestCenter,
  DndContext,
  DraggableSyntheticListeners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {Disclosure, Transition} from '@headlessui/react'
import {ChevronDownIcon, DotsVerticalIcon} from '@heroicons/react/solid'
import {convertTimeWithTitles} from 'utils/time-utils'
import {trpc} from 'trpc/trpc.client'
import Spinner from 'components/spinner'
import {z} from 'zod'

const SanityLessonSchema = z.object({
  key: z.string(),
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.string(),
  icon_url: z.string(),
  duration: z.number(),
  path: z.string(),
  videoResourceId: z.string(),
})
type SanityLessonType = z.infer<typeof SanityLessonSchema>

const LessonListItem = ({
  lesson,
  handle,
  handleProps,
  listeners,
}: {
  lesson: SanityLessonType
  handle?: boolean
  handleProps: any
  listeners: DraggableSyntheticListeners
}) => {
  const [displayTitle, setDisplayTitle] = React.useState(lesson.title)
  const [lessonTitle, setLessonTitle] = React.useState(lesson.title)
  const [lessonDescription, setLessonDescription] = React.useState(
    lesson.description,
  )
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const updateLessonMutation = trpc.instructor.updateLesson.useMutation<{
    title: string
    description: string
    id: string
  }>({
    onSuccess: (data) => {
      setIsSubmitting(false)
      toast.success(`Your lesson has been updated.`, {
        duration: 6000,
        icon: '✅',
      })
    },
    onError: (error) => {
      setDisplayTitle(lesson.title)
      toast.error(
        `There was a problem updating your lesson. Contact egghead staff if the issue persists.`,
        {
          duration: 6000,
          icon: '❌',
        },
      )
    },
  })

  return (
    <li className="w-[45ch]">
      <Disclosure>
        {({open}) => (
          <>
            <div className="flex py-2 font-semibold leading-tight justify-between h-[3rem]">
              <div className="flex">
                <div className="flex items-center mr-2 space-x-2 cursor-grab">
                  {handle ? (
                    <div className="flex" ref={handleProps.ref} {...listeners}>
                      <DotsVerticalIcon
                        height={20}
                        className="text-gray-700 dark:text-gray-500"
                      />
                      <DotsVerticalIcon
                        height={20}
                        className="text-gray-700 dark:text-gray-500 -ml-[14px]"
                      />
                    </div>
                  ) : null}
                  {lesson.icon_url && (
                    <div className="flex items-center flex-shrink-0 w-8">
                      <Image src={lesson.icon_url} width={24} height={24} />
                    </div>
                  )}
                </div>
                {lesson.path && (
                  <div className="flex flex-col ">
                    <div>
                      <Link href={lesson.path}>
                        <a className="text-lg font-semibold hover:underline hover:text-blue-600 dark:text-gray-100">
                          {displayTitle}
                        </a>
                      </Link>
                    </div>
                    {/* <div className="text-xs text-gray-700 dark:text-gray-500">
                      {lesson.duration
                        ? convertTimeWithTitles(lesson.duration, {
                            showSeconds: true,
                          })
                        : '0m 0s'}
                    </div> */}
                  </div>
                )}
              </div>
              <Disclosure.Button>
                <ChevronDownIcon
                  data-headlessui-state="open"
                  height={20}
                  className={`self-center
                  ${cx({
                    'transform rotate-180': open,
                  })}
                `}
                />
              </Disclosure.Button>
            </div>
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel className="mx-4 mb-4 space-y-4">
                <label className="font-semibold text-base">
                  Title
                  <input
                    type="text"
                    id="title"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    className="bg-gray-50 dark:bg-gray-800 focus:outline-none focus:shadow-outline border border-gray-100 dark:border-gray-700 rounded-md py-2 px-4 block w-full appearance-none leading-normal resize-y prose text-gray-900 dark:prose-dark md:prose-lg md:dark:prose-lg-dark dark:text-gray-100 dark:prose-a:text-blue-300 dark:hover:prose-a:text-blue-200 prose-a:text-blue-500 hover:prose-a-:text-blue-600 mb-4"
                  />
                </label>

                <label className="font-semibold text-base">
                  Tag
                  <input
                    type="text"
                    id="tag"
                    className="bg-gray-50 dark:bg-gray-800 focus:outline-none focus:shadow-outline border border-gray-100 dark:border-gray-700 rounded-md py-2 px-4 block w-full appearance-none leading-normal resize-y prose text-gray-900 dark:prose-dark md:prose-lg md:dark:prose-lg-dark dark:text-gray-100 dark:prose-a:text-blue-300 dark:hover:prose-a:text-blue-200 prose-a:text-blue-500 hover:prose-a-:text-blue-600 mb-4"
                  />
                </label>

                <label className="font-semibold text-base">
                  Description
                  <textarea
                    rows={5}
                    id="description"
                    value={lessonDescription}
                    onChange={(e) => setLessonDescription(e.target.value)}
                    className="bg-gray-50 dark:bg-gray-800 focus:outline-none focus:shadow-outline border border-gray-100 dark:border-gray-700 rounded-md py-2 px-4 blockappearance-none leading-normal resize-y prose text-gray-900 dark:prose-dark md:prose-lg md:dark:prose-lg-dark dark:text-gray-100 dark:prose-a:text-blue-300 dark:hover:prose-a:text-blue-200 prose-a:text-blue-500 hover:prose-a-:text-blue-600 w-full"
                  />
                </label>

                <div className="flex flew-row justify-between">
                  <span className="font-semibold text-base self-center">
                    Video
                  </span>
                  <button className="font-semibold text-base text-blue-500 border border-transparent  hover:border hover:border-blue-500 py-2 px-4 rounded">
                    Replace Video
                  </button>
                </div>

                <MuxPlayer playbackId={lesson.videoResourceId} />

                <button
                  className="px-4 py-2 bg-blue-500  hover:bg-blue-400  text-white  rounded flex flex-row gap-1 align-middle justify-center place-self-center font-medium disabled:opacity-50"
                  disabled={isSubmitting}
                  onClick={async () => {
                    setIsSubmitting(true)
                    setDisplayTitle(lessonTitle)
                    await updateLessonMutation.mutateAsync({
                      lessonId: lesson.id,
                      title: lessonTitle,
                      description: lessonDescription,
                    })
                  }}
                >
                  {isSubmitting ? (
                    <Spinner
                      size={4}
                      className={`text-black dark:text-white`}
                    />
                  ) : (
                    'Save'
                  )}
                </button>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
      <hr />
    </li>
  )
}

const SortableLessonListItem = ({
  lesson,
  handle,
}: {
  lesson: SanityLessonType
  handle?: boolean
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
  } = useSortable({id: lesson.id})

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(!handle ? listeners : undefined)}
    >
      <LessonListItem
        lesson={lesson}
        handle={handle}
        handleProps={handle ? {ref: setActivatorNodeRef} : undefined}
        listeners={listeners}
      />
    </div>
  )
}

const SortableLessonList: React.FunctionComponent<{
  lessons: SanityLessonType[]
  handle: boolean
  courseId: string
}> = ({lessons, handle, courseId}) => {
  const [sortedLessons, setSortedLessons] = React.useState(lessons)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )
  const timeout = React.useRef<any>()
  const updateCourseListOrderMutation =
    trpc.instructor.updateLessonListOrder.useMutation({
      onSuccess: (data) => {
        toast.success(`Lesson order has been updated.`, {
          duration: 6000,
          icon: '✅',
        })
      },
      onError: (error) => {
        setSortedLessons(lessons)
        toast.error(
          `There was a problem updating the lesson order, reset back to original. Contact egghead staff if the issue persists.`,
          {
            duration: 6000,
            icon: '❌',
          },
        )
      },
    })

  function handleDragEnd(event: any) {
    clearTimeout(timeout.current)

    const {active, over} = event

    const oldIndex = sortedLessons.findIndex((obj) => obj.id === active.id)
    const newIndex = sortedLessons.findIndex((obj) => obj.id === over.id)

    if (active.id !== over.id) {
      setSortedLessons((sortedLessons) => {
        let newSortedLessons = arrayMove(sortedLessons, oldIndex, newIndex)

        timeout.current = setTimeout(() => {
          updateCourseListOrderMutation.mutate({
            courseId,
            lessons: newSortedLessons.map((lesson) => {
              return {id: lesson.id, key: lesson.key}
            }),
          })
        }, 3000)

        return arrayMove(sortedLessons, oldIndex, newIndex)
      })
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sortedLessons}
        strategy={verticalListSortingStrategy}
      >
        {sortedLessons.map((lesson) => (
          <SortableLessonListItem key={lesson.id} lesson={lesson} handle />
        ))}
      </SortableContext>
    </DndContext>
  )
}

export const LessonList = ({
  courseId,
  setDialog,
}: {
  courseId: string
  setDialog: Function
}) => {
  const {data: lessons} = trpc.instructor.draftCourseLessonList.useQuery({
    courseId,
  })

  return lessons ? (
    <div>
      <ul>
        <SortableLessonList lessons={lessons} courseId={courseId} handle />
      </ul>
    </div>
  ) : (
    <p className="text-lg font-semibold text-black dark:text-white">
      You haven't created any lessons yet!
    </p>
  )
}
