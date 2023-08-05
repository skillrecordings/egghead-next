import {CheckCircleIcon, XCircleIcon} from '@heroicons/react/solid'
import {useMachine} from '@xstate/react'
import {RequestDraftCourseFormProps} from 'components/layouts/draft-course-page-layout'
import Spinner from 'components/spinner'
import {Formik} from 'formik'
import {
  DoneEventObject,
  requestDraftCourseChangeMachine,
} from 'machines/draft-course-machine'
import toast from 'react-hot-toast'
import cx from 'classnames'
import {trpc} from 'trpc/trpc.client'
import Markdown from 'components/markdown'

export const DescriptionChangeForm: React.FunctionComponent<
  React.PropsWithChildren<RequestDraftCourseFormProps>
> = ({description, sanityCourseId}) => {
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

  const isEditingOrSubmtting = state.matches('edit') || state.matches('loading')
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
                        isEditingOrSubmtting ? values.description : description
                      }
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoFocus
                      required
                      disabled={isSubmitting || !state.matches('edit')}
                      className="bg-gray-50 dark:bg-gray-800 focus:outline-none focus:shadow-outline border border-gray-100 dark:border-gray-700 rounded-md w-full appearance-none  prose text-gray-900 dark:prose-dark md:prose-lg md:dark:prose-lg-dark dark:text-gray-100 dark:prose-a:text-blue-300 dark:hover:prose-a:text-blue-200 prose-a:text-blue-500 hover:prose-a-:text-blue-600 "
                    />
                  </div>
                ) : (
                  <>
                    <div
                      className="container px-0 cursor-pointer border-2 border-transparent hover:box-border hover:border-2 hover:border-blue-500 rounded hover:bg-gray-100 hover:dark:bg-gray-800 min-h-[40rem]"
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
