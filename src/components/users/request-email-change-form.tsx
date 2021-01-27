import React from 'react'
import {Formik} from 'formik'
import * as yup from 'yup'
import axios from 'axios'

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
  const VIEW_MODE = 'VIEW_MODE'
  const EDIT_MODE = 'EDIT_MODE'
  const [mode, setMode] = React.useState(VIEW_MODE)

  const [
    changeRequestSubmittedFor,
    setChangeRequestSubmittedFor,
  ] = React.useState<string | null>(null)

  return (
    <Formik
      initialValues={{email: originalEmail}}
      validationSchema={emailChangeSchema}
      onSubmit={async (values) => {
        await requestEmailChange(values.email)
        setChangeRequestSubmittedFor(values.email)
        setMode(VIEW_MODE)
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
              <h2 className="text-xl border-b">Email</h2>
              <p>Your email address:</p>
              {mode === EDIT_MODE && (
                <p className="text-sm text-gray-600">
                  To ensure that you have access to this email address, we will
                  send an email to that account with a confirmation link.
                </p>
              )}
              {changeRequestSubmittedFor && (
                <p className="text-sm text-gray-600">
                  Your email change request has been received. A confirmation
                  email has been sent to {changeRequestSubmittedFor}.
                </p>
              )}
              <div className="flex flex-row space-x-2">
                <input
                  id="email"
                  type="email"
                  value={mode === VIEW_MODE ? originalEmail : values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="you@company.com"
                  required
                  disabled={isSubmitting || mode !== EDIT_MODE}
                  className="bg-gray-200 focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 px-4 block w-full appearance-none leading-normal"
                />
                {mode === VIEW_MODE && (
                  <button
                    onClick={() => setMode(EDIT_MODE)}
                    className="text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-600 rounded"
                  >
                    Edit
                  </button>
                )}
                {mode === EDIT_MODE && (
                  <>
                    <button
                      type="submit"
                      className="text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-600 rounded"
                      disabled={isSubmitting}
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => {
                        setFieldValue('email', originalEmail)
                        setMode(VIEW_MODE)
                      }}
                      className="text-black bg-gray-200 border-0 py-2 px-8 focus:outline-none hover:bg-gray-300 rounded"
                    >
                      Cancel
                    </button>
                  </>
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
