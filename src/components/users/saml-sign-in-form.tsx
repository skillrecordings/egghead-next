import React, {FunctionComponent} from 'react'
import * as yup from 'yup'
import {Formik} from 'formik'

const loginSchema = yup.object().shape({
  email: yup.string().email().required('enter your email'),
})

type SamlSignInFormProps = {
  switchToStandardAuth: Function
}

const SamlSignInForm: FunctionComponent<SamlSignInFormProps> = ({
  switchToStandardAuth,
}) => {
  return (
    <div className="mt-4 sm:mt-6 md:mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
      <Formik
        initialValues={{user_email: ''}}
        validationSchema={loginSchema}
        onSubmit={() => {}}
      >
        {(props) => {
          const {values, isSubmitting, handleChange, handleBlur} = props
          return (
            <form
              action={`${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/saml_sessions/saml_init`}
            >
              <label
                htmlFor="email"
                className="block leading-5 text-sm font-semibold"
              >
                SSO Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  id="user_email"
                  name="user_email"
                  type="email"
                  value={values.user_email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="you@company.com"
                  className="py-3 text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-blue-500 block w-full pl-10 border-gray-300 rounded-md"
                  required
                />
                <input name="user[email]" hidden value={values.user_email} />
              </div>
              <div className="flex flex-col space-y-2">
                <div className="flex justify-center items-center w-full">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-4 transition-all duration-150 ease-in-out bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:scale-105 transform hover:shadow-xl text-white font-semibold py-3 px-5 rounded-md"
                  >
                    Continue with SSO
                  </button>
                </div>
                <a
                  className="pt-4 block text-center hover:text-blue-600 transition-colors ease-in-out duration-150"
                  href="/login"
                  onClick={(e) => {
                    e.preventDefault()
                    switchToStandardAuth()
                  }}
                >
                  Sign In (or up) with Email or OAuth
                </a>
              </div>
            </form>
          )
        }}
      </Formik>
    </div>
  )
}

export default SamlSignInForm
