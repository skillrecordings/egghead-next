import React, {FunctionComponent} from 'react'
import {Formik} from 'formik'

type CommentFieldProps = {
  onSubmit?: any
}

const CommentField: FunctionComponent<CommentFieldProps> = ({
  onSubmit = () => {},
}) => {
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [isError, setIsError] = React.useState(false)

  return (
    <div className="dark:text-white">
      {!isError && (
        <Formik
          initialValues={{newCommentText: ''}}
          onSubmit={({newCommentText}, {resetForm}) => {
            setIsSubmitted(true)
            onSubmit(newCommentText)
            resetForm()
          }}
        >
          {(props) => {
            const {
              values,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
            } = props
            return (
              <div className="max-w-2xl">
                <form onSubmit={handleSubmit} className="w-full space-y-2">
                  <textarea
                    id="newCommentText"
                    value={values.newCommentText}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your comment..."
                    className="form-textarea p-3 dark:text-white dark:bg-gray-800 text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-blue-500 block w-full border-gray-300 dark:border-gray-700 rounded-md resize-none"
                    required
                    css={{
                      minHeight: '120px',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="transition-all text-sm duration-150 ease-in-out bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:scale-105 transform hover:shadow-xl text-white font-semibold py-2 px-4 rounded-md"
                  >
                    Send
                  </button>
                </form>
              </div>
            )
          }}
        </Formik>
      )}
      {isError && <div className="text-red-500">error</div>}
    </div>
  )
}

export default CommentField
