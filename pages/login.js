/** @jsx jsx */
import {jsx} from '@emotion/core'
import React from 'react'

import * as yup from 'yup'
import {Formik} from 'formik'
import isEmpty from 'lodash/isEmpty'
import {useEggheadUser} from '../hooks/useEggheadUser'

const loginSchema = yup.object().shape({
  email: yup.string().email().required('enter your email'),
})

function LoginForm() {
  const {requestSignInEmail} = useEggheadUser()
  const [clicked, setClicked] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  function handleClickOutside(values) {
    if (isEmpty(values.email)) {
      setClicked(false)
    }
  }
  return (
    <div className="text-text w-screen absolute left-0 top-0 mx-auto min-h-screen flex flex-col justify-center sm:px-6 lg:px-8 px-5">
      <div className="sm:mx-auto bg-background shadow-xl border border-gray-200 sm:w-full sm:max-w-md rounded-lg p-8">
        <h2 className="text-center text-3xl leading-9 font-semibold text-gray-900 mt-6">
          {isSubmitted ? 'Email Sent' : 'Sign in to your account'}
        </h2>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className=" pb-8 px-4 sm:px-8">
            {isSubmitted ? (
              <div className="text-text">
                <p>Please check your inbox for your sign in link.</p>
                <p>
                  Sometimes this can land in SPAM! While we hope that isn't the
                  case if it doesn't arrive in a minute or three, please check.
                </p>
              </div>
            ) : (
              <Formik
                initialValues={{email: ''}}
                validationSchema={loginSchema}
                onSubmit={(values) => {
                  setIsSubmitted(true)
                  requestSignInEmail(values.email)
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
                            for="email"
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
