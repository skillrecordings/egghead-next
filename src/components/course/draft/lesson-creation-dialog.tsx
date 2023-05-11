import {Dialog, Transition} from '@headlessui/react'
import VideoUploader from 'components/upload/video-uploader'
import {Field, Form, Formik} from 'formik'
import useFileUploadReducer from 'hooks/use-file-upload-reducer'
import React from 'react'
import toast from 'react-hot-toast'
import {trpc} from 'trpc/trpc.client'
import cx from 'classnames'
import Spinner from 'components/spinner'
import {twMerge} from 'tailwind-merge'

const LessonCreationForm: React.FunctionComponent<any> = ({
  setIsOpen,
  sanityCourseId,
}) => {
  const [fileUploadState, dispatch] = useFileUploadReducer([])
  const trpcUtils = trpc.useContext()

  const isUploaded = fileUploadState.files[0]?.percent === 100

  const createLessonMutation = trpc.instructor.createLesson.useMutation<{
    description: string
    sanityCourseId: string
    title: string
  }>({
    onSuccess: (data) => {
      trpcUtils.instructor.invalidate()
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
              <label
                className={twMerge(
                  'flex justify-center h-32 px-4 transition-all bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none',
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
                  'flex justify-center h-32 px-4 transition-all bg-white border-2 border-gray-300 rounded-md appearance-none hover:border-gray-400 focus:outline-none',
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

export const LessonCreationDialog = ({
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
