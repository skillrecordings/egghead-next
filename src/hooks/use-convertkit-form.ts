import {useFormik} from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import {type Subscriber} from '../schemas/subscriber'
// import {
//   CONVERTKIT_SIGNUP_FORM,
//   CONVERTKIT_SUBSCRIBE_API_URL,
// } from '@skillrecordings/config'

export function useConvertkitForm({
  submitUrl = process.env.NEXT_PUBLIC_CONVERTKIT_SUBSCRIBE_URL,
  formId = 0 as number,
  fields,
  onSuccess,
  onError,
}: {
  submitUrl?: string
  formId?: number
  onSuccess: (subscriber: Subscriber, email?: string) => void
  onError: (error?: any) => void
  fields?: any
}): {
  isSubmitting: boolean
  status: string
  handleChange: any
  handleSubmit: any
} {
  const {isSubmitting, status, handleChange, handleSubmit} = useFormik({
    initialStatus: '',
    initialValues: {
      email: '',
      first_name: '',
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email('Invalid email address').required('Required'),
      first_name: Yup.string(),
    }),
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async ({email, first_name}, {setStatus}) => {
      return axios
        .post(submitUrl as string, {email, first_name, form: formId, fields})
        .then((response: any) => {
          const subscriber: Subscriber = response.data
          onSuccess(subscriber, email)
          setStatus('success')
          if (!subscriber) {
            setStatus('error')
          }
        })
        .catch((error: Error) => {
          onError(error)
          setStatus('error')
          console.error(error)
        })
    },
  })

  return {isSubmitting, status, handleChange, handleSubmit}
}
