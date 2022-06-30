import * as React from 'react'
import {ACCESS_TOKEN_KEY} from 'utils/auth'
import {find} from 'lodash'
import {GetServerSideProps} from 'next'
import {getAbilityFromToken} from 'server/ability'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import {useViewer} from 'context/viewer-context'
import {Formik, Form, Field, FormikProps} from 'formik'
import axios from 'axios'
import VideoUploader from 'components/upload/video-uploader'
import _find from 'lodash/find'
import {CourseData} from 'types'
import useFileUploadReducer from 'hooks/use-file-upload-reducer'

type FileUpload = {
  file: File
  percent: number
  message: string
  signedUrl: string | undefined
}

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

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values, actions) => {
        const response = await axios.post('api/sanity/lessons/create', {
          course: values.course,
          lessons: values.lessons,
        })

        console.log({response})
      }}
    >
      {(props) => (
        <Upload {...props} instructors={instructors} topics={topics} />
      )}
    </Formik>
  )
}

const Upload: React.FC<
  FormikProps<FormProps> & {instructors: Instructor[]; topics: Topic[]}
> = (props) => {
  const {instructors, topics, ...formikProps} = props

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
          fileMetadata: {
            ...existingLesson.fileMetadata,
            signedUrl: existingLesson.fileMetadata.signedUrl || file.signedUrl,
          },
        }
      } else {
        return {
          title: file.file.name,
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

  const submitDisabled = isIncomplete || isSubmitting

  return (
    <div className="min-h-full flex">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            egghead Course Builder
          </h2>
          <p className="mt-2 text-center text-sm">
            Start by dropping in a bunch of videos
          </p>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create course lessons with other types of media
            </a>
          </p>
        </div>
        <Form className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="course-name"
              className="block text-sm font-medium text-gray-700"
            >
              Course Name
            </label>
            <div className="mt-1">
              <Field
                name="course.title"
                type="text"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label
              htmlFor="topicIds"
              className="block text-sm font-medium text-gray-700"
            >
              Topic
            </label>
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
          </div>
          <div className="space-y-1">
            <label
              htmlFor="instructorId"
              className="block text-sm font-medium text-gray-700"
            >
              Instructor
            </label>
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
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Video Files
            </label>
            {/* Drop zone UI adapted from https://larainfo.com/blogs/tailwind-css-drag-and-drop-file-upload-ui */}
            <div className="max-w-xl">
              <label className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
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
            </div>
          </div>
          {values.lessons.map((lesson, i) => {
            const uploadState = find(
              fileUploadState.files,
              (file) => file.file.name === lesson.fileMetadata.fileName,
            )
            return (
              <div className="space-y-1">
                <p className="block text-xs font-medium text-gray-600 uppercase">
                  Lesson ({i + 1}/{values.lessons.length})
                  {uploadState?.percent && ` - ${uploadState?.percent}%`}
                </p>
                <label
                  htmlFor={`lessons.${i}.title`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Title{' '}
                  <span className="text-gray-400">
                    ({lesson.fileMetadata.fileName})
                  </span>
                </label>
                <Field
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  name={`lessons.${i}.title`}
                />
                <p className="mt-2 text-center text-sm text-gray-600">
                  Signed URL: {lesson.fileMetadata.signedUrl || 'processing...'}
                </p>
              </div>
            )
          })}
          <div>
            <button
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                submitDisabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-indigo-700'
              }`}
              type="submit"
              disabled={submitDisabled}
            >
              Save Lessons
            </button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default UploadWrapper
