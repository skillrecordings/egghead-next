import React, {FunctionComponent} from 'react'
import * as yup from 'yup'
import {Formik} from 'formik'
import {useViewer} from 'context/viewer-context'

const loginSchema = yup.object().shape({
  email: yup.string().email().required('enter your email'),
})

type LoginFormProps = {
  HeaderImageComponent?: React.FC
  className?: string
  button?: string
  label?: string
  formClassName?: string
  onSubmit: (value: any, setIsError: any) => void
}

const EmailForm: FunctionComponent<LoginFormProps> = ({
  HeaderImageComponent,
  className,
  children,
  button = 'Email a login link',
  label = 'Email address',
  formClassName = '',
  onSubmit = () => {},
}) => {
  const [isSubmitted, setIsSubmitted] = React.useState(false) // false
  const [isError, setIsError] = React.useState(false)

  return (
    <div
      className={
        className
          ? className
          : 'w-full mx-auto md:py-32 py-16 flex flex-col items-center justify-center text-gray-900 dark:text-gray-100'
      }
    >
      {HeaderImageComponent && <HeaderImageComponent />}
      <div
        className={`sm:mx-auto rounded-lg ${
          !HeaderImageComponent ? 'mt-0' : 'mt-5'
        }`}
      >
        {isSubmitted && (
          <h1 className="text-center text-3xl leading-9 font-bold">
            Thank you so much!
          </h1>
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
              <h2 className="text-center text-3xl leading-9 font-bold">
                Sign in (or up) to egghead
              </h2>
            </>
          ))}
        <div className="mt-4 sm:mt-6 md:mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
          {!isSubmitted && !isError && (
            <Formik
              initialValues={{email: ''}}
              validationSchema={loginSchema}
              onSubmit={(values) => {
                setIsSubmitted(true)
                onSubmit(values, setIsError)
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
                        className="block leading-5 text-sm font-semibold text-gray-800"
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

                      <div className="flex justify-center items-center w-full">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="mt-4 transition-all duration-150 ease-in-out bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:scale-105 transform hover:shadow-xl text-white font-semibold py-3 px-5 rounded-md"
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
            <div className="text-center leading-tight space-y-2">
              <h3 className="text-xl leading-tighter font-semibold">
                We've got it.
              </h3>
              <p className="text-gray-600">
                We will be checking response regularly and will reach out via
                email to chat.
              </p>
            </div>
          )}
          {isError && (
            <div className="text-text">
              <p>
                Something Went Wrong{' '}
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
                please check the console for errors and email support@egghead.io
                with any info and we will help you ASAP.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmailForm
