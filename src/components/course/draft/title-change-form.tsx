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

export const TitleChangeForm: React.FunctionComponent<
  React.PropsWithChildren<RequestDraftCourseFormProps>
> = ({title, sanityCourseId}) => {
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
                        <XCircleIcon
                          className={`text-red-400
                          ${cx({
                            'text-gray-400': !state.matches('loading'),
                          })}
                        `}
                          height={20}
                        />
                      </button>
                      <Spinner
                        size={4}
                        className={`text-black dark:text-white ${cx({
                          hidden: !state.matches('loading'),
                        })}`}
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
