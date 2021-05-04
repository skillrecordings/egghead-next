import stripeCheckoutRedirect from 'api/stripe/stripe-checkout-redirect'
import {Formik} from 'formik'
import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import {bpMinSM} from 'utils/breakpoints'
import {track} from 'utils/analytics'
import axios from 'utils/configured-axios'
import * as yup from 'yup'
import Stepper from 'components/pricing/stepper'
import Spinner from 'components/spinner'
import getTracer from '../../../utils/honeycomb-tracer'
import {GetServerSideProps} from 'next'
import {setupHttpTracing} from 'utils/tracing-js/dist/src/index'
import {useRouter} from 'next/router'

const loginSchema = yup.object().shape({
  email: yup.string().email().required('enter your email'),
})

type EmailFormProps = {
  priceId: string
  quantity?: number
}

const Email: React.FunctionComponent<EmailFormProps> & {getLayout: any} = ({
  priceId,
  quantity = 1,
}) => {
  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false)
  const [isError, setIsError] = React.useState<boolean | string>(false)
  const router = useRouter()

  React.useEffect(() => {
    if (!priceId) {
      //no price id needs to select a price
      router.push('/pricing')
    }
  }, [priceId])

  const validateEmail = async (email: string) => {
    setIsSubmitted(true)
    const {hasProAccess, stripeCustomerId} = await axios
      .post(`/api/users/check-pro-status`, {
        email,
      })
      .then(({data}) => data)

    if (hasProAccess) {
      setIsError(
        `You've already got a pro account at ${email}. [Please login](/login).`,
      )
    } else {
      setIsError(false)
      track('checkout: redirect to stripe', {priceId})
        .then(() =>
          stripeCheckoutRedirect({priceId, email, stripeCustomerId, quantity}),
        )
        .catch((error) => {
          setIsError(error)
        })
    }
  }

  return (
    <div
      className="sm:-mx-5 sm:-mt-5 -mx-5 -mt-3 sm:dark:bg-gray-1000 sm:bg-gray-100 sm:py-24 h-screen"
      css={{
        [bpMinSM]: {
          backgroundImage:
            'url(https://res.cloudinary.com/dg3gyk0gu/image/upload/v1613073056/next.egghead.io/backgrounds/grid-of-course-artworks_2x.png)',
          backgroundSize: 'cover',
        },
      }}
    >
      <div className="flex flex-col items-center sm:border-2 sm:dark:border-gray-800 sm:border-gray-200 sm:rounded-lg sm:max-w-md mx-auto overflow-hidden">
        <div className="dark:sm:bg-gray-800 dark:bg-gray-1000 sm:bg-gray-100 bg-gray-100 dark-text-white dark:text-white text-gray-900 py-6 w-full flex items-center justify-center">
          <Stepper />
        </div>
        <div className="sm:mx-auto sm:w-full dark:bg-gray-900 bg-white px-5">
          <div>
            <h2 className="py-6 text-center sm:text-2xl text-xl leading-tight font-semibold ">
              Please provide your email address to create an account.
            </h2>
            <div className=" pb-8 px-4 sm:px-8">
              {!isSubmitted && !isError && (
                <Formik
                  initialValues={{email: ''}}
                  validationSchema={loginSchema}
                  onSubmit={(values) => {
                    track('checkout: submitted email', {
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
                                className="bg-gray-100 dark:text-white dark:bg-gray-800 focus:ring-blue-500  border border-gray-200 dark:border-gray-700 rounded-md py-3 px-4 block w-full"
                              />
                            </div>
                          </div>
                          <div className="flex justify-center items-center w-full mt-6">
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full transition duration-150 ease-in-out  bg-blue-600 hover:bg-blue-700 hover:shadow-xl text-white font-semibold py-4 px-6 rounded-md"
                            >
                              Proceed to Payment
                            </button>
                          </div>
                        </form>
                      </>
                    )
                  }}
                </Formik>
              )}
              {isSubmitted && !isError && (
                <div className="flex items-center justify-center py-16">
                  <Spinner className="mr-2" />
                  <p>Redirecting to Stripe payments</p>
                </div>
              )}
              {isError && (
                <ReactMarkdown className="text-center py-16 prose dark:prose-dark sm:dark:prose-xl-dark sm:prose-xl">
                  {isError.toString()}
                </ReactMarkdown>
              )}
            </div>
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
    },
  }
}

Email.getLayout = (Page: any, pageProps: any) => {
  return <Page {...pageProps} />
}

export default Email
