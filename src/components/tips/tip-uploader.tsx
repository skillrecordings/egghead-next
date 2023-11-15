'use client'
import {Dialog, Transition} from '@headlessui/react'
import VideoUploader from 'components/upload/video-uploader'
import {Field, Form, Formik, ErrorMessage} from 'formik'
import useFileUploadReducer from 'hooks/use-file-upload-reducer'
import React from 'react'
import toast from 'react-hot-toast'
import {trpc} from 'app/_trpc/client'
import cx from 'classnames'
import Spinner from 'components/spinner'
import {twMerge} from 'tailwind-merge'
import {useFormikContext} from 'formik'

function toChicagoTitleCase(slug: string): string {
  const minorWords: Set<string> = new Set([
    'and',
    'but',
    'for',
    'or',
    'nor',
    'the',
    'a',
    'an',
    'as',
    'at',
    'by',
    'for',
    'in',
    'of',
    'on',
    'per',
    'to',
  ])

  return slug
    .replace(/-|_/g, ' ')
    .split(' ')
    .map((word, index, array) => {
      if (
        index > 0 &&
        index < array.length - 1 &&
        minorWords.has(word.toLowerCase())
      ) {
        return word.toLowerCase()
      }
      return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
    })
    .join(' ')
}

function removeFileExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '')
}

const formatString = (str: string) => {
  return toChicagoTitleCase(removeFileExtension(str))
}

const TipCreationForm: React.FunctionComponent<
  React.PropsWithChildren<any>
> = () => {
  const [fileUploadState, dispatch] = useFileUploadReducer([])
  const trpcUtils = trpc.useUtils()

  console.log(fileUploadState)

  const isUploaded = fileUploadState.files[0]?.percent === 100

  const {mutate: createTip} = trpc.tips.create.useMutation({
    onSuccess: async () => {
      toast.success(`Tip created.`, {
        duration: 3000,
        icon: '✅',
      })

      await trpcUtils.tips.invalidate()
    },
    onError: (error) => {
      toast.error(
        `There was a problem creating this tip. Contact egghead staff if the issue persists.`,
        {
          duration: 3000,
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
        body: undefined,
      }}
      onSubmit={async (values, {setErrors, resetForm}) => {
        const {title, body} = values
        if (!title || !fileUploadState?.files[0]?.signedUrl) {
          setErrors({
            title: 'Title is required',
          })
          return
        }

        createTip({
          title,
          body,
          awsFilename: fileUploadState.files[0].signedUrl,
        })
        resetForm()
        // await createTipMutation.mutateAsync({
        //   description: values.description,
        //   sanityCourseId,
        //   title: values.title,
        //   awsFilename: fileUploadState.files[0].signedUrl as string,
        // })
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
            <div className="w-full p-8 mt-4 space-y-4">
              <label className="text-base font-semibold">
                Enter your tip summary here
                <p className="mt-2 text-sm opacity-50 text-muted-foreground">
                  Your summary will be used to generate the title and draft body
                  text based on the transcript of the video.
                </p>
                <Field
                  as="textarea"
                  rows={5}
                  id="body"
                  value={values.body}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  disabled={isSubmitting}
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent hover:border-gray-200 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </label>
              <label
                className={twMerge(
                  'flex justify-center h-32 px-4 transition-all bg-transparent border border-gray-400 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                  cx({
                    hidden: uploadingFile,
                  }),
                )}
              >
                <span className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 dark:text-gray-200"
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
                  <span className="font-medium dark:text-gray-200">
                    Drop video files, or{' '}
                    <span className="text-blue-600 underline">browse</span>
                  </span>
                </span>
                <VideoUploader dispatch={dispatch} />
              </label>
              <label
                className={twMerge(
                  'flex justify-center h-32 px-4 transition-all bg-transparent border border-gray-400 rounded-md appearance-none hover:border-gray-200 focus:outline-none relative',
                  cx({
                    hidden: !uploadingFile,
                  }),
                )}
              >
                <div
                  className="absolute top-0 h-full bg-blue-500 -left-0 -z-10 opacity-10"
                  style={{
                    width: `${fileUploadState.files[0]?.percent ?? 0}%`,
                    transition: 'width 0.3s ease',
                  }}
                />
                <span className="flex items-center space-x-2">
                  {uploadingFile?.percent === 100 ? (
                    <>
                      ✅
                      <span className="ml-2 text-base font-medium">
                        {uploadingFile?.file?.name} uploaded
                      </span>
                      <button
                        className="px-4 py-2 text-red-500 transition-all border border-transparent rounded hover:border hover:border-red-500"
                        onClick={() => dispatch({type: 'cancel'})}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <Spinner className="text-black dark:text-white" />
                      <span className="text-base font-medium ">
                        {uploadingFile?.file?.name} uploading...
                      </span>
                    </>
                  )}
                </span>
              </label>
              {uploadingFile?.percent === 100 && (
                <>
                  <label className="text-base font-semibold">
                    Tip Title
                    <Field
                      type="input"
                      id="title"
                      placeholder={formatString(uploadingFile?.file?.name)}
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      disabled={isSubmitting}
                      className="block w-full px-4 py-2 mb-4 leading-normal prose text-gray-900 bg-transparent border border-gray-400 rounded-md appearance-none resize-y hover:border-gray-200 focus:outline-none focus:shadow-outline dark:border-gray-700 dark:prose-dark md:prose-lg md:dark:prose-lg-dark dark:text-gray-100 dark:prose-a:text-blue-300 dark:hover:prose-a:text-blue-200 prose-a:text-blue-500 hover:prose-a-:text-blue-600"
                    />
                  </label>
                  <ErrorMessage name="title" />
                </>
              )}
              <div className="mt-4 space-x-4">
                <button
                  className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-transparent disabled:text-gray-400 disabled:hover:cursor-not-allowed"
                  type="submit"
                  disabled={!isUploaded}
                >
                  Submit
                </button>
              </div>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

export default TipCreationForm
