import * as React from 'react'
import * as Yup from 'yup'
import {useViewer} from 'context/viewer-context'
import {FormikProps, useFormik} from 'formik'
import Spinner from 'components/spinner'
import {track} from 'utils/analytics'
import {useRouter} from 'next/router'

type FormikValues = {
  email: string
}

const CreateAccount: React.FC<{actionLabel?: string; location: string}> = ({
  actionLabel = (
    <>
      Start learning{' '}
      <i
        className="text-blue-50 gg-arrow-right scale-75 group-hover:translate-x-1 group-focus:translate-x-1 transition-all ease-in-out duration-200"
        aria-hidden
      />
    </>
  ),
  location,
}) => {
  const {requestSignInEmail} = useViewer()
  const router = useRouter()

  const formik: FormikProps<FormikValues> = useFormik<FormikValues>({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
    }),
    onSubmit: async ({email}) => {
      formik.setStatus('loading')
      requestSignInEmail(email)
        .then(() => {
          track(`submitted email to create free account`, {location})
        })
        .then(() => {
          formik.setStatus('submitted')
          router.push({
            pathname: '/confirm',
            query: {
              email: email,
            },
          })
        })
        .catch(() => {
          formik.setStatus('error')
        })
    },
  })
  return (
    <form onSubmit={formik.handleSubmit} className="max-w-md w-full">
      <div className="flex sm:flex-row flex-col">
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
            id={location ? `email_${location}` : 'email'}
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="you@company.com"
            className="block w-full py-3 pl-10 text-black placeholder-gray-400 bg-transparent sm:border-r-0 border-gray-300 dark:border-gray-700 sm:rounded-r-none rounded-md shadow-sm dark:text-white focus:outline-none outline-none focus:ring-0 dark:focus:border-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="sm:mt-0 mt-4 bg-blue-600 min-w-[160px] text-center dark:hover:bg-blue-500 hover:bg-blue-500 sm:rounded-l-none rounded-md px-4 sm:py-3 py-4 text-white font-medium text-sm flex-shrink-0 flex items-center justify-center transition-all ease-in-out duration-200 group focus:outline-none outline-none focus:ring-2 focus:ring-blue-700 focus:bg-blue-500 dark:focus:ring-blue-300 relative z-10"
        >
          {formik.status === 'loading' ? (
            <>
              <Spinner />
              <span className="sr-only">loading</span>
            </>
          ) : (
            actionLabel
          )}
        </button>
      </div>
      {formik.status === 'error' && (
        <p className="text-center pt-4">
          Uh-oh. Something went wrong. Please try again or email{' '}
          <a
            className="dark:text-blue-400 text-blue-500 underline"
            href="mailto:support@egghead.io"
          >
            support@egghead.io
          </a>{' '}
          if the issue persists.
        </p>
      )}
    </form>
  )
}

export default CreateAccount
