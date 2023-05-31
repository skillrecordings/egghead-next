import React from 'react'
import Image from 'next/image'
import {Formik, Field, Form} from 'formik'
import useCio from 'hooks/use-cio'
import {trpc} from 'trpc/trpc.client'
import emailIsValid from 'utils/email-is-valid'
import toast from 'react-hot-toast'

const validateEmail = (value: string) => {
  let error
  if (!value) {
    error = 'Email is required'
  }
  if (value && !emailIsValid(value)) {
    error = 'Invalid email address'
  }
  return error
}

const EmailSubscribeWidget = (props: any) => {
  const {subscriber} = useCio()
  const [hidden, setHidden] = props.hideCTAState

  const identify = trpc.customerIO.identify.useMutation({
    onSuccess: (data) => {
      console.log(
        'SUCCESS: Customer.io identification in EmailSubscribeWidget',
        data,
      )
    },
    onError: (error) => {
      console.log('ERROR: Customer.io failure in EmailSubscribeWidget', error)
    },
  })

  React.useEffect(() => {
    if (subscriber) {
      setHidden(true)
    }
  }, [setHidden, subscriber])

  if (!hidden) {
    return (
      <div className="grid sm:grid-cols-2  rounded-md">
        <div className="flex flex-col bg-gray-800 dark:bg-white dark:text-gray-800 text-white w-full p-6 rounded-l-md ">
          <Formik
            initialValues={{
              email: '',
              portfolio: true,
              fullStack2023: false,
              typescript: false,
            }}
            onSubmit={async (values) => {
              const {email, portfolio} = values

              const currentDateTime = Math.floor(Date.now() * 0.001) // Customer.io uses seconds with their UNIX epoch timestamps

              const selectedInterests = {
                ...(portfolio && {article_cta_portfolio: currentDateTime}),
              }

              await identify.mutateAsync({
                email,
                selectedInterests,
              })

              setHidden(true)
              toast.success('Thanks for subscribing! 🎉', {duration: 5000})
            }}
          >
            {({values, errors, touched, isSubmitting}) => {
              if (!hidden) {
                return (
                  <div>
                    <h2 className="text-3xl leading-tight font-bold">
                      Ready to pick up the pace?
                    </h2>
                    <p className="py-2">
                      Enter your email and receive regular updates on our latest
                      articles and courses
                    </p>

                    <Form className="flex flex-col">
                      <label className="flex flex-col">
                        Email:
                        <Field
                          type="email"
                          name="email"
                          placeholder="email@example.com"
                          className={`text-black rounded-md ${
                            errors.email &&
                            touched.email &&
                            'border-red-400 bg-red-200'
                          }`}
                          validate={validateEmail}
                        />
                      </label>
                      {errors.email && touched.email ? (
                        <div className="text-red-400">{errors.email}</div>
                      ) : null}
                      <p className="pt-6 pb-2 text-lg font-semibold leading-snug">
                        What do you want to take to the next level?
                      </p>
                      <label className="pb-6">
                        <Field type="checkbox" name="portfolio" />
                        <span className="pl-2">Portfolio Building</span>
                      </label>
                      {/* TODO: Make these campaigns in CIO */}
                      {/* <label className="pb-1">
                        <Field type="checkbox" name="fullStack2023" />
                        <span className="pl-2">Full-Stack in 2023</span>
                      </label>
                      <label className="pb-6">
                        <Field type="checkbox" name="typescript" />
                        <span className="pl-2">TypeScript</span>
                      </label> */}
                      <button
                        className={`bg-blue-600 text-white rounded-md font-semibold p-1 ${
                          errors.email &&
                          touched.email &&
                          'opacity-50 cursor-not-allowed'
                        } ${isSubmitting && 'opacity-50 cursor-not-allowed'}}`}
                        type="submit"
                        disabled={
                          (errors.email && touched.email) ||
                          !values.email ||
                          isSubmitting
                        }
                      >
                        {isSubmitting ? 'SUBMITTING...' : 'SIGN UP'}
                      </button>
                    </Form>
                  </div>
                )
              } else {
                return (
                  <div>
                    <h2 className="text-3xl leading-tight font-bold">
                      You're signed up!
                    </h2>
                    <p className="py-2">Check your email for a confirmation</p>
                  </div>
                )
              }
            }}
          </Formik>
        </div>

        <div className="hidden sm:flex sm:flex-col p-6 rounded-r-md text-gray-800 bg-white dark:bg-gray-800 dark:text-white border-y-2 border-r-2 border-gray-300 dark:border-none">
          <div className="flex flex-row items-center pb-4 dark:text-white">
            <Image
              src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1569690305/transcript-images/eggo_new.png"
              alt=""
              title=""
              width={58}
              height={58}
            />
            <span className="pl-1 dark:pl-2 text-3xl font-semibold">
              egghead.io
            </span>
          </div>

          <h2 className="text-lg font-semibold leading-snug">
            We're here to help.
          </h2>
          {/* <p className="pt-2">
            Sign up for one or more of our <b>FREE</b> email courses
          </p> */}
          <p className="pt-2">
            Sign up for our <b>FREE</b> email course
          </p>
          <ul className="pt-4">
            <li className="pb-2">
              ⭐️ <b>Portfolio Building:</b> Learn how to build a badass
              developer portfolio so you can land that next job
            </li>
            {/* TODO: Make these campaigns in CIO */}
            {/* <li className="pb-2">
              ⭐️ <b>Full-Stack in 2023:</b> Build several full-stack apps using
              the latest tools and trends (Open AI, Next.js, Remix, and more)
            </li>
            <li>
              ⭐️ <b>TypeScript:</b> Build a solid foundation in TypeScript and
              learn some advanced techniques along the way
            </li> */}
          </ul>
        </div>
      </div>
    )
  } else {
    return null
  }
}

export default EmailSubscribeWidget
