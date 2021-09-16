import React, {FunctionComponent} from 'react'
import * as yup from 'yup'
import {Formik} from 'formik'
import {isEmpty} from 'lodash'
import {useViewer} from 'context/viewer-context'
import Image from 'next/image'
import {IconGithub} from 'components/pages/lessons/code-link'
import ExternalTrackedLink from '../components/external-tracked-link'
import SamlSignInForm from '../components/users/saml-sign-in-form'

const loginSchema = yup.object().shape({
  email: yup.string().email().required('enter your email'),
})

type LoginFormProps = {
  image?: React.ReactElement
  className?: string
  children?: React.ReactElement
  button?: string
  label?: string
  formClassName?: string
  track?: any
}

const STANDARD_AUTH_MODE = 'STANDARD_AUTH_MODE'
const SSO_AUTH_MODE = 'SSO_AUTH_MODE'

const LoginForm: FunctionComponent<LoginFormProps> = ({
  image = (
    <Image
      className="mx-auto"
      width={140}
      height={140}
      src={
        'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1604394864/climbers.png'
      }
      alt="egghead climbers"
    />
  ),
  className,
  children,
  button = 'Email a login link',
  label = 'Email address',
  formClassName = '',
  track,
}) => {
  const [isSubmitted, setIsSubmitted] = React.useState(false) // false
  const [isError, setIsError] = React.useState(false)
  const [authMode, setAuthMode] = React.useState(STANDARD_AUTH_MODE)
  const {requestSignInEmail} = useViewer()

  return (
    <div
      className={
        className
          ? className
          : 'w-full mx-auto md:py-32 py-16 flex flex-col items-center justify-center text-gray-900 dark:text-gray-100'
      }
    >
      {image}
      <div
        className={`sm:mx-auto rounded-lg ${
          isEmpty(image?.props) ? 'mt-0' : 'mt-5'
        }`}
      >
        {isSubmitted && (
          <h2 className="text-center text-3xl leading-9 font-bold">
            Email Sent
          </h2>
        )}
        {isError && (
          <h2 className="text-center text-3xl leading-9 font-bold">
            Something went wrong!
          </h2>
        )}
        {!isSubmitted &&
          !isError &&
          (children ? (
            children
          ) : (
            <>
              <h2 className="text-center text-3xl font-bold w-2/3 mx-auto leading-10">
                Sign in or create a free account
              </h2>
            </>
          ))}
        {authMode === SSO_AUTH_MODE ? (
          <SamlSignInForm
            switchToStandardAuth={() => {
              setAuthMode(STANDARD_AUTH_MODE)
            }}
          />
        ) : (
          <div className="mt-4 sm:mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
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
                      <form onSubmit={handleSubmit} className={formClassName}>
                        <label
                          htmlFor="email"
                          className="block leading-5 text-sm font-semibold"
                        >
                          {label}
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
                            id="email"
                            type="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="you@company.com"
                            className="py-3 text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-blue-500 block w-full pl-10 border-gray-300 rounded-md"
                            required
                          />
                        </div>

                        <div className="flex flex-col space-y-2">
                          <div className="flex justify-center items-center w-full">
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full mt-2 transition-all duration-150 ease-in-out bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-3 px-5 rounded-md"
                            >
                              {button}
                            </button>
                          </div>
                          <p className="font-bold text-sm text-center uppercase text-gray-500 dark:text-gray-400">
                            or
                          </p>
                          <ExternalTrackedLink
                            href={`${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/users/github_passthrough?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}`}
                            eventName="clicked github login"
                            className="flex justify-center mt-4 py-3 px-5 text-white bg-gray-800 hover:bg-gray-700 active:bg-gray-600 rounded-md font-medium transition-all ease-in-out duration-300"
                          >
                            <div className="flex items-center dark:text-gray-100">
                              <span className="mr-2 flex items-center justify-center">
                                <IconGithub className="fill-current" />
                              </span>
                              Sign In (or up) with GitHub
                            </div>
                          </ExternalTrackedLink>
                          <a
                            className="pt-2 block text-center hover:text-blue-600 transition-colors ease-in-out duration-150 dark:text-gray-400 text-gray-600"
                            href="/login"
                            onClick={(e) => {
                              e.preventDefault()
                              setAuthMode(SSO_AUTH_MODE)
                            }}
                          >
                            Enterprise Login (SSO)
                          </a>
                        </div>
                      </form>
                    </>
                  )
                }}
              </Formik>
            )}
            {isSubmitted && (
              <div className="text-center leading-tight space-y-4">
                <h3 className="text-xl leading-tighter font-semibold">
                  Please check your inbox for your sign in link.
                </h3>
                <p>
                  Sometimes this can land in SPAM! While we hope that isn't the
                  case if it doesn't arrive in a minute or three, please check.
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
        )}
      </div>
    </div>
  )
}

export default LoginForm
