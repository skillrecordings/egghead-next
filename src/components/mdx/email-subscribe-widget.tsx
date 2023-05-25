import React from 'react'
import Image from 'next/image'
import {Formik, Field, Form} from 'formik'
import useCio from 'hooks/use-cio'
import {trpc} from 'trpc/trpc.client'
import {format} from 'date-fns'
import emailIsValid from 'utils/email-is-valid'
import {set} from 'lodash'

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
  const [isSubmitted, setIsSubmitted] = React.useState(false)
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
            const {email, portfolio, fullStack2023, typescript} = values

            const currentDateTime = Math.floor(Date.now() * 0.001) // Customer.io uses seconds with their UNIX epoch timestamps

            const selectedInterests = {
              ...(portfolio && {portfolio: currentDateTime}),
              ...(fullStack2023 && {fullStack2023: currentDateTime}),
              ...(typescript && {typescript: currentDateTime}),
            }

            let id = subscriber?.id

            if (!id) {
              await identify.mutateAsync({email, selectedInterests})
            } else {
              // TODO: adjust so the component is hidden if user is subscribed
              await identify.mutateAsync({id, selectedInterests})
            }

            setIsSubmitted(true)
          }}
        >
          {({values, errors, touched, isSubmitting}) => {
            if (!isSubmitted) {
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
                    <label className="pb-1">
                      <Field type="checkbox" name="portfolio" />
                      <span className="pl-2">Portfolio Building</span>
                    </label>
                    <label className="pb-1">
                      <Field type="checkbox" name="fullStack2023" />
                      <span className="pl-2">Full-Stack in 2023</span>
                    </label>
                    <label className="pb-6">
                      <Field type="checkbox" name="typescript" />
                      <span className="pl-2">TypeScript</span>
                    </label>
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
        <h2 className="text-3xl leading-tight font-bold">Your time matters.</h2>
        <p className="pt-2">
          Our tutorials will respect it and keep you up to date.
        </p>
        <div className="flex flex-col h-full w-full justify-center">
          <div className="flex flex-row justify-center">
            <Image
              width={280}
              height={280}
              src="https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/490/full/EGH_BeginnersReact2.png"
            ></Image>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailSubscribeWidget
