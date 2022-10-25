import * as React from 'react'
import {ACCESS_TOKEN_KEY} from 'utils/auth'
import {find} from 'lodash'
import {GetServerSideProps} from 'next'
import {getAbilityFromToken} from 'server/ability'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import {useViewer} from 'context/viewer-context'
import {Formik, Form, Field, FormikProps} from 'formik'
import axios, {AxiosResponse} from 'axios'
import VideoUploader from 'components/upload/video-uploader'
import _find from 'lodash/find'
import {CourseData} from 'pages/api/sanity/lessons/create'
import useFileUploadReducer from 'hooks/use-file-upload-reducer'
import cx from 'classnames'

type Instructor = {
  _id: string
  eggheadInstructorId: string
  person: {
    _id: string
    name: string
    image: string
  }
}

type UploadedFile = {
  fileName: string
  signedUrl: string
}

type LessonMetadata = {
  title: string
  description?: string
  repoUrl?: string
  fileMetadata: UploadedFile
}

type Topic = {
  name: string
  id: string
}

type FormProps = {
  course: CourseData
  lessons: LessonMetadata[]
}

export const getServerSideProps: GetServerSideProps = async function ({req}) {
  const ability = await getAbilityFromToken(req.cookies[ACCESS_TOKEN_KEY])

  if (ability.can('upload', 'Video')) {
    const instructorQuery = groq`
      *[_type == 'collaborator' && role == 'instructor'][]{
        'person': person-> {
            _id,
            name,
            'image': image.url,
          },
        eggheadInstructorId,
        _id
      }`

    const topicQuery = groq`
      *[_type == 'software-library'][]{
        'id': _id,
        name
      }
    `

    const instructors: Instructor[] = await sanityClient.fetch(instructorQuery)
    const topics: Topic[] = await sanityClient.fetch(topicQuery)

    return {
      props: {
        instructors,
        topics,
      },
    }
  } else {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}

type SubmitResponse = AxiosResponse | undefined

const UploadWrapper = ({
  instructors,
  topics,
}: {
  instructors: Instructor[]
  topics: Topic[]
}) => {
  const initialValues: FormProps = {
    course: {
      title: '',
      collaboratorId: undefined,
      topicIds: [],
    },
    lessons: [],
  }

  const [submitResponse, setSubmitResponse] = React.useState<SubmitResponse>()

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values, actions) => {
        const response = await axios.post('api/sanity/lessons/create', {
          course: values.course,
          lessons: values.lessons,
        })

        setSubmitResponse(response)

        console.log({response})
      }}
    >
      {(props) => (
        <Upload
          {...props}
          instructors={instructors}
          topics={topics}
          submitResponse={submitResponse}
        />
      )}
    </Formik>
  )
}

const Upload: React.FC<
  FormikProps<FormProps> & {
    instructors: Instructor[]
    topics: Topic[]
    submitResponse: SubmitResponse
  }
> = (props) => {
  const {instructors, topics, submitResponse, ...formikProps} = props

  const {values, setFieldValue, isSubmitting} = formikProps
  const [fileUploadState, dispatch] = useFileUploadReducer([])
  const {viewer} = useViewer()

  const [courseInstructorId, setCourseInstructorId] = React.useState<string>(
    viewer?.instructor_id || instructors[0]?.eggheadInstructorId,
  )

  const [topicId, setTopicId] = React.useState<string>('')

  const sanityCollaboratorId: string | undefined = _find(instructors, [
    'eggheadInstructorId',
    courseInstructorId,
  ])?._id

  React.useEffect(() => {
    setFieldValue('course.topicIds', [topicId])
  }, [topicId, setFieldValue])

  React.useEffect(() => {
    setFieldValue('course.collaboratorId', sanityCollaboratorId)
  }, [sanityCollaboratorId, setFieldValue])

  React.useEffect(() => {
    // TODO: Update this to lookup lessons by nanoid instead of filename to
    // make comparisons more reliable.
    const updatedLessons = fileUploadState.files.map((file) => {
      const existingLesson = values.lessons.find(
        (lesson) => lesson.fileMetadata.fileName === file.file.name,
      )

      if (existingLesson) {
        return {
          title: existingLesson.title,
          description: existingLesson.description,
          repoUrl: existingLesson.repoUrl,
          fileMetadata: {
            ...existingLesson.fileMetadata,
            signedUrl: existingLesson.fileMetadata.signedUrl || file.signedUrl,
          },
        }
      } else {
        return {
          title: file.file.name,
          description: '',
          repoUrl: '',
          fileMetadata: {
            fileName: file.file.name,
            signedUrl: file.signedUrl,
          },
        }
      }
    })
    setFieldValue('lessons', updatedLessons)
  }, [fileUploadState.files, setFieldValue])

  const noAttachedFiles = fileUploadState.files.length === 0
  // incomplete if video uploads are still being processed
  const anyFilesCurrentlyUploading = fileUploadState.files.some(
    (file) => file.percent < 100,
  )
  const isIncomplete =
    noAttachedFiles || anyFilesCurrentlyUploading || values.course.title === ''

  const submitWasSuccessful = submitResponse?.status === 200

  const submitDisabled = isIncomplete || isSubmitting || submitWasSuccessful

  return (
    <div className="min-h-full flex">
      <div className="md:py-6 lg:py-12 container space-y-8">
        <div>
          <h2 className="mt-6 text-center text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
            egghead Course Builder
          </h2>
          <p className="mt-2 text-center text-sm">
            Start by dropping in a bunch of videos
          </p>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-white">
            Or{' '}
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create course lessons with other types of media
            </a>
          </p>
        </div>
        <Form className="space-y-4 lg:space-y-6 flex flex-col">
          <label
            htmlFor="course-name"
            className="block text-sm font-medium text-gray-700 space-y-1"
          >
            <span className="dark:text-white">Course Name*</span>
            <Field
              name="course.title"
              type="text"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </label>
          <label
            htmlFor="topicIds"
            className="block text-sm font-medium text-gray-700 space-y-1"
          >
            <span className="dark:text-white">Topic</span>
            <select
              id="topicIds"
              name="topicIds"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={topicId}
              onChange={(e) => {
                setTopicId(e.target.value)
              }}
            >
              {topics.map(({name, id}: Topic) => {
                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                )
              })}
            </select>
          </label>
          <label
            htmlFor="instructorId"
            className="block text-sm font-medium text-gray-700 space-y-1"
          >
            <span className="dark:text-white">Instructor</span>
            <select
              id="instructorId"
              name="instructorId"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={courseInstructorId}
              onChange={(e) => {
                setCourseInstructorId(e.target.value)
              }}
            >
              {instructors.map(
                ({
                  eggheadInstructorId,
                  person,
                }: {
                  eggheadInstructorId: string
                  person: {name: string}
                }) => {
                  return (
                    <option
                      key={eggheadInstructorId}
                      value={eggheadInstructorId}
                    >
                      {person['name']}
                    </option>
                  )
                },
              )}
            </select>
          </label>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-white">
              Video Files
            </label>
            <VideoUploadAlert />
          </div>
          {/* Drop zone UI adapted from https://larainfo.com/blogs/tailwind-css-drag-and-drop-file-upload-ui */}
          <label className="flex justify-center h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
            <span className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
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
          {values.lessons.map((lesson, i) => {
            const uploadState = find(
              fileUploadState.files,
              (file) => file.file.name === lesson.fileMetadata.fileName,
            )
            return (
              <div className="space-y-4 lg:space-y-6">
                <p className="block text-xs font-medium text-gray-600 dark:text-white uppercase">
                  Lesson ({i + 1}/{values.lessons.length})
                  {uploadState?.percent && ` - ${uploadState?.percent}%`}
                </p>
                <label
                  htmlFor={`lessons.${i}.title`}
                  className="block text-sm font-medium text-gray-700 space-y-1"
                >
                  <span>
                    <span className="dark:text-white">Title</span>{' '}
                    <span className="text-gray-400">
                      ({lesson.fileMetadata.fileName})
                    </span>
                  </span>
                  <Field
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    name={`lessons.${i}.title`}
                    type="text"
                  />
                </label>
                <label
                  htmlFor={`lessons.${i}.description`}
                  className="block text-sm font-medium text-gray-700 space-y-1"
                >
                  <span className="dark:text-white">Description</span>
                  <Field
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    name={`lessons.${i}.description`}
                    as="textarea"
                    rows="3"
                  />
                </label>
                <label
                  htmlFor={`lessons.${i}.repoUrl`}
                  className="block text-sm font-medium text-gray-700 space-y-1"
                >
                  <span className="dark:text-white">Repo URL</span>
                  <Field
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    name={`lessons.${i}.repoUrl`}
                    type="text"
                  />
                </label>
                <p className="mt-2 text-center text-sm text-gray-600">
                  Signed URL: {lesson.fileMetadata.signedUrl || 'processing...'}
                </p>
              </div>
            )
          })}
          <SubmitStatus submitResponse={submitResponse} />
          <button
            className={cx(
              'group relative w-full self-center max-w-md flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
              submitDisabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-indigo-700',
            )}
            type="submit"
            disabled={submitDisabled}
          >
            Save Lessons
          </button>
        </Form>
      </div>
    </div>
  )
}

const SubmitStatus = ({submitResponse}: {submitResponse: SubmitResponse}) => {
  if (!submitResponse) return null

  if (submitResponse.status === 200) {
    const studioUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://egghead-next.sanity.studio/desk'
        : 'https://egghead-next-test.sanity.studio/desk'

    return (
      <div className="rounded-md bg-green-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-green-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Course Submitted
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>
                The Course and Lesson metadata has been successfully submitted
                to Sanity Studio
              </p>
            </div>
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <a
                  href={studioUrl}
                  className="bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                >
                  View Studio
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // something went wrong with the Sanity POST
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Course Submission Failed
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>Something went wrong with the upload to Sanity</p>
            <p>Status: {submitResponse.status}</p>
            <p>Error: {submitResponse.statusText}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const VideoUploadAlert = () => {
  return (
    <div className="rounded-md bg-yellow-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Read this before uploading any videos
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <ul role="list" className="list-disc pl-5 space-y-1">
              <li>
                Drag-and-drop doesn't work (yet). Click 'Browse' and select your
                files that way.
              </li>
              <li>
                The underlying upload library can only handle up to 5 videos at
                a time. Start by selecting your first 5. Edit the lesson details
                while they upload. Once all 5 have reached 100%, you can click
                'Browse' again and select the next 5. Etc.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadWrapper
