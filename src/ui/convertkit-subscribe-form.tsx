import * as React from 'react'
import {Input} from './input'
import {Label} from './label'
import {Button} from './button'
import {type Subscriber} from '../schemas/subscriber'
import {useConvertkitForm} from '../hooks/use-convertkit-form'
import queryString from 'query-string'
import {CK_SUBSCRIBER_KEY} from '@skillrecordings/config'
import Spinner from '../spinner'

export type SubscribeFormProps = {
  actionLabel?: string
  successMessage?: string | React.ReactElement
  errorMessage?: string | React.ReactElement
  submitButtonElem?: React.ReactElement
  onError?: (error?: any) => void
  onSuccess?: (subscriber?: Subscriber, email?: string) => void
  formId?: number
  subscribeApiURL?: string
  id?: string
  fields?: Record<string, string>
  [rest: string]: any
}

/**
 * This form posts to a designated api URL (assumes `/api/convertkit/subscribe
 * by default`)
 *
 * Styling is handled by css! In the following example we utilize Tailwind and `@apply`
 *
 * @example
 * ```css
 * [data-sr-convertkit-subscribe-form] {
 *     @apply flex flex-col w-full max-w-[340px] mx-auto;
 *     [data-sr-input] {
 *         @apply block mb-4 w-full px-4 py-3 border placeholder-opacity-60 bg-opacity-50 rounded-lg shadow sm:text-base sm:leading-6;
 *     }
 *     [data-sr-input-label] {
 *         @apply font-medium pb-1 inline-block;
 *     }
 *     [data-sr-input-asterisk] {
 *         @apply opacity-50;
 *     }
 *     [data-sr-button] {
 *         @apply pt-4 pb-5 mt-4 flex items-center justify-center rounded-lg text-black bg-yellow-500 hover:bg-opacity-100 transition font-bold text-lg focus-visible:ring-yellow-200 hover:scale-105 hover:-rotate-1 hover:bg-yellow-400;
 *     }
 * }
 *```
 * @param formId the Convertkit form id, defaults to `process.env.NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM`
 * @param submitButtonElem an element to use as the button for the form submit
 * @param errorMessage A string or element representing the message shown on error
 * @param successMessage A string or element representing the message shown on success
 * @param actionLabel Label for the button (not used if submitButtonElem is used)
 * @param onError function to call on error
 * @param onSuccess function to call on success
 * @param subscribeApiURL optional param to override the api url that gets posted to
 * @param fields custom subscriber fields to create or update
 * @param rest anything else!
 * @constructor
 */
export const SubscribeToConvertkitForm: React.FC<
  React.PropsWithChildren<SubscribeFormProps>
> = ({
  formId,
  submitButtonElem,
  errorMessage = <p>Something went wrong.</p>,
  successMessage = <p>Thanks!</p>,
  actionLabel = 'Subscribe',
  onError = () => {},
  onSuccess = () => {},
  subscribeApiURL,
  id,
  fields,
  ...rest
}) => {
  const {isSubmitting, status, handleChange, handleSubmit} = useConvertkitForm({
    formId,
    onSuccess,
    onError,
    fields,
    submitUrl: subscribeApiURL,
  })

  return (
    <form
      data-sr-convertkit-subscribe-form={status}
      onSubmit={handleSubmit}
      {...rest}
    >
      <Label
        data-sr-input-label=""
        htmlFor={id ? `first_name_${id}` : 'first_name'}
      >
        First Name
      </Label>
      <Input
        className="h-auto"
        name="first_name"
        id={id ? `first_name_${id}` : 'first_name'}
        onChange={handleChange}
        placeholder="Preferred name"
        type="text"
      />
      <Label data-sr-input-label="" htmlFor={id ? `email_${id}` : 'email'}>
        Email*
      </Label>
      <Input
        className="h-auto"
        name="email"
        id={id ? `email_${id}` : 'email'}
        onChange={handleChange}
        placeholder="you@example.com"
        type="email"
        required
      />
      {submitButtonElem ? (
        React.cloneElement(submitButtonElem, {
          type: 'submit',
          disabled: Boolean(isSubmitting),
          children: isSubmitting ? (
            <Spinner className="w-5 h-5" />
          ) : (
            submitButtonElem.props.children
          ),
        })
      ) : (
        <Button
          variant="default"
          size="lg"
          disabled={Boolean(isSubmitting)}
          type="submit"
        >
          {isSubmitting ? <Spinner className="w-5 h-5" /> : actionLabel}
        </Button>
      )}
      {status === 'success' &&
        (React.isValidElement(successMessage) ? (
          successMessage
        ) : (
          <p>{successMessage}</p>
        ))}
      {status === 'error' &&
        (React.isValidElement(errorMessage) ? (
          errorMessage
        ) : (
          <p>{errorMessage}</p>
        ))}
    </form>
  )
}

export default SubscribeToConvertkitForm

export const redirectUrlBuilder = (
  subscriber: Subscriber,
  path: string,
  queryParams?: {
    [key: string]: string
  },
) => {
  const url = queryString.stringifyUrl({
    url: path,
    query: {
      [CK_SUBSCRIBER_KEY]: subscriber.id,
      email: subscriber.email_address,
      ...queryParams,
    },
  })
  return url
}
