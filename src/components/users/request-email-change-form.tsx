import React from 'react'
import {Formik} from 'formik'
import * as yup from 'yup'
import axios from 'axios'
import {useMachine} from '@xstate/react'
import {
  requestEmailChangeMachine,
  DoneEventObject,
} from 'machines/request-email-change-machine'

const emailChangeSchema = yup.object().shape({
  email: yup.string().email().required('enter your email'),
})

export type RequestEmailChangeFormProps = {
  originalEmail: string
}

async function requestEmailChange(newEmail: string) {
  const {data} = await axios.post(
    `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/email_change_requests`,
    {
      email: newEmail,
    },
  )

  return data
}

const RequestEmailChangeForm: React.FunctionComponent<RequestEmailChangeFormProps> = ({
  originalEmail,
}) => {
  const [state, send] = useMachine(requestEmailChangeMachine, {
    services: {
      requestChange: (_, event: DoneEventObject) => {
        return requestEmailChange(event.data.newEmail)
      },
    },
  })

  return (
    <Formik
      initialValues={{email: originalEmail}}
      validationSchema={emailChangeSchema}
      onSubmit={async (values) => {
        send({type: 'SUBMIT', data: {newEmail: values.email}})
      }}
    >
      {(props) => {
        const {
          values,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
        } = props
        return (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-2">
              <h2 className="text-xl pb-1 border-b border-gray-200 dark:border-gray-800">
                Email
              </h2>
              <p>Your email address:</p>
              <div className="text-sm text-gray-600 dark:text-gray-200">
                {state.matches('edit') && (
                  <p>
                    To ensure that you have access to this email address, we
                    will send an email to that account with a confirmation link.
                  </p>
                )}
                {state.matches('success') && !state.context.error && (
                  <p>
                    Your email change request has been received. A confirmation
                    email has been sent to {state.context.newEmail}.
                  </p>
                )}
                {state.matches('success') && !!state.context.error && (
                  <p>
                    We weren't able to automatically update your email. Please
                    contact{' '}
                    <a
                      className="font-bold hover:text-blue-600 transition-colors ease-in-out duration-150"
                      href="mailto:support@egghead.io"
                    >
                      support@egghead.io
                    </a>{' '}
                    to get further help with this request.
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <input
                  id="email"
                  type="email"
                  value={state.matches('edit') ? values.email : originalEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="you@company.com"
                  required
                  disabled={isSubmitting || !state.matches('edit')}
                  className="bg-gray-50 dark:bg-gray-800 focus:outline-none focus:shadow-outline border border-gray-100 dark:border-gray-700 rounded-md py-2 px-4 block w-full appearance-none leading-normal"
                />
                {state.matches('edit') || state.matches('loading') ? (
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded"
                      disabled={isSubmitting}
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => {
                        setFieldValue('email', originalEmail)
                        send({type: 'CANCEL'})
                      }}
                      className="text-black bg-gray-200 border-0 py-2 px-8 focus:outline-none hover:bg-gray-300 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => send({type: 'EDIT'})}
                    className="text-white bg-orange-600 border-0 py-2 px-8 focus:outline-none hover:bg-orange-700 rounded-md"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </form>
        )
      }}
    </Formik>
  )
}

export default RequestEmailChangeForm
