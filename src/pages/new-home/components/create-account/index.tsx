import React from 'react'
import * as yup from 'yup'
import {Formik} from 'formik'
import {useViewer} from 'context/viewer-context'

const loginSchema = yup.object().shape({
  email: yup.string().email().required('enter your email'),
})

type LoginFormProps = {
  button?: string
  track?: any
}

const CreateAccount: React.FunctionComponent<LoginFormProps> = ({
  button = 'Create a free account',
  track,
}) => {
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [isError, setIsError] = React.useState(false)
  const {requestSignInEmail} = useViewer()
  return (
    <>
      <div className="w-full min-h-[110px] md:min-h-[80px]">
        {!isSubmitted && !isError && (
          <Formik
            initialValues={{email: ''}}
            validationSchema={loginSchema}
            onSubmit={(values) => {
              setIsSubmitted(true)
              requestSignInEmail(values.email)
                .then(() => {
                  track && track(values.email)
                })
                .catch(() => {
                  setIsSubmitted(false)
                  setIsError(true)
                })
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
                <>
                  <form onSubmit={handleSubmit}>
                    <div className="flex flex-col space-y-3 lg:flex-row lg:space-y-0 lg:space-x-3">
                      <div className="relative flex items-center w-full text-gray-400 lg:w-80 dark:text-white">
                        <svg
                          className="absolute w-5 h-5 left-3"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <input
                          id="email"
                          type="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="you@company.com"
                          className="block w-full py-3 pl-10 text-black placeholder-gray-400 bg-transparent border-gray-300 rounded-md shadow-sm dark:text-white autofill:text-fill-black focus:ring-indigo-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-5 py-3 font-semibold text-white transition-all duration-150 ease-in-out bg-blue-600 rounded-md lg:w-auto hover:bg-blue-700 active:bg-blue-800 hover:shadow-sm"
                      >
                        {button}
                      </button>
                    </div>
                  </form>
                </>
              )
            }}
          </Formik>
        )}
        {isSubmitted && (
          <div className="space-y-4 leading-tight">
            <h3 className="text-lg font-semibold leading-tighter">
              Please check your inbox for your sign in link.
            </h3>
            <p className="text-sm">
              Sometimes this can land in SPAM! While we hope that isn't the case
              if it doesn't arrive in a minute or three, please check.
            </p>
          </div>
        )}
        {isError && (
          <div className="text-text">
            <p>
              Login Link Not Sent{' '}
              <span role="img" aria-label="sweating">
                😅
              </span>
            </p>
            <p className="pt-3">
              Are you using an aggressive ad blocker such as Privacy Badger?
              Please disable it for this site and reload the page to try again.
            </p>
            <p className="pt-3">
              If you <strong>aren't</strong> running aggressive adblocking
              please check the console for errors and email support@egghead.io
              with any info and we will help you ASAP.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
export default CreateAccount
