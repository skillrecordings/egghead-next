import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Markdown from 'react-markdown'
import InstructorProfile from 'components/pages/courses/instructor-profile'
import PlayIcon from 'components/pages/courses/play-icon'
import {
  XCircleIcon,
  CheckCircleIcon,
  PlusIcon,
  DotsVerticalIcon,
  ChevronDownIcon,
} from '@heroicons/react/outline'
import Spinner from 'components/spinner'
import {get, first, filter, isEmpty, truncate} from 'lodash'
import {NextSeo} from 'next-seo'
import removeMarkdown from 'remove-markdown'
import {track} from 'utils/analytics'
import {convertTimeWithTitles} from 'utils/time-utils'
import ClockIcon from '../icons/clock'
import {LessonResource} from 'types'
import LearnerRatings from '../pages/courses/learner-ratings'
import CommunityResource from 'components/community-resource'
import TagList from './tag-list'
import {useTheme} from 'next-themes'
import ClosedCaptionIcon from '../icons/closed-captioning'
import {HorizontalResourceCard} from '../card/horizontal-resource-card'
import {Field, Form, Formik} from 'formik'
import {useMachine} from '@xstate/react'
import {
  requestDraftCourseChangeMachine,
  DoneEventObject,
} from 'machines/draft-course-machine'
import {trpc} from 'trpc/trpc.client'
import toast from 'react-hot-toast'
import {Dialog, Transition, Disclosure} from '@headlessui/react'
import useFileUploadReducer from 'hooks/use-file-upload-reducer'
import VideoUploader from 'components/upload/video-uploader'
import cx from 'classnames'
import MuxPlayer from '@mux/mux-player-react'
import {z} from 'zod'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DraggableSyntheticListeners,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import {AnyClass} from '@casl/ability/dist/types/types'

type CoursePageLayoutProps = {
  lessons: any
  course: any
  ogImageUrl: string
}

type SanitySlug = {
  current: string
}

type SanityReference = {
  _type: 'reference'
  _ref: string
}

type SanityReferenceArray = Array<
  {
    _key: string
  } & SanityReference
>

type SanitySoftwareLibrary = {
  _type: 'versioned-software-library'
  _key: string
  library: SanityReference
}

