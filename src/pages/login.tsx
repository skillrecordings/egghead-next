/** @jsx jsx */
import {jsx} from '@emotion/core'
import React from 'react'

import * as yup from 'yup'
import {Formik} from 'formik'
import {useViewer} from 'context/viewer-context'

const loginSchema = yup.object().shape({
  email: yup.string().email().required('enter your email'),
})

function LoginForm() {
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [isError, setIsError] = React.useState(false)
  const {requestSignInEmail} = useViewer()

  return (
    <div className="text-text w-full left-0 top-0 mx-auto flex flex-col justify-center sm:px-6 lg:px-8 px-5">
      <div className="sm:mx-auto sm:w-full sm:max-w-md rounded-lg p-8">
        <h2 className="text-center text-3xl leading-9 font-semibold text-gray-900 mt-6">
          {isSubmitted && 'Email Sent'}
          {isError && 'Something went wrong!'}
          {!isSubmitted && !isError && 'Sign into your account'}
        </h2>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className=" pb-8 px-4 sm:px-8">
            {!isSubmitted && !isError && (
              <Formik
                initialValues={{email: ''}}
                validationSchema={loginSchema}
                onSubmit={(values) => {
                  requestSignInEmail(values.email)
                    .then(() => {
                      setIsSubmitted(true)
                    })
                    .catch(() => {
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
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium leading-5 text-gray-800"
                          >
                            Email address
                          </label>
                          <div className="mt-1 rounded-md shadow-sm">
                            <input
                              autoFocus
                              id="email"
                              type="email"
                              value={values.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="you@company.com"
                              required
                              className="bg-gray-100 focus:outline-none focus:shadow-outline border-2 border-gray-200 rounded-md py-2 px-4 block w-full appearance-none leading-normal"
                            />
                          </div>
                        </div>
                        <div className="shadow-sm flex justify-center w-full mt-6">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="transition duration-150 w-full ease-in-out bg-blue-500 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded"
                          >
                            Email a Login Link
                          </button>
                        </div>
                      </form>
                    </>
                  )
                }}
              </Formik>
            )}
            {isSubmitted && (
              <div className="text-text">
                <p>Please check your inbox for your sign in link.</p>
                <p>
                  Sometimes this can land in SPAM! While we hope that isn't the
                  case if it doesn't arrive in a minute or three, please check.
                </p>
              </div>
            )}
            {isError && (
              <div className="text-text">
                <p>Login Link Not Sent 😅</p>
                <p className="pt-3">
                  Are you using an aggressive ad blocker such as Privacy Badger?
                  Please disable it for this site and reload the page to try
                  again.
                </p>
                <p className="pt-3">
                  If you <strong>aren't</strong> running aggressive adblocking
                  please check the console for errors and email
                  support@egghead.io with any info and we will help you ASAP.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Login() {
  return (
    <div className="container">
      <LoginForm />
    </div>
  )
}

export default Login
