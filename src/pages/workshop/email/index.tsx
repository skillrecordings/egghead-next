import {redirectToStandardCheckout} from '@/api/stripe/stripe-checkout-redirect'
import {Formik} from 'formik'
import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import {track} from '@/utils/analytics'
import * as yup from 'yup'
import Stepper from '@/components/pricing/stepper'
import Spinner from '@/components/spinner'
import getTracer from '../../../utils/honeycomb-tracer'
import {GetServerSideProps} from 'next'
import {setupHttpTracing} from '@/utils/tracing-js/dist/src/index'
import {useRouter} from 'next/router'
import invariant from 'tiny-invariant'

const loginSchema = yup.object().shape({
  email: yup.string().email().required('enter your email'),
})

type ForeverEmailFormProps = {
  priceId: string | undefined
  quantity?: number
  coupon: string | undefined
}

const ForeverEmail: React.FunctionComponent<
  React.PropsWithChildren<ForeverEmailFormProps>
> & {getLayout: any} = ({priceId, quantity = 1, coupon}) => {
  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false)
  const [isError, setIsError] = React.useState<boolean | string>(false)
  const router = useRouter()

  React.useEffect(() => {
    if (!priceId) {
      //no price id needs to select a price
      router.push('/forever')
    }
  }, [priceId])

  const validateEmail = async (email: string) => {
    invariant(
      priceId,
      'the priceId must be set, otherwise redirect to /forever',
    )

    setIsSubmitted(true)
    setIsError(false)

    const {sessionUrl, error} = await fetch('/api/stripe/checkout/workshop', {
      method: 'POST',
      body: JSON.stringify({
        email,
        successPath: '/confirm/workshop',
        cancelPath: '/workshop/cursor',
      }),
    }).then((res) => res.json())

    console.log('sessionUrl', sessionUrl)

    if (sessionUrl) {
      router.push(sessionUrl)
    } else {
      setIsError(error)
    }
  }

  return (
    <div className="h-screen mt-5 sm:dark:bg-gray-1000 sm:bg-gray-100 sm:py-24">
      <div className="flex flex-col items-center mx-auto overflow-hidden sm:border-2 sm:dark:border-gray-800 sm:border-gray-200 sm:rounded-lg sm:max-w-md">
        <div className="flex items-center justify-center w-full py-6 text-gray-900 bg-gray-100 sm:dark:bg-gray-800 dark:bg-gray-1000 sm:bg-gray-100 dark-text-white dark:text-white">
          <Stepper />
        </div>
        <div className="px-6 pb-6 sm:px-7 sm:pb-7 md:px-10 md:pb-10 bg-white sm:mx-auto sm:w-full dark:bg-gray-900">
          <div>
            <h2 className="py-6 text-lg font-semibold leading-tight text-center sm:text-xl dark:text-white">
              Please provide your email address to create or upgrade your
              account.
            </h2>
            {!isSubmitted && !isError && (
              <div>
                <Formik
                  initialValues={{email: ''}}
                  validationSchema={loginSchema}
                  onSubmit={(values) => {
                    track('workshop checkout: submitted email', {
                      email: values.email,
                    })
                    validateEmail(values.email)
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
                              className="block leading-6 text-gray-800 dark:text-gray-300"
                            >
                              Email address
                            </label>
                            <div className="mt-1 rounded-md shadow-sm">
                              <input
                                id="email"
                                type="email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="you@company.com"
                                required
                                className="block w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md dark:text-white dark:bg-gray-800 focus:ring-blue-500 dark:border-gray-700"
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-center w-full mt-6">
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full px-6 py-4 font-semibold text-white transition duration-150 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700 hover:shadow-xl"
                            >
                              Proceed to Payment
                            </button>
                          </div>
                        </form>
                      </>
                    )
                  }}
                </Formik>
              </div>
            )}
            {isSubmitted && !isError && (
              <div className="flex items-center justify-center py-16">
                <Spinner className="mr-2" />
                <p>Redirecting to Stripe payments</p>
              </div>
            )}
            {isError && (
              <ReactMarkdown className="py-16 prose text-center dark:prose-dark sm:dark:prose-xl-dark sm:prose-xl">
                {isError.toString()}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const tracer = getTracer('pricing-email-page')

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  res,
  query,
}) {
  setupHttpTracing({name: getServerSideProps.name, tracer, req, res})

  return {
    props: {
      ...(!!query?.priceId && {priceId: query.priceId}),
      quantity: query?.quantity || 1,
      ...(!!query?.coupon && {coupon: query.coupon}),
    },
  }
}

ForeverEmail.getLayout = (Page: any, pageProps: any) => {
  return <Page {...pageProps} />
}

export default ForeverEmail