const SanityLesson = z.object({
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
type SanityLesson = z.infer<typeof SanityLesson>

type CollectionResource = {
  title: string
  duration: number
  instructor: {
    full_name: string
  }
  square_cover_url: string
  image_url: string
  path: string
  slug: string
  description: string
}

export const logCollectionResource = (collection: CollectionResource) => {
  if (typeof window !== 'undefined') {
    const {
      title,
      duration,
      instructor,
      square_cover_url,
      image_url,
      path,
      slug,
      description,
    } = collection
    const image = square_cover_url || image_url
    const formattedDuration = convertTimeWithTitles(duration)
    const byline = `${
      instructor?.full_name && `${instructor.full_name}・`
    }${formattedDuration}・Course`

    console.debug('collection resource', {
      title,
      byline,
      ...(!!image && {image}),
      path,
      slug,
      description,
    })
  }
}

export const Duration: React.FunctionComponent<{duration: string}> = ({
  duration,
}) => (
  <div className="flex flex-row items-center">
    <ClockIcon className="w-4 h-4 mr-1 opacity-60" />
    <span>{duration}</span>{' '}
    <ClosedCaptionIcon className="inline-block w-4 h-4 ml-2" />
  </div>
)

const TitleChangeForm: React.FunctionComponent<RequestDraftCourseFormProps> = ({
  title,
  sanityCourseId,
}) => {
  const [state, send] = useMachine(requestDraftCourseChangeMachine, {
    services: {
      requestChange: (_, event: DoneEventObject) => {
        return updateCourseTitleMutation.mutateAsync({
          title: event.data.title,
          id: sanityCourseId,
        })
      },
    },
  })
  const updateCourseTitleMutation =
    trpc.instructor.updateDraftCourseTitle.useMutation<{
      title: string
      id: string
    }>({
      onSuccess: (data) => {
        toast.success(`Your course title has been updated.`, {
          duration: 6000,
          icon: '✅',
        })
      },
      onError: (error) => {
        toast.error(
          `There was a problem updating your course title. Contact egghead staff if the issue persists.`,
          {
            duration: 6000,
            icon: '❌',
          },
        )
      },
    })
  let currentTitle = state.context.title ? state.context.title : title
  const isEditingOrSubmtting = state.matches('edit') || state.matches('loading')
  return (
    <Formik
      initialValues={{title: currentTitle}}
      // validationSchema={emailChangeSchema}
      onSubmit={async (values) => {
        send({type: 'SUBMIT', data: {title: values.title}})
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
          <form className="grow" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <div className="relative flex flex-col sm:flex-row sm:space-y-0 sm:space-x-2 text-center sm:text-left">
                {isEditingOrSubmtting ? (
                  <div className="container w-full px-0">
                    <div className="flex flex-row-reverse gap-1 absolute -top-6 right-0 z-10">
                      <button type="submit" disabled={isSubmitting}>
                        <CheckCircleIcon
                          className="text-green-400"
                          height={20}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFieldValue('title', currentTitle)
                          send({type: 'CANCEL'})
                        }}
                      >
                        <XCircleIcon className="text-red-400" height={20} />
                      </button>
                      <Spinner
                        size={4}
                        className={`text-black dark:text-white
                          ${cx({
                            hidden: !state.matches('loading'),
                          })}
                        `}
                      />
                    </div>
                    <textarea
                      rows={3}
                      maxLength={90}
                      id="title"
                      value={isEditingOrSubmtting ? values.title : title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      autoFocus
                      disabled={isSubmitting || !state.matches('edit')}
                      className="p-2 text-2xl font-bold leading-tight text-center sm:text-3xl md:text-4xl md:leading-tighter md:text-left md:mt-0 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:shadow-outline border border-gray-100 dark:border-gray-700 rounded-md w-full max-w-[34ch] break-normal"
                    />
                  </div>
                ) : (
                  <>
                    <div
                      className="container relative px-0 cursor-pointer border-2 border-transparent hover:box-border hover:border-2 hover:border-blue-500 rounded hover:bg-gray-100 hover:dark:bg-gray-800"
                      onClick={() => send({type: 'EDIT'})}
                    >
                      <h1 className="p-2 mt-4 text-2xl font-bold leading-tight text-center sm:text-3xl md:text-4xl md:leading-tighter md:text-left md:mt-0">
                        {currentTitle}
                      </h1>
                    </div>
                  </>
                )}
              </div>
            </div>
          </form>
        )
      }}
    </Formik>
  )
}

export type RequestDraftCourseFormProps = {
  description?: string
  title?: string
  sanityCourseId: string
}

const DescriptionChangeForm: React.FunctionComponent<RequestDraftCourseFormProps> =
  ({description, sanityCourseId}) => {
    const [state, send] = useMachine(requestDraftCourseChangeMachine, {
      services: {
        requestChange: (_, event: DoneEventObject) => {
          return updateCourseDescriptionMutation.mutateAsync({
            description: event.data.description,
            id: sanityCourseId,
          })
        },
      },
    })
    const updateCourseDescriptionMutation =
      trpc.instructor.updateDraftCourseDescription.useMutation<{
        description: string
        id: string
      }>({
        onSuccess: (data) => {
          toast.success(`Your course description has been updated.`, {
            duration: 6000,
            icon: '✅',
          })
        },
        onError: (error) => {
          toast.error(
            `There was a problem updating your course description. Contact egghead staff if the issue persists.`,
            {
              duration: 6000,
              icon: '❌',
            },
          )
        },
      })

    let currentDescription = state.context.description
      ? state.context.description
      : description

    const isEditingOrSubmtting =
      state.matches('edit') || state.matches('loading')
    return (
      <Formik
        initialValues={{description: currentDescription}}
        // validationSchema={emailChangeSchema}
        onSubmit={async (values) => {
          send({type: 'SUBMIT', data: {description: values.description}})
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
            <form className="grow" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2o">
                  {isEditingOrSubmtting ? (
                    <div className="relative w-full">
                      <div className="flex flex-row-reverse gap-1 absolute -top-6 right-0 z-10">
                        <button type="submit" disabled={isSubmitting}>
                          <CheckCircleIcon
                            className="text-green-400"
                            height={20}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFieldValue('description', currentDescription)
                            send({type: 'CANCEL'})
                          }}
                        >
                          <XCircleIcon className="text-red-400" height={20} />
                        </button>
                        <Spinner
                          size={4}
                          className={`text-black dark:text-white
                            ${cx({
                              hidden: !state.matches('loading'),
                            })}
                          `}
                        />
                      </div>
                      <textarea
                        rows={20}
                        id="description"
                        value={
                          isEditingOrSubmtting
                            ? values.description
                            : description
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoFocus
                        required
                        disabled={isSubmitting || !state.matches('edit')}
                        className="bg-gray-50 dark:bg-gray-800 focus:outline-none focus:shadow-outline border border-gray-100 dark:border-gray-700 rounded-md w-full appearance-none  prose text-gray-900 dark:prose-dark md:prose-lg md:dark:prose-lg-dark dark:text-gray-100 dark:prose-a:text-blue-300 dark:hover:prose-a:text-blue-200 prose-a:text-blue-500 hover:prose-a-:text-blue-600"
                      />
                    </div>
                  ) : (
                    <>
                      <div
                        className="container px-0 cursor-pointer border-2 border-transparent hover:box-border hover:border-2 hover:border-blue-500 rounded hover:bg-gray-100 hover:dark:bg-gray-800"
                        onClick={() => send({type: 'EDIT'})}
                      >
                        {currentDescription && (
                          <Markdown
                            allowDangerousHtml
                            className="mb-6 mt-2 px-4 text-gray-900 dark:prose-dark md:prose-lg md:dark:prose-lg-dark dark:text-gray-100  prose dark:prose-a:text-blue-300 dark:hover:prose-a:text-blue-200 prose-a:text-blue-500 hover:prose-a-:text-blue-600"
                          >
                            {currentDescription}
                          </Markdown>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </form>
          )
        }}
      </Formik>
    )
  }

const LessonCreationForm: React.FunctionComponent<any> = ({
  setIsOpen,
  sanityCourseId,
}) => {
  const [fileUploadState, dispatch] = useFileUploadReducer([])

  const isUploaded = fileUploadState.files[0]?.percent === 100

  console.log({fileUploadState})

  const createLessonMutation = trpc.instructor.createLesson.useMutation<{
    description: string
    sanityCourseId: string
    title: string
  }>({
    onSuccess: (data) => {
      toast.success(`Lesson added.`, {
        duration: 6000,
        icon: '✅',
      })
    },
    onError: (error) => {
      toast.error(
        `There was a problem adding this lesson. Contact egghead staff if the issue persists.`,
        {
          duration: 6000,
          icon: '❌',
        },
      )
    },
  })

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
          description: values.description,
          sanityCourseId,
          title: values.title,
          awsFilename: fileUploadState.files[0].signedUrl as string,
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
          <Form className="grow w-fit" onSubmit={handleSubmit}>
            <div className="w-full mt-4 space-y-4 p-8">
              <label className="font-semibold text-base">
                Lesson Title
                <Field
                  type="input"
                  id="title"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  disabled={isSubmitting}
                  className="bg-gray-50 dark:bg-gray-800 focus:outline-none focus:shadow-outline border border-gray-100 dark:border-gray-700 rounded-md py-2 px-4 block w-full appearance-none leading-normal resize-y prose text-gray-900 dark:prose-dark md:prose-lg md:dark:prose-lg-dark dark:text-gray-100 dark:prose-a:text-blue-300 dark:hover:prose-a:text-blue-200 prose-a:text-blue-500 hover:prose-a-:text-blue-600 mb-4"
                />
              </label>
              <label className="font-semibold text-base">
                Lesson description
                <Field
                  as="textarea"
                  rows={5}
                  id="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  disabled={isSubmitting}
                  className="bg-gray-50 dark:bg-gray-800 focus:outline-none focus:shadow-outline border border-gray-100 dark:border-gray-700 rounded-md py-2 px-4 blockappearance-none leading-normal resize-y prose text-gray-900 dark:prose-dark md:prose-lg md:dark:prose-lg-dark dark:text-gray-100 dark:prose-a:text-blue-300 dark:hover:prose-a:text-blue-200 prose-a:text-blue-500 hover:prose-a-:text-blue-600 w-96"
                />
              </label>
              <label className="flex justify-center h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
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
              <div className="space-x-4 mt-4">
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

const LessonCreationDialog = ({
  isOpen,
  setIsOpen,
  sanityCourseId,
}: {
  isOpen: boolean
  setIsOpen: Function
  sanityCourseId: string
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
                Create a Lesson
              </Dialog.Title>

              <LessonCreationForm
                setIsOpen={setIsOpen}
                sanityCourseId={sanityCourseId}
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
  lesson: SanityLesson
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
            <div className="flex py-2 font-semibold leading-tight justify-between">
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
                    <div className="text-xs text-gray-700 dark:text-gray-500">
                      {lesson.duration
                        ? convertTimeWithTitles(lesson.duration, {
                            showSeconds: true,
                          })
                        : '0m 0s'}
                    </div>
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
  lesson: SanityLesson
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

const LessonList = ({
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

const SortableLessonList: React.FunctionComponent<{
  lessons: SanityLesson[]
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

const DraftCourseLayout: React.FunctionComponent<CoursePageLayoutProps> = ({
  lessons = [],
  course,
  ogImageUrl,
}) => {
  const {
    id: sanityCourseId,
    title,
    image_thumb_url,
    square_cover_480_url,
    instructor,
    description,
    duration,
    access_state,
    customOgImage,
    pairWithResources,
    state,
    path,
    tags,
    relatedResources,
  } = course

  const [dialogIsOpen, setDialogIsOpen] = React.useState(false)

  const ogImage = customOgImage ? customOgImage.url : ogImageUrl

  const podcast = first(
    course?.items?.filter((item: any) => item.type === 'podcast'),
  )

  logCollectionResource(course)

  const {
    full_name: name,
    avatar_url,
    slug,
    bio_short,
    twitter,
  } = instructor || {}

  const image_url = square_cover_480_url || image_thumb_url

  const imageIsTag = image_url.includes('tags/image')

  const playlists = filter(course.items, {type: 'playlist'}) || []

  const playlistLessons = playlists.reduce((acc, playlist) => {
    const lessons = playlist?.lessons ?? []
    return [...acc, ...lessons]
  }, [])

  // this is a pretty sloppy approach to fetching the next lesson
  // via playlist lessons, but those are for nested playlists in
  // playlists
  const nextLesson: any = first(playlistLessons) || first(lessons)

  const PlayButton: React.FunctionComponent<{lesson: LessonResource}> = ({
    lesson,
  }) => {
    const isContinuing =
      lesson && lesson !== first(lessons) && lesson !== first(playlistLessons)
    return lesson ? (
      <Link href={lesson.path}>
        <a
          onClick={() => {
            track(
              `clicked ${isContinuing ? 'continue' : 'start'} watching course`,
              {
                course: course.slug,
              },
            )
          }}
          className="inline-flex items-center justify-center px-6 py-4 font-semibold text-white transition-all duration-200 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <PlayIcon className="mr-2 text-blue-100" />
          {isContinuing ? 'Continue' : 'Start'} Watching
        </a>
      </Link>
    ) : null
  }

  const CourseArtwork: React.FunctionComponent<{
    path: string
    size: number
    trackText: string
  }> = ({path, size, trackText}) => {
    return path ? (
      <Link href={path}>
        <a
          onClick={() =>
            track(trackText, {
              course: course.slug,
            })
          }
        >
          <Image
            src={image_url}
            alt={`illustration for ${title}`}
            height={size}
            width={size}
            quality={100}
          />
        </a>
      </Link>
    ) : (
      <Image
        src={image_url}
        alt={`illustration for ${title}`}
        height={size}
        width={size}
        quality={100}
      />
    )
  }

  return (
    <>
      <NextSeo
        description={truncate(removeMarkdown(description), {length: 155})}
        canonical={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${path}`}
        title={title}
        titleTemplate={'%s | egghead.io'}
        twitter={{
          handle: instructor?.twitter ?? `@eggheadio`,
          site: `@eggheadio`,
          cardType: 'summary_large_image',
        }}
        openGraph={{
          title,
          url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${path}`,
          description: truncate(removeMarkdown(description), {length: 155}),
          site_name: 'egghead',
          images: [
            {
              url: ogImage,
            },
          ],
        }}
      />
      <div className="container pb-8 sm:pb-16 dark:text-gray-100">
        <div className="left-0 grid w-full grid-cols-1 gap-5 mt-10 mb-4 rounded-md md:grid-cols-5 md:gap-16">
          <div className="flex flex-col w-full h-full mx-auto md:col-span-3 md:row-start-auto max-w-screen-2xl">
            <header>
              {image_url && (
                <div className="flex items-center justify-center md:hidden">
                  <CourseArtwork
                    path={nextLesson?.path}
                    trackText="clicked course image on mobile"
                    size={imageIsTag ? 100 : 200}
                  />
                </div>
              )}
              <div className="flex justify-center my-2 space-x-3 md:justify-start md:m-0 md:mb-2">
                {access_state && (
                  <div
                    className={`${
                      access_state === 'free' ? 'bg-orange-500' : 'bg-blue-500'
                    } text-white items-center text-center py-1 px-2 rounded-full uppercase font-bold text-xs cursor-default`}
                  >
                    {access_state}
                  </div>
                )}
                <div
                  className="items-center px-2 py-1 text-xs font-bold text-center text-white uppercase bg-orange-500 rounded-full cursor-default"
                  title="Draft Course"
                >
                  Draft
                </div>
              </div>

              <TitleChangeForm title={title} sanityCourseId={sanityCourseId} />

              {/* Start of metadata block */}
              <div className="flex flex-col items-center my-6 space-y-3 md:space-y-4 md:items-start">
                {instructor && (
                  <InstructorProfile
                    name={name}
                    avatar_url={avatar_url}
                    url={slug}
                    bio_short={bio_short}
                    twitter={twitter}
                  />
                )}

                <div className="flex flex-col flex-wrap items-center md:flex-row space-y-3 md:space-y-0">
                  <TagList tags={tags} courseSlug={course.slug} />
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    {duration && (
                      <Duration duration={convertTimeWithTitles(duration)} />
                    )}
                    <span>&middot;</span>
                    <div className="flex items-center space-x-1">
                      <span>
                        {lessons.length + playlistLessons.length} lessons
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* End of metadata block */}

              <div className="flex items-center justify-center w-full mt-5 md:hidden">
                <PlayButton lesson={nextLesson} />
              </div>

              <DescriptionChangeForm
                description={description}
                sanityCourseId={sanityCourseId}
              />

              <div className="block pt-5 md:hidden">
                {get(course, 'access_state') === 'free' && (
                  <div className="p-4 my-8 border border-gray-100 rounded-md bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
                    <CommunityResource type="course" />
                  </div>
                )}
              </div>
              {!isEmpty(podcast) && (
                <CoursePodcast podcast={podcast} instructorName={name} />
              )}
              <LearnerRatings collection={course} />
              {!isEmpty(relatedResources) && (
                <div className="flex-col hidden my-12 space-y-2 md:flex">
                  <h2 className="mb-3 text-lg font-semibold">
                    You might also like these resources:
                  </h2>
                  {relatedResources.map((resource: any) => {
                    return (
                      <div key={resource.title}>
                        <HorizontalResourceCard
                          className="my-4 border border-gray-400 border-opacity-10 dark:border-gray-700"
                          resource={resource}
                          location={course.path}
                        />
                      </div>
                    )
                  })}
                </div>
              )}
            </header>
          </div>
          <div className="flex flex-col items-center justify-start mb-4 md:col-span-2 md:mb-0">
            {image_url && (
              <div className="hidden md:block">
                <CourseArtwork
                  path={nextLesson?.path}
                  size={imageIsTag ? 200 : 420}
                  trackText="clicked course image"
                />
              </div>
            )}
            {/* <div className="hidden space-y-6 md:block">
              <div className="flex justify-center w-full mt-10 mb-4">
                <PlayButton lesson={nextLesson} />
              </div>

              {get(course, 'access_state') === 'free' && (
                <div className="p-4 my-8 border border-gray-100 rounded-md bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
                  <CommunityResource type="course" />
                </div>
              )}
            </div> */}
            <section className="mt-8">
              <div className="flex flex-col mb-2 space-y-4 ">
                <div className="flex flex-row gap-4 justify-between">
                  <div>
                    <h2 className="text-lg font-bold cursor-default">
                      Conent Editor
                    </h2>
                    <div className="text-sm font-normal text-gray-600 dark:text-gray-300 cursor-default">
                      {duration && `${convertTimeWithTitles(duration)} • `}
                      {lessons.length + playlistLessons.length} lessons{' '}
                    </div>
                  </div>
                  <button
                    className="px-4 py-2 bg-blue-500  hover:bg-blue-400  text-white  rounded flex flex-row gap-1 align-middle justify-center place-self-center font-medium"
                    onClick={() => setDialogIsOpen(true)}
                  >
                    <PlusIcon className="self-center" height={16} />
                    Add Lesson
                  </button>
                </div>
              </div>

              <LessonCreationDialog
                isOpen={dialogIsOpen}
                setIsOpen={setDialogIsOpen}
                sanityCourseId={sanityCourseId}
              />
              <LessonList
                courseId={sanityCourseId}
                setDialog={setDialogIsOpen}
              />
            </section>
            {!isEmpty(pairWithResources) && (
              <div className="flex flex-col my-12 space-y-2 md:hidden">
                <h2 className="mb-3 text-lg font-semibold">
                  You might also like these resources:
                </h2>
                {pairWithResources.map((resource: any) => {
                  return (
                    <div key={resource.slug}>
                      <HorizontalResourceCard
                        className="my-4 border border-gray-400 border-opacity-10 dark:border-gray-500"
                        resource={resource}
                        location={course.path}
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

const CoursePodcast = ({
  podcast: {transcript, simplecast_uid: id},
  instructorName,
}: any) => {
  const [isOpen, setOpen] = React.useState(false)
  const {theme} = useTheme()

  if (isEmpty(id)) {
    return null
  } else {
    return (
      <div className="w-full pt-2 pb-3">
        <h3 className="my-2 text-xl font-semibold">
          {`Listen to ${instructorName} tell you about this course:`}{' '}
          {transcript && (
            <span>
              <button onClick={() => setOpen(!isOpen)}>
                {isOpen ? 'Hide Transcript' : 'Show Transcript'}
              </button>
            </span>
          )}
        </h3>
        <iframe
          height="52px"
          width="100%"
          frameBorder="no"
          scrolling="no"
          title="Podcast Player"
          seamless
          src={`https://player.simplecast.com/${id}?dark=${
            theme === 'dark'
          }&color=${theme === 'dark' && '111827'}`}
        />
        {isOpen && transcript && (
          <Markdown className="bb b--black-10 pb3 lh-copy">
            {transcript}
          </Markdown>
        )}
      </div>
    )
  }
}

export default DraftCourseLayout
