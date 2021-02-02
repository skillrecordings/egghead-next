import React, {FunctionComponent} from 'react'
// import * as yup from 'yup'
import {Formik} from 'formik'

// const loginSchema = yup.object().shape({
//   email: yup.string().email().required('enter your email'),
// })

type CommentFieldProps = {
  url?: string
}

const CommentField: FunctionComponent<CommentFieldProps> = ({url}) => {
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [isError, setIsError] = React.useState(false)

  return url ? (
    <div className="">
      {!isError && (
        <Formik
          initialValues={{newCommentText: ''}}
          //   validationSchema={loginSchema}
          onSubmit={(values) => {
            setIsSubmitted(true)
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
                <h4 className="font-semibold mb-3">Your comment:</h4>
                <form
                  onSubmit={handleSubmit}
                  className="w-full flex flex-col md:flex-row items-end"
                >
                  <textarea
                    id="newCommentText"
                    value={values.newCommentText}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Start to type here..."
                    className="px-4 py-3 md:py-4 text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-blue-500 block w-full border-gray-300 rounded-md resize-none"
                    required
                    css={{
                      minHeight: '120px',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-4 md:mt-0 md:ml-6 transition-all duration-150 ease-in-out bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:scale-105 transform hover:shadow-xl text-white font-semibold py-3 px-5 rounded-md"
                  >
                    Send
                  </button>
                </form>
              </div>
            )
          }}
        </Formik>
      )}
      {/* {isSubmitted && <div className="text-green-500">comment sent</div>} */}
      {isError && <div className="text-red-500">error</div>}
    </div>
  ) : null
}

export default CommentField
