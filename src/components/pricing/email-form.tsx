import stripeCheckoutRedirect from 'api/stripe/stripe-checkout-redirect'
import {Formik} from 'formik'
import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import {track} from 'utils/analytics'
import axios from 'utils/configured-axios'
import * as yup from 'yup'

const loginSchema = yup.object().shape({
  email: yup.string().email().required('enter your email'),
})

type EmailFormProps = {
  priceId: string
  redirectURL?: string
}

const EmailForm: React.FunctionComponent<EmailFormProps> = ({
  priceId,
  redirectURL,
}) => {
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [isError, setIsError] = React.useState<boolean | string>(false)

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
      track('checkout: redirect to stripe', {priceId}).then(() =>
        stripeCheckoutRedirect(priceId, email, stripeCustomerId, redirectURL),
      )
    }
  }

  return (
    <div className="text-text dark:text-gray-100 w-full  mx-auto flex flex-col justify-center sm:mt-24 mt-5">
      <img
        className="sm:w-40 sm:h-40 w-32 h-32 mx-auto mb-8"
        src={
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1604394864/climbers.png'
        }
        alt="egghead climbers"
      />
      <div className="sm:mx-auto sm:w-full sm:max-w-md rounded-lg">
        <h2 className="text-center text-3xl leading-9 font-semibold text-gray-900 dark:text-gray-100">
          Please provide your email address to join.
        </h2>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className=" pb-8 px-4 sm:px-8">
            {!isSubmitted && !isError && (
              <Formik
                initialValues={{email: ''}}
                validationSchema={loginSchema}
                onSubmit={(values) => {
                  track('checkout: submitted email', {email: values.email})
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
                              className="bg-gray-200 dark:text-gray-900 focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 px-4 block w-full appearance-none leading-normal"
                            />
                          </div>
                        </div>
                        <div className="flex justify-center items-center w-full mt-6">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className=" transition duration-150 ease-in-out dark:bg-gray-600 bg-gray-900 hover:bg-gray-700 hover:shadow-xl text-white font-semibold py-3 px-5 rounded"
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
              <div className="text-text">
                <p>Redirecting to Stripe payments.</p>
              </div>
            )}
            {isError && (
              <ReactMarkdown className="prose dark:prose-dark sm:dark:prose-xl-dark sm:prose-xl">
                {isError.toString()}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailForm
