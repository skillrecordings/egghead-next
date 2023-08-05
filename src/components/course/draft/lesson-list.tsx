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
import {Dialog, Disclosure, Transition} from '@headlessui/react'
import {ChevronDownIcon, DotsVerticalIcon} from '@heroicons/react/solid'
import {convertTimeWithTitles} from 'utils/time-utils'
import {trpc} from 'trpc/trpc.client'
import Spinner from 'components/spinner'
import {z} from 'zod'
import {Form, Formik} from 'formik'
import VideoUploader from 'components/upload/video-uploader'
import {twMerge} from 'tailwind-merge'
import useFileUploadReducer from 'hooks/use-file-upload-reducer'

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

const VideoResourceUpdateForm: React.FunctionComponent<
  React.PropsWithChildren<any>
> = ({setIsOpen, lessonId, lessonTitle}) => {
  const [fileUploadState, dispatch] = useFileUploadReducer([])

  const isUploaded = fileUploadState.files[0]?.percent === 100

  const createLessonMutation = trpc.instructor.replaceLessonVideo.useMutation<{
    description: string
    lessonId: string
    title: string
  }>({
    onSuccess: (data) => {
      toast.success(`${lessonTitle} video updated`, {
        duration: 6000,
        icon: '✅',
      })
    },
    onError: (error) => {
      toast.error(
        `There was a problem updating the video for this lesson. Contact egghead staff if the issue persists.`,
        {
          duration: 6000,
          icon: '❌',
        },
      )
    },
  })

  const uploadingFile = fileUploadState?.files[0]
  return (
    <Formik
      initialValues={{
        title: undefined,
        description: undefined,
        lessons: undefined,
      }}
      // validationSchema={emailChangeSchema}
      onSubmit={async (values) => {
        // Use the response from this later to update the lesson list.
        // We could also just do an optimistic update here.
        await createLessonMutation.mutateAsync({
          lessonId,
          originalVideoUrl: fileUploadState.files[0].signedUrl as string,
          title: lessonTitle,
        })
        setIsOpen(false)
      }}
    >
      {(props) => {
        const {
          values,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
        } = props
        return (
          <Form className="grow w-full" onSubmit={handleSubmit}>
            <div className="w-full mt-4 space-y-4 p-8">
              <label
                className={twMerge(
                  'flex justify-center h-48 px-4 transition-all bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none',
                  cx({
                    hidden: uploadingFile,
                  }),
                )}
              >
                <span className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="font-medium text-gray-600">
                    Drop video files, or{' '}
                    <span className="text-blue-600 underline">browse</span>
                  </span>
                </span>
                <VideoUploader dispatch={dispatch} />
              </label>
              <label
                className={twMerge(
                  'flex justify-center h-48 px-4 transition-all bg-white border-2 border-gray-300 rounded-md appearance-none hover:border-gray-400 focus:outline-none',
                  cx({
                    hidden: !uploadingFile,
                  }),
                )}
              >
                <span className="flex items-center space-x-2">
                  {uploadingFile?.percent === 100 ? (
                    <>
                      ✅
                      <span className="font-medium text-gray-600 ml-2">
                        {uploadingFile?.file?.name} uploaded
                      </span>
                    </>
                  ) : (
                    <>
                      <Spinner className="text-black dark:text-white" />
                      <span className="font-medium text-gray-600">
                        {uploadingFile?.file?.name} uploading...
                      </span>
                    </>
                  )}
                </span>
              </label>
              <div className="space-x-4 mt-12">
                <button
                  className=" bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded text-white disabled:bg-gray-200 disabled:hover:cursor-not-allowed"
                  type="submit"
                  disabled={!isUploaded}
                >
                  Submit
                </button>
                <button
                  className=" py-2 px-4 rounded text-red-500 hover:bg-red-50"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

export const VideoResourceUpdateDialog = ({
  isOpen,
  setIsOpen,
  sanityLessonId,
  lessonTitle,
}: {
  isOpen: boolean
  setIsOpen: Function
  sanityLessonId: string
  lessonTitle: string
}) => {
  return (
    <Transition show={isOpen} as="div">
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50 w-full"
      >
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black/30 dark:bg-white/30"
            aria-hidden="true"
          />
        </Transition.Child>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 flex items-center justify-center p-4 w-full">
            <Dialog.Panel className="flex flex-col items-center max-w-lg rounded dark:bg-gray-900 bg-white dark:text-gray-200 text-black p-8 w-full">
              <Dialog.Title className=" text-xl font-bold">
                Update Video for: {lessonTitle}
              </Dialog.Title>

              <VideoResourceUpdateForm
                setIsOpen={setIsOpen}
                lessonId={sanityLessonId}
                lessonTitle={lessonTitle}
              />
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}

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
  const [upDateVideoDialogIsOpen, setUpDateVideoDialogIsOpen] =
    React.useState(false)

  const updateLessonMutation =
    trpc.instructor.updateLessonMetadata.useMutation<{
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
    <li className="lg:w-[40ch]">
      <Disclosure>
        {({open}) => (
          <>
            <div className="flex py-2 font-semibold leading-tight justify-between min-h-[3rem]">
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
                        <a className="text-lg font-semibold hover:underline hover:text-blue-600 dark:text-gray-100 px-2 max-w-[40ch]">
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
                  <span className="font-semibold text-base self-center py-2 border border-transparent">
                    Video
                  </span>
                  <button
                    className={twMerge(
                      'font-semibold text-base text-blue-500 border border-transparent  hover:border hover:border-blue-500 py-2 px-4 rounded',
                      cx({
                        hidden: upDateVideoDialogIsOpen,
                      }),
                    )}
                    onClick={() => setUpDateVideoDialogIsOpen(true)}
                  >
                    Replace Video
                  </button>

                  <VideoResourceUpdateDialog
                    isOpen={upDateVideoDialogIsOpen}
                    setIsOpen={setUpDateVideoDialogIsOpen}
                    sanityLessonId={lesson.id}
                    lessonTitle={lessonTitle}
                  />
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
      <hr className=" opacity-50" />
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

const SortableLessonList: React.FunctionComponent<
  React.PropsWithChildren<{
    lessons: SanityLessonType[]
    handle: boolean
    courseId: string
  }>
> = ({lessons, handle, courseId}) => {
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
